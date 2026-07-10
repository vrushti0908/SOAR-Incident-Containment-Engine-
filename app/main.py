from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI, HTTPException, Depends
from datetime import datetime
import time

from app.schemas import Alert, StatusUpdate, LoginRequest
from app.utils.normalization import normalize_alert
from app.utils.normalization import normalize_timestamp


from app.models.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.approval_model import PendingApproval
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    require_role
)
from app.models.approval_queue import ApprovalQueue
from host_isolation import HostIsolator

from app.crud.alert_crud import (
    create_alert,
    get_all_alerts,
    get_alert_by_id,
    update_alert_status
)
from app.models.alert import AlertDB
from app.enrichment.abuseipdb import classify_risk
from app.mitre import get_mitre_info, MITRE_MAPPING

#from app.enrichment.abuseipdb import enrich_alert
#from app.enrichment.virustotal import enrich_alert as vt_enrich_alert
from app.enrichment.threat_intelligence_service import enrich_alert
from engine import execute_playbook
from app.models.database import SessionLocal
from app.models.firewall_model import BlockedIP
from app.models.host_isolation_model import IsolatedHost
from logger import log_action
from app.routes.timeline import router as timeline_router
from app.models.timeline import TimelineEvent
from app.crud.timeline_crud import add_event


# SLA from the project brief: full alert -> containment pipeline must finish under this
MTTR_SLA_SECONDS = 5.0





app = FastAPI(
    title="SOAR Incident Containment Engine",
    description="Security alert ingestion and management API",
    version="1.0.0"
)
app.include_router(timeline_router)
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

approval_queue = ApprovalQueue()
isolator = HostIsolator()

Base.metadata.create_all(bind=engine)


@app.get(
    "/dashboard/stats",
    tags=["Dashboard"],
    summary="Aggregate stats for the dashboard UI"
)
def get_dashboard_stats():

    db = SessionLocal()

    try:
        alerts = db.query(AlertDB).all()
        total = len(alerts)

        open_cases = sum(1 for a in alerts if (a.status or "Open") == "Open")
        closed_cases = sum(1 for a in alerts if a.status == "Resolved")

        risk_counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
        country_counts = {}
        for a in alerts:
            risk_counts[classify_risk(a.risk_score or 0)] += 1
            code = (a.country or "Unknown").upper()
            country_counts[code] = country_counts.get(code, 0) + 1

        avg_mttr = round(sum(a.mttr_seconds or 0 for a in alerts) / total, 2) if total else 0

        return {
            "total_alerts": total,
            "high_risk_alerts": risk_counts["High"] + risk_counts["Critical"],
            "open_cases": open_cases,
            "closed_cases": closed_cases,
            "mttr": avg_mttr,
            "critical_count": risk_counts["Critical"],
            "high_count": risk_counts["High"],
            "medium_count": risk_counts["Medium"],
            "low_count": risk_counts["Low"],
            "blocked_ips": db.query(BlockedIP).count(),
            "isolated_hosts": db.query(IsolatedHost).count(),
            "pending_approvals": db.query(PendingApproval).filter(
                PendingApproval.status == "PENDING"
            ).count(),
            "intel_queries": total,
            "alerts_by_country": country_counts
        }

    finally:
        db.close()


@app.post(
    "/auth/login",
    tags=["Auth"],
    summary="Log in and receive a JWT"
)
def login(data: LoginRequest):

    db = SessionLocal()

    try:
        user = db.query(User).filter(User.username == data.username).first()

        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Incorrect username or password"
            )

        token = create_access_token(username=user.username, role=user.role)

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role
        }

    finally:
        db.close()


@app.get(
    "/blocked_ips",
    tags=["Firewall"],
    summary="Get Blocked IPs"
)
def get_blocked_ips():

    db = SessionLocal()

    try:
        blocked_ips = db.query(BlockedIP).all()

        return blocked_ips

    finally:
        db.close()


@app.get(
    "/isolated_hosts",
    tags=["EDR"],
    summary="Get Isolated Hosts"
)
def get_isolated_hosts():

    db = SessionLocal()

    try:
        isolated_hosts = db.query(IsolatedHost).all()

        return isolated_hosts

    finally:
        db.close()

