"""
Seed the 3 demo users needed to test RBAC.

Run once, from the repo root:
    python3 -m app.seed_users
(or: python3 app/seed_users.py -- the sys.path line below makes both work)

Safe to re-run -- skips any username that already exists.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import Base, engine, SessionLocal
from app.models.user import User
from app.auth import hash_password

DEMO_USERS = [
    {"username": "analyst1", "password": "analyst123", "role": "soc_analyst"},
    {"username": "engineer1", "password": "engineer123", "role": "security_engineer"},
    {"username": "senior1", "password": "senior123", "role": "senior_analyst"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        for u in DEMO_USERS:
            existing = db.query(User).filter(User.username == u["username"]).first()

            if existing:
                print(f"Skipping {u['username']} (already exists)")
                continue

            db.add(User(
                username=u["username"],
                hashed_password=hash_password(u["password"]),
                role=u["role"]
            ))
            print(f"Created {u['username']} ({u['role']})")

        db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    seed()
    print("\nDemo credentials:")
    for u in DEMO_USERS:
        print(f"  {u['username']} / {u['password']}  ->  {u['role']}")