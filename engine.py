from malware import malware_playbook
from bruteforce import bruteforce_playbook

def execute_playbook(alert):
    if alert["type"]  == "malwrare":
        return bruteforce_playbook(alert)
    
    elif alert["type"]  == "bruteforce":
        return bruteforce_playbook(alert)
    
    return "Unknown Alert Type"
