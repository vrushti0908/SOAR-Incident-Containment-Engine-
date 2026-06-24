from firewall import FirewallSimulator

firewall = FirewallSimulator()

def bruteforce_playbook(alert):

    if alert["risk_score"] > 80:

        firewall.block_ip(
            alert["source_ip"]
        )

        return "Block IP"

    elif alert["risk_score"] > 50:

        return "Create bruteforce Case"

    return "Log Event"