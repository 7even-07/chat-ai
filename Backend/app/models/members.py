from sqlalchemy import Column, Integer, Float, Text, Boolean, String, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email_addr = Column(String(100), unique=True, index=True, nullable=False)
    phone_number = Column(String(15), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_superuser = Column(Boolean, default=False)
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    otp_code = Column(String(6), nullable=True)
    session_id = Column(String(255), nullable=True)
    refresh_token = Column(Text, nullable=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    addedon = Column(DateTime)
    is_login = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_delete = Column(Boolean, default=False)
    delete_msg = Column(String, nullable=True)
    modifiedon = Column(DateTime, nullable=True)
    deletedon = Column(DateTime, nullable=True)
    deletion_note = Column(String)