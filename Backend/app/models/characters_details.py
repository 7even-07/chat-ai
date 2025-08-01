from sqlalchemy import Column, Integer, Float, Text, Boolean, String, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class CharactersDetails(Base):
    __tablename__ = "characters_details"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer)
    character_name = Column(Text)
    age = Column(Integer)
    avatar_url = Column(Text)
    voice_sample = Column(Text)
    language = Column(String(30))
    default_temperature = Column(Float, default=0.8)
    chat_context = Column(Text)
    gender = Column(Text)
    relationship_style = Column(Text)
    catchphrases = Column(Text)
    occupations = Column(Text)
    appearance = Column(Text)
    personality_traits = Column(Text)
    speaking_style = Column(Text)
    behavioral_traits = Column(Text)
    likes_control = Column(Boolean)
    world_info = Column(Text)
    author_notes = Column(Text)
    is_active = Column(Boolean, default=True)
    is_delete = Column(Boolean, default=False)
    addedon = Column(DateTime(timezone=True), server_default=func.now())
    modifiedon = Column(DateTime(timezone=True), onupdate=func.now(), default=None)
    deleteon = Column(DateTime(timezone=True), onupdate=func.now(), default=None)
    deletion_note = Column(String)
