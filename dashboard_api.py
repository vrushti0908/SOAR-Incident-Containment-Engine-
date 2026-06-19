alerts = [
    {
        "id": 1,
        "alert_type": "Malware",
        "source_ip": "192.168.1.10",
        "risk_score": 90,
        "status": "Open"
    },
    {
        "id": 2,
        "alert_type": "Brute Force",
        "source_ip": "10.0.0.5",
        "risk_score": 65,
        "status": "Investigating"
    },
    {
        "id": 3,
        "alert_type": "Phishing",
        "source_ip": "172.16.1.20",
        "risk_score": 30,
        "status": "Closed"
    }
]

print("=" * 70)
print("SOAR INCIDENT DASHBOARD")
print("=" * 70)

for alert in alerts:
    print(f"ID         : {alert['id']}")
    print(f"Alert Type : {alert['alert_type']}")
    print(f"Source IP  : {alert['source_ip']}")
    print(f"Risk Score : {alert['risk_score']}")
    print(f"Status     : {alert['status']}")
    print("-" * 70)

total_alerts = len(alerts)
high_risk = sum(1 for alert in alerts if alert["risk_score"] > 80)
open_incidents = sum(1 for alert in alerts if alert["status"] == "Open")

print("\nDASHBOARD SUMMARY")
print("=" * 70)
print(f"Total Alerts      : {total_alerts}")
print(f"High Risk Alerts  : {high_risk}")
print(f"Open Incidents    : {open_incidents}")
print("=" * 70)