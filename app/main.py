from fastapi import FastAPI
from app.models.alert import Alert

app = FastAPI(title="SOAR Engine")

alerts = []

@app.get("/")
def home():
    return {"message": "SOAR Engine Running"}

@app.post("/alerts")
def create_alert(alert: Alert):
    alerts.append(alert.dict())
    return {
        "status": "received",
        "alert": alert
    }

@app.get("/alerts")
def get_alerts():
    return alerts