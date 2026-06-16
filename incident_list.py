incidents = [
    {
        "id": 1,
        "alert_type": "Malware",
        "risk_score": 90,
        "status": "Open"
    },
    {
        "id": 2,
        "alert_type": "Brute Force",
        "risk_score": 65,
        "status": "Investigating"
    },
    {
        "id": 3,
        "alert_type": "Phishing",
        "risk_score": 40,
        "status": "Closed"
    }
]

print("=" * 60)
print("SOAR INCIDENT LIST")
print("=" * 60)

print(f"{'ID':<5}{'Alert Type':<20}{'Risk Score':<15}{'Status'}")
print("-" * 60)

for incident in incidents:
    print(
        f"{incident['id']:<5}"
        f"{incident['alert_type']:<20}"
        f"{incident['risk_score']:<15}"
        f"{incident['status']}"
    )

print("-" * 60)
print(f"Total Incidents: {len(incidents)}")