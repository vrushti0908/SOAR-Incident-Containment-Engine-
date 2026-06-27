"""
Quick diagnostic: shows exactly what's in the users table right now.
Run from the repo root: python check_users.py
"""
from app.models.database import SessionLocal
from app.models.user import User

db = SessionLocal()
rows = db.query(User).all()

print(f"Found {len(rows)} user(s) in the database.\n")

if not rows:
    print("NO USERS FOUND -- seed_users.py either hasn't run yet, or soar.db")
    print("was deleted *after* seeding instead of before. Run:")
    print("    python app/seed_users.py")
else:
    for u in rows:
        print(f"username={u.username!r}  role={u.role!r}")

db.close()