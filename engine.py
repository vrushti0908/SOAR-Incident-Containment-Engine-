from malware import malware_playbook
from bruteforce import bruteforce_playbook
from app.mitre import get_mitre_info


def execute_playbook(alert):

    # Normalize away spaces/underscores/casing so "Brute Force", "brute_force",
    # and "bruteforce" all route correctly -- a real SIEM or a human typing a
    # test alert will send all of these.
    alert_type = alert.get(
        "alert_type",
        ""
    ).lower().replace(" ", "").replace("_", "").replace("-", "")

    # Stamp the MITRE ATT&CK technique onto the alert dict right here --
    # before the playbook runs -- so the technique is available to every
    # downstream step (playbook, logger, DB insert, API response) without
    # any of them needing to know about MITRE directly.
    mitre = get_mitre_info(alert_type)
    alert["mitre_technique_id"] = mitre["technique_id"]
    alert["mitre_technique_name"] = mitre["technique_name"]
    alert["mitre_tactic"] = mitre["tactic"]

    if alert_type == "malware":
        return malware_playbook(alert)

    elif alert_type == "bruteforce":
        return bruteforce_playbook(alert)

    return "Unknown Alert Type"