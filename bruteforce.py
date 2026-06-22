def bruteforce_playbook(alert):
    if alert["risk_score"] > 80:
        return "Isolate Host"

    elif alert["risk_score"] > 50:
        return "Create bruteforce Case"

    return "Log Event"