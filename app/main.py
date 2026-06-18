from fastapi import FastAPI, HTTPException

from app.schemas import Alert, StatusUpdate
from app.utils.normalization import normalize_alert

from app.models.database import Base, engine, SessionLocal

from app.crud.alert_crud import (
    create_alert,
    get_all_alerts,
    get_alert_by_id,
    update_alert_status
)

from app.enrichment.abuseipdb import enrich_alert


app = FastAPI(
    title="SOAR Incident Containment Engine",
    description="Security alert ingestion and management API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)


@app.post(
    "/alerts",
    tags=["Alerts"],
    summary="Create Alert",
    description="Receive, normalize, enrich and store security alerts."
)
def create_new_alert(alert: dict):

    # Step 1: Normalize alert
    normalized_alert = normalize_alert(alert)
    print("POST IP =", normalized_alert["source_ip"])
    # Step 2: Enrich alert with Threat Intelligence
    enriched_alert = enrich_alert(normalized_alert)

    # Step 3: Validate using Pydantic schema
    validated_alert = Alert(**enriched_alert)

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

                # Threat Intelligence Fields
                "risk_score": enriched_alert.get(
                    "risk_score", 0
                ),
                "abuse_confidence_score": enriched_alert.get(
                    "abuse_confidence_score", 0
                ),
                "total_reports": enriched_alert.get(
                    "total_reports", 0
                ),
                "country": enriched_alert.get(
                    "country", "Unknown"
                ),
                "isp": enriched_alert.get(
                    "isp", "Unknown"
                )
            }
        )

        return {
            "message": "Alert stored successfully",
            "alert_id": created_alert.id,
            "alert_type": validated_alert.alert_type,
            "source_ip": validated_alert.source_ip,
            "risk_score": enriched_alert.get(
                "risk_score", 0
            ),
            "country": enriched_alert.get(
                "country", "Unknown"
            )
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