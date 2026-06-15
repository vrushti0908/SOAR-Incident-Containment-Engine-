from fastapi import FastAPI

from app.schemas import Alert
from app.utils.normalization import normalize_alert

from app.models.database import Base, engine, SessionLocal
from app.models.alert import AlertDB

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.post("/alerts")
def create_alert(alert: dict):

    normalized_alert = normalize_alert(alert)

    validated_alert = Alert(**normalized_alert)

    db = SessionLocal()

    db_alert = AlertDB(
        alert_type=validated_alert.alert_type,
        source_ip=validated_alert.source_ip,
        severity=validated_alert.severity,
        timestamp=validated_alert.timestamp,
        status=validated_alert.status
    )

    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    db.close()

    return {
        "message": "Alert stored successfully",
        "alert": validated_alert
    }


@app.get("/alerts")
def get_alerts():
    return alerts