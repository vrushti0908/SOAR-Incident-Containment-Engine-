def block_ip(ip):
    print(f"[ACTION] Blocking IP: {ip}")

def isolate_host(host):
    print(f"[ACTION] Isolating Host: {host}")

def create_case(alert_id):
    print(f"[ACTION] Creating Incident Case for Alert {alert_id}")

# Sample alerts
alerts = [
    {"id": 1, "risk_score": 90, "ip": "192.168.1.100", "host": "PC-101"},
    {"id": 2, "risk_score": 65, "ip": "10.0.0.25", "host": "PC-102"},
    {"id": 3, "risk_score": 30, "ip": "172.16.0.50", "host": "PC-103"}
]

print("=== RESPONSE ACTION ENGINE ===\n")

for alert in alerts:
    print(f"Processing Alert {alert['id']}")

    if alert["risk_score"] > 80:
        block_ip(alert["ip"])
        isolate_host(alert["host"])

    elif alert["risk_score"] > 50:
        create_case(alert["id"])

    else:
        print("[ACTION] Event Logged")

    print("-" * 40)