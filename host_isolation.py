from datetime import datetime

from app.models.database import SessionLocal
from app.models.host_isolation_model import IsolatedHost


class HostIsolator:

    def isolate_host(self, host_id):

        db = SessionLocal()

        try:

            existing = db.query(IsolatedHost).filter(
                IsolatedHost.host_id == host_id
            ).first()

            if not existing:

                isolated = IsolatedHost(
                    host_id=host_id,
                    status="ISOLATED"
                )

                db.add(isolated)
                db.commit()

            print(f"[EDR] Isolated host: {host_id}")

            return {
                "action": "ISOLATE_HOST",
                "host_id": host_id,
                "status": "success",
                "timestamp": str(datetime.now())
            }

        finally:
            db.close()

    def release_host(self, host_id):

        db = SessionLocal()

        try:

            isolated = db.query(IsolatedHost).filter(
                IsolatedHost.host_id == host_id
            ).first()

            if isolated:
                db.delete(isolated)
                db.commit()

            return {
                "action": "RELEASE_HOST",
                "host_id": host_id,
                "status": "success"
            }

        finally:
            db.close()