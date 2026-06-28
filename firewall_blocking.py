blocked_ips = []

def block_ip(ip):
    if ip not in blocked_ips:
        blocked_ips.append(ip)
        print(f"[SUCCESS] IP {ip} has been blocked.")
    else:
        print(f"[INFO] IP {ip} is already blocked.")

def show_blocked_ips():
    print("\n=== BLOCKED IPS ===")
    if blocked_ips:
        for ip in blocked_ips:
            print(ip)
    else:
        print("No IPs blocked.")

# Simulated high-risk alerts
suspicious_ips = [
    "192.168.1.100",
    "10.0.0.25",
    "172.16.0.50"
]

print("=== FIREWALL BLOCKING SIMULATION ===\n")

for ip in suspicious_ips:
    block_ip(ip)

show_blocked_ips()