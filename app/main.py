from fastapi import FastAPI

app = FastAPI(title="SOAR Engine")

alerts = []

@app.get("/")
def home():
    return {"message": "SOAR Engine Running"}

@app.post("/alerts")
def create_alert(alert: dict):
    alerts.append(alert)
    return {"status": "received"}

@app.get("/alerts")
def get_alerts():
    return alerts