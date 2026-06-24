from sqlalchemy import Column, Integer, String
from app.models.database import Base

class BlockedIP(Base):
    __tablename__ = "blocked_ips"

    id = Column(Integer, primary_key=True)
    ip = Column(String, unique=True)
    status = Column(String)