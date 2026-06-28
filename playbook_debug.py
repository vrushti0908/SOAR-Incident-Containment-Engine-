form playbooks.malware import malware_playbook

def test_malware():
    alert = {"risk_score": 90}

    result = malware_playbook(alert)
_
    assert result["action"] == "block_ip"
