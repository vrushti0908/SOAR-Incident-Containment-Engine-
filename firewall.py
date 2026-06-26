from datetime import datetime

from app.models.database import SessionLocal
from app.models.firewall_model import BlockedIP


class FirewallSimulator:

    def block_ip(self, ip):

        db = SessionLocal()

        try:

            existing = db.query(BlockedIP).filter(
                BlockedIP.ip == ip
            ).first()

            if not existing:

                blocked_ip = BlockedIP(
                    ip=ip,
                    status="BLOCKED"
                )

                db.add(blocked_ip)
                db.commit()

            print(f"[FIREWALL] Blocked IP: {ip}")

            return {
                "action": "BLOCK_IP",
                "ip": ip,
                "status": "success",
                "timestamp": str(datetime.now())
            }

        finally:
            db.close()

    def unblock_ip(self, ip):

        db = SessionLocal()

        try:

            blocked_ip = db.query(BlockedIP).filter(
                BlockedIP.ip == ip
            ).first()

            if blocked_ip:
                db.delete(blocked_ip)
                db.commit()

            return {
                "action": "UNBLOCK_IP",
                "ip": ip,
                "status": "success"
            }

        finally:
            db.close()