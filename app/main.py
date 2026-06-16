from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session

from app.schemas import Alert
from app.utils.normalization import normalize_alert

from app.models.database import Base, engine, SessionLocal
from app.models.alert import AlertDB

from app.crud.alert_crud import (
    create_alert,
    get_all_alerts,
    get_alert_by_id
)

app = FastAPI(
    title="SOAR Incident Containment Engine",
    description="Security alert ingestion and management API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)


@app.post("/alerts", tags=["Alerts"])
def create_new_alert(alert: dict):

    normalized_alert = normalize_alert(alert)

    validated_alert = Alert(**normalized_alert)

    db = SessionLocal()

    try:
        created_alert = create_alert(
            db,
            {
                "alert_type": validated_alert.alert_type,
                "source_ip": validated_alert.source_ip,
                "severity": validated_alert.severity,
                "timestamp": validated_alert.timestamp,
                "status": validated_alert.status
            }
        )

        return {
            "message": "Alert stored successfully",
            "alert_id": created_alert.id
        }

    finally:
        db.close()


@app.get("/alerts", tags=["Alerts"])
def get_alerts():

    db = SessionLocal()

    try:
        return get_all_alerts(db)

    finally:
        db.close()


@app.get("/alerts/{alert_id}", tags=["Alerts"])
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