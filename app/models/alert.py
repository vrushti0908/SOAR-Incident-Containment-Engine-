from sqlalchemy import Column, Integer, String
from .database import Base


class AlertDB(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    alert_type = Column(String)
    source_ip = Column(String)
    severity = Column(String)
    timestamp = Column(String)
    status = Column(String, default="Open")

    # Week 2 Threat Intelligence Fields

    risk_score = Column(Integer, default=0)

    abuse_confidence_score = Column(
        Integer,
        default=0
    )

    total_reports = Column(
        Integer,
        default=0
    )

    country = Column(String)

    isp = Column(String)