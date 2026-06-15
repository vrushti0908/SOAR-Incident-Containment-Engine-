print("=" * 40)
print("      SOAR INCIDENT DASHBOARD")
print("=" * 40)

total_alerts = 10
high_risk = 3
blocked_ips = 2

print(f"Total Alerts      : {total_alerts}")
print(f"High Risk Alerts  : {high_risk}")
print(f"Blocked IPs       : {blocked_ips}")

print("\nRecent Incidents")
print("-" * 40)

incidents = [
    {"id": 1, "ip": "192.168.1.10", "risk": 85},
    {"id": 2, "ip": "10.0.0.5", "risk": 60},
    {"id": 3, "ip": "172.16.0.8", "risk": 30}
]

for incident in incidents:
    print(
        f"ID: {incident['id']} | "
        f"IP: {incident['ip']} | "
        f"Risk Score: {incident['risk']}"
    )