from sqlalchemy import Column, Integer, String, Float
from .database import Base

class AlertDB(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    alert_type = Column(String)
    source_ip = Column(String)
    severity = Column(String)
    timestamp = Column(String)
    status = Column(String, default="Open")

    risk_score = Column(Integer, default=0)
    country = Column(String)
    isp = Column(String)
    action = Column(String)
    failed_attempts = Column(Integer, default=0)
    mttr_seconds = Column(Float, default=0.0)

    vt_malicious = Column(Integer, default=0)
    vt_suspicious = Column(Integer, default=0)
    vt_harmless = Column(Integer, default=0)
    vt_undetected = Column(Integer, default=0)
    vt_reputation = Column(Integer, default=0)