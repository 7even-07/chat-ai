from sqlalchemy import Column, Integer, Float, Text, Boolean, String, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class CharactersDetails(Base):
    __tablename__ = "characters_details"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer)
    character_name = Column(Text)
    age = Column(Integer)
    character_avatar_url = Column(Text)
    character_voice_url = Column(Text)
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
    world_info = Column(Text)
    author_notes = Column(Text)
    addedon = Column(DateTime)
    is_active = Column(Boolean, default=True)
    is_delete = Column(Boolean, default=False)
    delete_msg = Column(String, nullable=True)
    modifiedon = Column(DateTime, nullable=True)
    deletedon = Column(DateTime, nullable=True)
    deletion_note = Column(String)
