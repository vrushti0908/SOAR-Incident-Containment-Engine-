from sqlalchemy import Column, Integer, String
from app.models.database import Base


class PendingApproval(Base):
    __tablename__ = "pending_approvals"

    id = Column(Integer, primary_key=True)
    alert_id = Column(Integer)
    action_type = Column(String)        # e.g. "ISOLATE_HOST"
    target = Column(String)             # e.g. the host_id to isolate
    status = Column(String, default="PENDING")   # PENDING | APPROVED | REJECTED
    requested_at = Column(String)
    reviewed_by = Column(String, default="")
    reviewed_at = Column(String, default="")