from fastapi import FastAPI
from models.alert import Alert

app = FastAPI()

alerts = []

@app.post("/alerts")
def create_alert(alert: Alert):

    alerts.append(alert.dict())

    return {
        "message": "Alert received",
        "alert": alert
    }

@app.get("/alerts")
def get_alerts():
    return alerts