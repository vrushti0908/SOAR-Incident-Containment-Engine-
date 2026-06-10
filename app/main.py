from fastapi import FastAPI
from app.models.alert import Alert
from app.utils.normalization import normalize_alert

app = FastAPI()

alerts = []

@app.post("/alerts")
def create_alert(alert: dict):

    # Normalize incoming SIEM alert
    normalized_alert = normalize_alert(alert)

    # Validate normalized data
    validated_alert = Alert(**normalized_alert)

    alerts.append(validated_alert.dict())

    return {
        "message": "Alert normalized and validated",
        "alert": validated_alert
    }

@app.get("/alerts")
def get_alerts():
    return alerts