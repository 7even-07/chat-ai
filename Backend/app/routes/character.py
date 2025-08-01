from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.characters_details import CharactersDetails
from app.schemas.character import CharacterCreate


def get_db():
    db = SessionLocal()
    try:
        yield  db
    finally:
        db.close()
router = APIRouter()

@router.post("/add-character")
def add_character(character: CharacterCreate, db: Session = Depends(get_db)):
    new_character = CharactersDetails(**character.model_dump())
    db.add(new_character)
    db.commit()
    db.refresh(new_character)
    return new_character