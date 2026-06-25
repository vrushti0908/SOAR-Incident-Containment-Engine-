def block_ip(ip):
    print(f"[FIREWALL] IP {ip} blocked")

def isolate_host(host):
    print(f"[EDR] Host {host} isolated")

def create_case(alert_id):
    print(f"[CASE] Incident case created for Alert {alert_id}")

alerts = [
    {"id": 1, "risk_score": 95, "ip": "192.168.1.100", "host": "PC-101"},
    {"id": 2, "risk_score": 70, "ip": "10.0.0.25", "host": "PC-102"},
    {"id": 3, "risk_score": 30, "ip": "172.16.0.50", "host": "PC-103"}
]

print("=" * 50)
print("SOAR INCIDENT RESPONSE WORKFLOW")
print("=" * 50)

for alert in alerts:

    print(f"\nProcessing Alert ID: {alert['id']}")
    print(f"Risk Score: {alert['risk_score']}")

    if alert["risk_score"] > 80:
        block_ip(alert["ip"])
        isolate_host(alert["host"])

    elif alert["risk_score"] > 50:
        create_case(alert["id"])

    else:
        print("[LOG] Event logged for monitoring")

print("\nWorkflow Execution Completed")
print("=" * 50)