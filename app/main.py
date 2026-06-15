from fastapi import FastAPI

from app.schemas import Alert
from app.utils.normalization import normalize_alert

from app.models.database import Base, engine
from app.models.alert import AlertDB

app = FastAPI()

Base.metadata.create_all(bind=engine)

alerts = []

@app.post("/alerts")
def create_alert(alert: dict):

    normalized_alert = normalize_alert(alert)

    validated_alert = Alert(**normalized_alert)

    alerts.append(validated_alert.dict())

    return {
        "message": "Alert normalized and validated",
        "alert": validated_alert
    }


@app.get("/alerts")
def get_alerts():
    return alerts