# SOAR Playbook Architecture

## Project Overview

The SOAR (Security Orchestration, Automation and Response) Engine automates security incident handling by executing predefined response playbooks based on incoming SIEM alerts.

The objective is to reduce manual analyst effort and improve incident response time.

---

## Architecture Components

### 1. Alert Ingestion Layer

Receives alerts from SIEM systems through the FastAPI webhook endpoint.

Example alert types:

* Brute Force Attack
* Malware Detection

---

### 2. Alert Normalization Layer

Converts different alert formats into a common structure.

Example:

```json
{
  "alert_type": "bruteforce",
  "source_ip": "192.168.1.100",
  "timestamp": "2026-06-11T10:00:00Z"
}
```

---

### 3. Playbook Engine

The Playbook Engine determines which playbook should execute based on the alert type.

Responsibilities:

* Receive normalized alert
* Select appropriate playbook
* Execute response actions
* Log all actions

---

### 4. Brute Force Playbook

Purpose:

Respond to brute force login attacks.

Actions:

1. Extract source IP
2. Check threat intelligence score
3. Block malicious IP
4. Create incident record
5. Notify SOC analyst

---

### 5. Malware Playbook

Purpose:

Respond to malware detection alerts.

Actions:

1. Extract file hash
2. Check malware reputation
3. Isolate infected host
4. Create incident record
5. Notify SOC analyst

---

## Folder Structure

```text
playbooks/
├── bruteforce.py
├── malware.py
└── engine.py
```

---

## Future Enhancements

* AbuseIPDB Integration
* VirusTotal Integration
* AWS Security Group Automation
* Case Management Dashboard
* Role-Based Access Control (RBAC)

---

