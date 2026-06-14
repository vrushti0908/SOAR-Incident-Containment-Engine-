class FirewallSimulator:
    def __init__(self):
        self.blocked_ips = set()

    def block_ip(self, ip):
        self.blocked_ips.add(ip)
        return {
            "action": "block_ip",
            "ip": ip,
            "status": "success"
        }

    def unblock_ip(self, ip):
        self.blocked_ips.discard(ip)
        return {
            "action": "unblock_ip",
            "ip": ip,
            "status": "success"
        }

    def get_blocked_ips(self):
        return list(self.blocked_ips)