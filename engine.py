from malware import malware_playbook
from bruteforce import bruteforce_playbook

def execute_playbook(alert):

    # Normalize away spaces/underscores/casing so "Brute Force", "brute_force",
    # and "bruteforce" all route correctly -- a real SIEM or a human typing a
    # test alert will send all of these.
    alert_type = alert.get(
        "alert_type",
        ""
    ).lower().replace(" ", "").replace("_", "").replace("-", "")

    if alert_type == "malware":
        return malware_playbook(alert)

    elif alert_type == "bruteforce":
        return bruteforce_playbook(alert)

    return "Unknown Alert Type"