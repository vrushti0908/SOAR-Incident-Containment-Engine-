from pydantic import BaseModel

class Alert(BaseModel):
    alert_type: str
    source_ip: str
    severity: str
    timestamp: str
    status: str = "Open"