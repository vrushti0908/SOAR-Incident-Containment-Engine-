from sqlalchemy import Column, Integer, String
from app.models.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # "soc_analyst" | "security_engineer" | "senior_analyst"