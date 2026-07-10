from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.models.database import Base


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)

    incident_id = Column(String, index=True)

    event_type = Column(String)

    title = Column(String)

    description = Column(String)

    timestamp = Column(DateTime, default=datetime.utcnow)