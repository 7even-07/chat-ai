from pydantic import BaseModel

class Chat(BaseModel):
    message: str
    characterId: int
    memberId: int