incident = {
    "id": 1,
    "alert_type": "Malware",
    "source_ip": "192.168.1.10",
    "risk_score": 90,
    "status": "Open",
    "action_taken": "Block IP"
}

print("=" * 50)
print("SOAR INCIDENT DETAILS")
print("=" * 50)

print(f"Incident ID   : {incident['id']}")
print(f"Alert Type    : {incident['alert_type']}")
print(f"Source IP     : {incident['source_ip']}")
print(f"Risk Score    : {incident['risk_score']}")
print(f"Status        : {incident['status']}")
print(f"Action Taken  : {incident['action_taken']}")

print("=" * 50)