from malware import malware_playbook
from bruteforce import bruteforce_playbook

def execute_playbook(alert):

    alert_type = alert.get(
        "alert_type",
        ""
    ).lower()

    if alert_type == "malware":
        return malware_playbook(alert)

    elif alert_type == "bruteforce":
        return bruteforce_playbook(alert)

    return "Unknown Alert Type"