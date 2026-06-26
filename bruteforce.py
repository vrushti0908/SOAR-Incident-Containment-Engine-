from firewall import FirewallSimulator

firewall = FirewallSimulator()

def bruteforce_playbook(alert):

    risk_score = alert.get("risk_score", 0)
    failed_attempts = alert.get("failed_attempts", 0)

    if risk_score > 80 or failed_attempts > 20:

        firewall.block_ip(
            alert["source_ip"]
        )

        return "Block IP"

    elif risk_score > 50 or failed_attempts > 10:

        return "Create bruteforce Case"

    return "Log Event"