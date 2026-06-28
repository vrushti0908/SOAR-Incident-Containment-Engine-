isolated_hosts = []

def isolate_host(host):
    if host not in isolated_hosts:
        isolated_hosts.append(host)
        print(f"[SUCCESS] Host {host} isolated.")
    else:
        print(f"[INFO] Host {host} already isolated.")

hosts = [
    "PC-101",
    "PC-102",
    "SERVER-01"
]

print("=== HOST ISOLATION SIMULATION ===\n")

for host in hosts:
    isolate_host(host)

print("\nIsolated Hosts:")
for host in isolated_hosts:
    print("-", host)