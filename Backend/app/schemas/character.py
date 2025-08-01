from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class CharacterCreate(BaseModel):
    member_id: int
    character_name: str
    age: Optional[int] = None
    avatar_url: Optional[str] = None
    voice_sample: Optional[str] = None
    language: Optional[str] = None
    default_temperature: Optional[float] = 0.8
    chat_context: Optional[str] = None
    gender: Optional[str] = None
    relationship_style: Optional[str] = None
    catchphrases: Optional[str] = None
    occupations: Optional[str] = None
    appearance: Optional[str] = None
    personality_traits: Optional[str] = None
    speaking_style: Optional[str] = None
    behavioral_traits: Optional[str] = None
    likes_control: Optional[bool] = None
    world_info: Optional[str] = None
    author_notes: Optional[str] = None
    is_active: Optional[bool] = True
    is_delete: Optional[bool] = False
    deletion_note: Optional[str] = None