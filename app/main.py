from fastapi import FastAPI, HTTPException, Depends
from datetime import datetime
import time

from app.schemas import Alert, StatusUpdate, LoginRequest
from app.utils.normalization import normalize_alert
from app.utils.normalization import normalize_timestamp


from app.models.database import Base, engine, SessionLocal
from app.models.user import User
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    require_role
)

from app.crud.alert_crud import (
    create_alert,
    get_all_alerts,
    get_alert_by_id,
    update_alert_status
)

#from app.enrichment.abuseipdb import enrich_alert
#from app.enrichment.virustotal import enrich_alert as vt_enrich_alert
from app.enrichment.threat_intelligence_service import enrich_alert
from engine import execute_playbook
from app.models.database import SessionLocal
from app.models.firewall_model import BlockedIP
from app.models.host_isolation_model import IsolatedHost
from logger import log_action

# SLA from the project brief: full alert -> containment pipeline must finish under this
MTTR_SLA_SECONDS = 5.0





app = FastAPI(
    title="SOAR Incident Containment Engine",
    description="Security alert ingestion and management API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)


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


# TEMPORARY: gated here purely to prove the auth chain works end to end.
# Day 5 replaces this with a real approval gate on playbook execution --
# this restriction on a read-only endpoint is not the final design.
@app.get(
    "/isolated_hosts",
    tags=["EDR"],
    summary="Get Isolated Hosts (senior_analyst only -- temporary RBAC test)"
)
def get_isolated_hosts(current_user: dict = Depends(require_role("senior_analyst"))):

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
                "organization": enriched_alert.get("organization", "Unknown")

            }
        )

        log_action(
            f"Alert {created_alert.id} ({validated_alert.alert_type}) "
            f"risk={enriched_alert.get('risk_score', 0)} "
            f"-> {playbook_action} in {elapsed_seconds}s "
            f"(SLA {'met' if within_sla else 'MISSED'})"
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
            "vt_reputation": enriched_alert.get("vt_reputation", 0)

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


@app.get("/")
def root():

    return {
        "project": "SOAR Incident Containment Engine",
        "version": "1.0.0",
        "status": "Running"
    }