@app.post(
    "/alerts",
    tags=["Alerts"],
    summary="Create Alert",
    description="Receive, normalize, enrich and store security alerts."
)
def create_new_alert(alert: dict):

    # MTTR timer starts the instant the alert is received
    start_time = time.perf_counter()

    normalized_alert = normalize_alert(alert)
    
    print("POST IP =", normalized_alert["source_ip"])

    # Step 2: Enrich alert
    enriched_alert = enrich_alert(normalized_alert)
    #enriched_alert = vt_enrich_alert(enriched_alert)

    # Step 3: Execute Playbook
    playbook_action = execute_playbook(enriched_alert)

    # Step 4: Add action
    enriched_alert["action"] = playbook_action

    # Step 5: Fix timestamp if missing
    if not enriched_alert.get("timestamp"):
        enriched_alert["timestamp"] = datetime.now().strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )

    print("Normalized Alert:", normalized_alert)
    print("Enriched Alert:", enriched_alert)

    # Step 6: Validate
    validated_alert = Alert(**enriched_alert)

    # MTTR timer stops once the containment decision/action has run
    elapsed_seconds = round(time.perf_counter() - start_time, 3)
    within_sla = elapsed_seconds < MTTR_SLA_SECONDS

    db = SessionLocal()

    try:

        created_alert = create_alert(
            db,
            {
                "alert_type": validated_alert.alert_type,
                "source_ip": str(validated_alert.source_ip),
                "severity": validated_alert.severity,
                "timestamp": validated_alert.timestamp,
                "status": validated_alert.status,
                "risk_score": enriched_alert.get("risk_score", 0),
                "country": enriched_alert.get("country", "Unknown"),
                "isp": enriched_alert.get("isp", "Unknown"),
                "action": playbook_action,
                "failed_attempts": alert.get("failed_attempts", 0),
                "mttr_seconds": elapsed_seconds,
                "vt_malicious": enriched_alert.get("vt_malicious", 0),
                "vt_suspicious": enriched_alert.get("vt_suspicious", 0),
                "vt_reputation": enriched_alert.get("vt_reputation", 0),
                "city": enriched_alert.get("city", "Unknown"),
                "organization": enriched_alert.get("organization", "Unknown"),
                "mitre_technique_id": enriched_alert.get("mitre_technique_id", "T0000"),
                "mitre_technique_name": enriched_alert.get("mitre_technique_name", "Unknown Technique"),
                "mitre_tactic": enriched_alert.get("mitre_tactic", "Unknown")

            }
        )
        incident_id = f"INC-{created_alert.id}"
        add_event(
            db,
            incident_id,
            "alert",
            "Alert Received",
            f"{validated_alert.alert_type} detected"
        )
        add_event(
            db,
            incident_id,
            "enrich",
            "Threat Intelligence Completed",
            f"Risk Score {enriched_alert.get('risk_score',0)}"
        )
        add_event(
            db,
            incident_id,
            "playbook",
            "Playbook Executed",
            playbook_action
        )
        add_event(
            db,
            incident_id,
            "action",
            "Containment Action",
            playbook_action
        )
        log_action(
            f"Alert {created_alert.id} ({validated_alert.alert_type}) "
            f"risk={enriched_alert.get('risk_score', 0)} "
            f"-> {playbook_action} in {elapsed_seconds}s "
            f"(SLA {'met' if within_sla else 'MISSED'})"
        )

        # The playbook decided this alert needs a human checkpoint instead of
        # auto-executing. The approval record needs a real alert_id, which
        # only exists after create_alert() above -- that's why this can't
        # live inside malware.py itself.
        approval_id = None
        if playbook_action == "Pending Approval":
            approval_id = approval_queue.request_approval(
                alert_id=created_alert.id,
                action_type="ISOLATE_HOST",
                target=enriched_alert.get("pending_host_id", "unknown-host")
            )
            log_action(
                f"Alert {created_alert.id}: ISOLATE_HOST queued as approval #{approval_id} "
                f"(target={enriched_alert.get('pending_host_id')})"
            )

        return {
            "message": "Alert stored successfully",
            "alert_id": created_alert.id,
            "alert_type": validated_alert.alert_type,
            "source_ip": validated_alert.source_ip,
            "risk_score": enriched_alert.get("risk_score", 0),
            "country": enriched_alert.get("country", "Unknown"),
            "action": playbook_action,
            "failed_attempts": alert.get("failed_attempts", 0),
            "mttr_seconds": elapsed_seconds,
            "within_sla": within_sla,
            "vt_malicious": enriched_alert.get("vt_malicious", 0),
            "vt_suspicious": enriched_alert.get("vt_suspicious", 0),
            "vt_reputation": enriched_alert.get("vt_reputation", 0),
            "approval_id": approval_id,
            "mitre_technique_id": enriched_alert.get("mitre_technique_id", "T0000"),
            "mitre_technique_name": enriched_alert.get("mitre_technique_name", "Unknown Technique"),
            "mitre_tactic": enriched_alert.get("mitre_tactic", "Unknown")

        }

    finally:
        db.close()



@app.get(
    "/alerts",
    tags=["Alerts"],
    summary="Get All Alerts",
    description="Retrieve all stored alerts."
)
def get_alerts():

    db = SessionLocal()

    try:
        return get_all_alerts(db)

    finally:
        db.close()


@app.get(
    "/alerts/{alert_id}",
    tags=["Alerts"],
    summary="Get Alert By ID",
    description="Retrieve a single alert using its ID."
)
def get_alert(alert_id: int):

    db = SessionLocal()

    try:

        alert = get_alert_by_id(db, alert_id)

        if not alert:
            raise HTTPException(
                status_code=404,
                detail="Alert not found"
            )

        return alert

    finally:
        db.close()


