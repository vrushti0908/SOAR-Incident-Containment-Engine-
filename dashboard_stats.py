alerts = [
    {"id": 1, "alert_type": "Malware", "risk_score": 90, "status": "Open"},
    {"id": 2, "alert_type": "Brute Force", "risk_score": 65, "status": "Investigating"},
    {"id": 3, "alert_type": "Phishing", "risk_score": 30, "status": "Closed"},
    {"id": 4, "alert_type": "Malware", "risk_score": 85, "status": "Open"},
    {"id": 5, "alert_type": "Brute Force", "risk_score": 55, "status": "Open"}
]

total_alerts = len(alerts)
high_risk_alerts = sum(1 for a in alerts if a["risk_score"] > 80)
open_incidents = sum(1 for a in alerts if a["status"] == "Open")
closed_incidents = sum(1 for a in alerts if a["status"] == "Closed")

print("=" * 50)
print("SOAR DASHBOARD STATISTICS")
print("=" * 50)

print(f"Total Alerts      : {total_alerts}")
print(f"High Risk Alerts  : {high_risk_alerts}")
print(f"Open Incidents    : {open_incidents}")
print(f"Closed Incidents  : {closed_incidents}")

print("=" * 50)