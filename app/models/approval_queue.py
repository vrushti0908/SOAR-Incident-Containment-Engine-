from datetime import datetime

from app.models.database import SessionLocal
from app.models.approval_model import PendingApproval


class ApprovalQueue:

    def request_approval(self, alert_id, action_type, target) -> int:
        """Create a PENDING row and return its id. Does NOT execute anything."""

        db = SessionLocal()

        try:
            approval = PendingApproval(
                alert_id=alert_id,
                action_type=action_type,
                target=target,
                status="PENDING",
                requested_at=str(datetime.now())
            )
            db.add(approval)
            db.commit()
            db.refresh(approval)

            return approval.id

        finally:
            db.close()