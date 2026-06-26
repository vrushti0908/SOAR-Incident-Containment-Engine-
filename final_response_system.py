def block_ip(ip):
    print(f"[FIREWALL] Blocked IP: {ip}")

def isolate_host(host):
    print(f"[EDR] Isolated Host: {host}")

def create_case(alert_id):
    print(f"[CASE] Incident {alert_id} created")

def log_event(alert_id):
    print(f"[LOG] Alert {alert_id} logged for monitoring")

alerts = [
    {"id": 1, "ip": "192.168.1.100", "host": "PC-101", "risk_score": 95},
    {"id": 2, "ip": "10.0.0.25", "host": "PC-102", "risk_score": 70},
    {"id": 3, "ip": "172.16.0.50", "host": "PC-103", "risk_score": 40}
]

print("=" * 50)
print("SOAR FINAL RESPONSE SYSTEM")
print("=" * 50)

for alert in alerts:
    print(f"\nProcessing Alert ID: {alert['id']}")

    if alert["risk_score"] > 80:
        block_ip(alert["ip"])
        isolate_host(alert["host"])

    elif alert["risk_score"] > 50:
        create_case(alert["id"])

    else:
        log_event(alert["id"])

print("\nAll alerts processed successfully.")
print("=" * 50)