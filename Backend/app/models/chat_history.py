from sqlalchemy import Column, Integer, Text, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    character_id = Column(Integer, ForeignKey("characters_details.id"))
    user_message = Column(Text)
    reply_message =  Column(Text)
    audio_path = Column(String)
    is_active = Column(Boolean, default=True)
    is_delete = Column(Boolean, default=False)
    addedon = Column(DateTime(timezone=True), server_default=func.now())
    modifiedon = Column(DateTime(timezone=True), onupdate=func.now(), default=None)
    deleteon = Column(DateTime(timezone=True), onupdate=func.now(), default=None)
    delete_msg = Column(String)