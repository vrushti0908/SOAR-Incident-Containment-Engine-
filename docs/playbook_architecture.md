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
### 6. Threat Intelligence Layer

[#6-threat-intelligence-layer](#6-threat-intelligence-layer)

Purpose:

Provides enrichment data to the Playbook Engine so it can make 
informed decisions before executing containment actions. This 
layer is called by the Brute Force Playbook (Step 2) and Malware 
Playbook (Step 2) to evaluate threat severity.

Components:

- **AbuseIPDB Integration** — Retrieves community-reported abuse 
  score, total reports, and country for a given IP.
- **VirusTotal Integration** — Checks the IP against 70+ antivirus 
  engines for malicious/suspicious detections.
- **Geolocation Lookup** — Identifies city, country, ISP, and 
  timezone of the source IP for attack attribution.
- **Risk Scoring Engine** — Combines all three sources into a 
  single weighted risk score (0-100) and classifies it as LOW, 
  MEDIUM, HIGH, or CRITICAL.

Example Output:
{

"ip": "118.25.6.39",

"final_risk_score": 87,

"risk_level": "CRITICAL",

"abuse_score": 100,

"vt_malicious": 12,

"location": "Shenzhen, China",

"org": "AS45090 Tencent Cloud"

}
Folder Location: `app/enrichment/`

Files:

- `abuseipdb.py`
- `virustotal.py`
- `geolocation.py`
- `threat_intelligence_service.py`
- `risk_scorer.py`

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

* AWS Security Group Automation
* Case Management Dashboard
* Role-Based Access Control (RBAC)

---

