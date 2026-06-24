from firewall import FirewallSimulator

'''fw = FirewallSimulator()

print("=== Blocking IP ===")
result = fw.block_ip("185.220.101.1")
print(result)

print("\n=== Blocked IPs ===")
print(fw.get_blocked_ips())

print("\n=== Check IP ===")
print(fw.is_blocked("185.220.101.1"))

print("\n=== Unblock IP ===")
print(fw.unblock_ip("185.220.101.1"))

print("\n=== Blocked IPs After Unblock ===")
print(fw.get_blocked_ips())'''

from malware_playbook import malware_playbook

alert = {
    "alert_type": "Malware",
    "source_ip": "185.220.101.1",
    "risk_score": 95
}

result = malware_playbook(alert)

print(result)