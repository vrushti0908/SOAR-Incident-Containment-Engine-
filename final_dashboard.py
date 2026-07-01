alerts = [
    {
        "id": 1,
        "type": "Malware",
        "risk_score": 95,
        "status": "Blocked",
        "host": "PC-101"
    },
    {
        "id": 2,
        "type": "Brute Force",
        "risk_score": 70,
        "status": "Case Created",
        "host": "PC-102"
    },
    {
        "id": 3,
        "type": "Phishing",
        "risk_score": 40,
        "status": "Monitoring",
        "host": "PC-103"
    }
]

print("=" * 65)
print("          SOAR FINAL DASHBOARD")
print("=" * 65)

total_alerts = len(alerts)
high_risk = 0

for alert in alerts:
    if alert["risk_score"] > 80:
        high_risk += 1

print(f"Total Alerts      : {total_alerts}")
print(f"High Risk Alerts  : {high_risk}")

print("\nAlert Details")
print("-" * 65)

for alert in alerts:
    print(f"Alert ID   : {alert['id']}")
    print(f"Type       : {alert['type']}")
    print(f"Risk Score : {alert['risk_score']}")
    print(f"Status     : {alert['status']}")
    print(f"Host       : {alert['host']}")
    print("-" * 65)

print("Dashboard Integration Completed Successfully")
print("=" * 65)