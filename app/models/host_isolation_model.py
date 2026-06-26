from sqlalchemy import Column, Integer, String
from app.models.database import Base


class IsolatedHost(Base):
    __tablename__ = "isolated_hosts"

    id = Column(Integer, primary_key=True)
    host_id = Column(String, unique=True)
    status = Column(String)