@app.put(
    "/alerts/{alert_id}/status",
    tags=["Alerts"],
    summary="Update Alert Status",
    description="Update the status of an existing alert."
)
def update_status(
    alert_id: int,
    data: StatusUpdate
):

    db = SessionLocal()

    try:

        alert = update_alert_status(
            db,
            alert_id,
            data.status
        )

        if not alert:
            raise HTTPException(
                status_code=404,
                detail="Alert not found"
            )

        return {
            "message": "Status updated successfully",
            "alert": alert
        }

    finally:
        db.close()


@app.get(
    "/approvals",
    tags=["Approvals"],
    summary="List pending approvals"
)
def list_approvals(current_user: dict = Depends(require_role(
    "soc_analyst", "security_engineer", "senior_analyst"
))):

    db = SessionLocal()

    try:
        return db.query(PendingApproval).all()

    finally:
        db.close()


@app.post(
    "/approvals/{approval_id}/approve",
    tags=["Approvals"],
    summary="Approve a pending high-impact action (senior_analyst only)"
)
def approve_action(
    approval_id: int,
    current_user: dict = Depends(require_role("senior_analyst"))
):

    db = SessionLocal()

    try:
        approval = db.query(PendingApproval).filter(
            PendingApproval.id == approval_id
        ).first()

        if not approval:
            raise HTTPException(status_code=404, detail="Approval not found")

        if approval.status != "PENDING":
            raise HTTPException(
                status_code=400,
                detail=f"Approval #{approval_id} is already {approval.status}"
            )

        # Only now -- after a senior analyst has explicitly signed off --
        # does the actual containment action run.
        if approval.action_type == "ISOLATE_HOST":
            isolator.isolate_host(approval.target)

        approval.status = "APPROVED"
        add_event(
            db,
            f"INC-{approval.alert_id}",
            "close",
            "Incident Approved",
            f"Approved by {current_user['username']}"
        )
        approval.reviewed_by = current_user["username"]
        approval.reviewed_at = str(datetime.now())
        db.commit()

        related_alert = db.query(AlertDB).filter(
            AlertDB.id == approval.alert_id
        ).first()
        if related_alert:
            related_alert.action = f"Isolate Host (Approved by {current_user['username']})"
            related_alert.status = "Resolved"
            db.commit()

        log_action(
            f"Approval #{approval_id} APPROVED by {current_user['username']} "
            f"-> {approval.action_type} on {approval.target}"
        )

        return {
            "message": "Action approved and executed",
            "approval_id": approval_id,
            "action_type": approval.action_type,
            "target": approval.target,
            "reviewed_by": current_user["username"]
        }

    finally:
        db.close()


@app.post(
    "/approvals/{approval_id}/reject",
    tags=["Approvals"],
    summary="Reject a pending high-impact action (senior_analyst only)"
)
def reject_action(
    approval_id: int,
    current_user: dict = Depends(require_role("senior_analyst"))
):

    db = SessionLocal()

    try:
        approval = db.query(PendingApproval).filter(
            PendingApproval.id == approval_id
        ).first()

        if not approval:
            raise HTTPException(status_code=404, detail="Approval not found")

        if approval.status != "PENDING":
            raise HTTPException(
                status_code=400,
                detail=f"Approval #{approval_id} is already {approval.status}"
            )

        approval.status = "REJECTED"
        add_event(
            db,
            f"INC-{approval.alert_id}",
            "action",
            "Containment Rejected",
            f"Rejected by {current_user['username']}"
        )
        approval.reviewed_by = current_user["username"]
        approval.reviewed_at = str(datetime.now())
        db.commit()

        related_alert = db.query(AlertDB).filter(
            AlertDB.id == approval.alert_id
        ).first()
        if related_alert:
            related_alert.action = f"Isolation Rejected by {current_user['username']}"
            db.commit()

        log_action(
            f"Approval #{approval_id} REJECTED by {current_user['username']}"
        )

        return {
            "message": "Action rejected -- host was NOT isolated",
            "approval_id": approval_id,
            "reviewed_by": current_user["username"]
        }

    finally:
        db.close()


'''@app.get("/")
def root():

    return {
        "project": "SOAR Incident Containment Engine",
        "version": "1.0.0",
        "status": "Running"
    }'''
@app.get(
    "/mitre",
    tags=["MITRE ATT&CK"],
    summary="List all mapped MITRE ATT&CK techniques"
)
def list_mitre_techniques():
    return [
        {"alert_type": k, **v}
        for k, v in MITRE_MAPPING.items()
    ]


@app.get(
    "/mitre/{alert_type}",
    tags=["MITRE ATT&CK"],
    summary="Get MITRE ATT&CK technique for a specific alert type"
)
def get_mitre_technique(alert_type: str):
    info = get_mitre_info(alert_type)
    return {
        "alert_type": alert_type,
        **info
    }


@app.get("/", include_in_schema=False)
def home():
    return FileResponse("frontend/index.html")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)