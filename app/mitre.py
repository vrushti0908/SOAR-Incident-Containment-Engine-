"""
MITRE ATT&CK technique labels for the SOAR Incident Containment Engine.

Each entry maps an internal normalized alert_type to the most specific
ATT&CK technique that covers it. Keeping this in one place means the
dashboard, the API response, and action.log all use exactly the same
labels -- no duplication, no drift.

Reference: https://attack.mitre.org/
"""

MITRE_MAPPING = {

    "bruteforce": {
        "technique_id": "T1110",
        "technique_name": "Brute Force",
        "tactic": "Credential Access",
        "tactic_id": "TA0006",
        "description": (
            "Adversaries may use brute force techniques to gain access to "
            "accounts when passwords are unknown or when password hashes are obtained."
        ),
        "url": "https://attack.mitre.org/techniques/T1110/"
    },

    "malware": {
        "technique_id": "T1059",
        "technique_name": "Command and Scripting Interpreter",
        "tactic": "Execution",
        "tactic_id": "TA0002",
        "description": (
            "Adversaries may abuse command and script interpreters to execute "
            "commands, scripts, or binaries."
        ),
        "url": "https://attack.mitre.org/techniques/T1059/"
    },

    # Additional common types -- not in current playbooks but labelled correctly
    # if a SIEM ever sends them so the engine degrades gracefully instead of
    # returning None for the technique fields.
    "phishing": {
        "technique_id": "T1566",
        "technique_name": "Phishing",
        "tactic": "Initial Access",
        "tactic_id": "TA0001",
        "description": (
            "Adversaries may send phishing messages to gain access to victim systems."
        ),
        "url": "https://attack.mitre.org/techniques/T1566/"
    },

    "ransomware": {
        "technique_id": "T1486",
        "technique_name": "Data Encrypted for Impact",
        "tactic": "Impact",
        "tactic_id": "TA0040",
        "description": (
            "Adversaries may encrypt data on target systems or on large numbers "
            "of systems in a network to interrupt availability."
        ),
        "url": "https://attack.mitre.org/techniques/T1486/"
    },

    "portscan": {
        "technique_id": "T1046",
        "technique_name": "Network Service Discovery",
        "tactic": "Discovery",
        "tactic_id": "TA0007",
        "description": (
            "Adversaries may attempt to get a listing of services running on "
            "remote hosts and local network infrastructure devices."
        ),
        "url": "https://attack.mitre.org/techniques/T1046/"
    },
}

# Fallback for any alert type we don't have a specific mapping for yet
UNKNOWN_TECHNIQUE = {
    "technique_id": "T0000",
    "technique_name": "Unknown Technique",
    "tactic": "Unknown",
    "tactic_id": "TA0000",
    "description": "Technique not yet mapped to MITRE ATT&CK.",
    "url": "https://attack.mitre.org/"
}


def get_mitre_info(alert_type: str) -> dict:
    """
    Return the MITRE ATT&CK mapping for a given alert_type string.
    Normalizes the same way engine.py does (strip spaces/underscores/hyphens,
    lowercase) so both always agree.
    """
    normalized = (
        alert_type
        .lower()
        .replace(" ", "")
        .replace("_", "")
        .replace("-", "")
    )
    return MITRE_MAPPING.get(normalized, UNKNOWN_TECHNIQUE)