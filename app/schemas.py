from pydantic import BaseModel

class Alert(BaseModel):
    alert_type: str
    source_ip: str
    severity: str
    timestamp: str
    status: str = "Open"

    # Week 2 Enrichment Fields
    risk_score: int = 0
    abuse_confidence_score: int = 0
    total_reports: int = 0
    country: str = "Unknown"
    isp: str = "Unknown"


class StatusUpdate(BaseModel):
    status: str


