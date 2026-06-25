from pydantic import BaseModel

class Alert(BaseModel):
    alert_type: str
    source_ip: str
    severity: str
    timestamp: str
    status: str = "Open"

    risk_score: int = 0
    abuse_confidence_score: int = 0
    total_reports: int = 0
    country: str = "Unknown"
    isp: str = "Unknown"

    vt_malicious: int = 0
    vt_suspicious: int = 0
    vt_harmless: int = 0
    vt_undetected: int = 0
    vt_reputation: int = 0


class StatusUpdate(BaseModel):
    status: str


