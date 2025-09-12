from fastapi import APIRouter, UploadFile, Form, Depends, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.database import SessionLocal, get_db
from app.models import characters_details
from app.schemas import character
from app.config import SITE_URL, CHARACTER_AVATAR_PATH, CHARACTER_VOICE_PATH
import shutil
import os
from datetime import datetime
from app.utils.response import generate_json_encoded_response
router = APIRouter(prefix="/characters", tags=["characters"])

@router.post("/")
def create_character(
    member_id: int = Form(...),
    character_name: str = Form(...),
    age: int = Form(...),
    language: str = Form(...),
    default_temperature: float = Form(...),
    chat_context: str = Form(...),
    gender: str = Form(...),
    relationship_style: str = Form(...),
    catchphrases: str = Form(...),
    occupations: str = Form(...),
    appearance: str = Form(...),
    personality_traits: str = Form(...),
    speaking_style: str = Form(...),
    behavioral_traits: str = Form(...),
    world_info: str = Form(...),
    author_notes: str = Form(...),
    character_avatar_url: Optional[UploadFile] = Form(None),
    character_voice_url: Optional[UploadFile] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        if not member_id:
            response_message = "Invalid member, please try again later"
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not character_name.strip():
            response_message="Please enter character name."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not age:
            response_message="Please enter character age."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not gender.strip():
            response_message="Please enter character gender."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not chat_context.strip():
            response_message="Please enter character chat context."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not occupations.strip():
            response_message="Please enter character occupation."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not appearance.strip():
            response_message="Please enter character appearance."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not personality_traits.strip():
            response_message="Please enter character personality."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if character_avatar_url.filename == "":
            response_message="Please upload character image."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if character_voice_url.filename == "":
            response_message="Please upload character voice."
            return generate_json_encoded_response(False, response_message, "", None)
        
        avatar_filename = f"{datetime.utcnow().timestamp()}_{character_avatar_url.filename}"
        avatar_filepath = f"{CHARACTER_AVATAR_PATH}/{avatar_filename}"
        os.makedirs(f"{CHARACTER_AVATAR_PATH}", exist_ok=True)
        with open(avatar_filepath, "wb") as buffer:
            shutil.copyfileobj(character_avatar_url.file, buffer)

        voice_filename = f"{datetime.utcnow().timestamp()}_{character_voice_url.filename}"
        voice_filepath = f"{CHARACTER_VOICE_PATH}/{voice_filename}"
        os.makedirs(f"{CHARACTER_VOICE_PATH}", exist_ok=True)
        with open(voice_filepath, "wb") as buffer:
            shutil.copyfileobj(character_voice_url.file, buffer)

        new_character = characters_details.CharactersDetails(
            member_id = member_id,
            character_name = character_name,
            age = age,
            language = language,
            default_temperature = default_temperature,
            chat_context = chat_context,
            gender = gender,
            relationship_style = relationship_style,
            catchphrases = catchphrases,
            occupations = occupations,
            appearance = appearance,
            personality_traits = personality_traits,
            speaking_style = speaking_style,
            behavioral_traits = behavioral_traits,
            world_info = world_info,
            author_notes = author_notes,
            character_avatar_url = avatar_filename,
            character_voice_url = voice_filename,
            addedon = datetime.utcnow(),
            is_active = True,
            is_delete = False,
        )
        db.add(new_character)
        db.commit()
        db.refresh(new_character)
        return generate_json_encoded_response(
            response_code=True,
            response_message="Character has been successfully added",
            redirect_url=f"{SITE_URL}/admin/characters",
            response_data={
                "id": new_character.id,
                "character_name": new_character.character_name,
                "character_avatar": new_character.character_avatar_url
            }
        )
    except Exception as e:
        return generate_json_encoded_response(
            response_code=False,
            response_message=str(e),
            redirect_url="",
            response_data=None
        )

# character list
# JWT token is required for to display details according user type.
@router.get("/")
def get_characters(db: Session = Depends(get_db)):
    try:
        characters = db.query(characters_details.CharactersDetails)\
            .filter_by(is_delete=False)\
            .order_by(desc(characters_details.CharactersDetails.addedon))\
            .all()

        return generate_json_encoded_response(
            response_code=True,
            response_message="Characters fetched successfully.",
            redirect_url="",
            response_data=characters
        )

    except Exception as e:
        return generate_json_encoded_response(
            response_code=False,
            response_message=str(e),
            redirect_url="",
            response_data=None
        )

@router.get("/{character_id}")
def get_character(character_id: int, db: Session = Depends(get_db)):
    character = db.query(characters_details.CharactersDetails).filter_by(
        id = character_id, is_delete = False
    ).first()

    if not character:
        response_message="Character not found."
        return generate_json_encoded_response(False, response_message, "", None)
    
    response_message = "Character fetched successfully."
    return generate_json_encoded_response(True, response_message, "", character)

@router.put("/{character_id}")
def update_character(
    character_id: int,
    member_id: int = Form(...),
    character_name: str = Form(...),
    age: int = Form(...),
    language: str = Form(...),
    default_temperature: float = Form(...),
    chat_context: str = Form(...),
    gender: str = Form(...),
    relationship_style: str = Form(...),
    catchphrases: str = Form(...),
    occupations: str = Form(...),
    appearance: str = Form(...),
    personality_traits: str = Form(...),
    speaking_style: str = Form(...),
    behavioral_traits: str = Form(...),
    world_info: str = Form(...),
    author_notes: str = Form(...),
    character_avatar_url: Optional[UploadFile] = None,
    character_voice_url: Optional[UploadFile] = None,
    db: Session = Depends(get_db)
):
    try:

        if not character_name.strip():
            response_message="Please enter character name."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not age:
            response_message="Please enter character age."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not gender.strip():
            response_message="Please enter character gender."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not chat_context.strip():
            response_message="Please enter character chat context."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not occupations.strip():
            response_message="Please enter character occupation."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not appearance.strip():
            response_message="Please enter character appearance."
            return generate_json_encoded_response(False, response_message, "", None)
        
        if not personality_traits.strip():
            response_message="Please enter character personality."
            return generate_json_encoded_response(False, response_message, "", None)
        
        # Fetch existing record
        db_character = db.query(characters_details.CharactersDetails).filter_by(id=character_id, is_delete=False).first()
        if not db_character:
            return generate_json_encoded_response(False, "Character not found", "", None)

        # Update file if provided
        if character_avatar_url and character_avatar_url.filename:
            avatar_filename = f"{datetime.utcnow().timestamp()}_{character_avatar_url.filename}"
            avatar_filepath = os.path.join(CHARACTER_AVATAR_PATH, avatar_filename)
            os.makedirs(CHARACTER_AVATAR_PATH, exist_ok=True)
            with open(avatar_filepath, "wb") as buffer:
                shutil.copyfileobj(character_avatar_url.file, buffer)
            db_character.character_avatar_url = avatar_filename

        if character_voice_url and character_voice_url.filename:
            voice_filename = f"{datetime.utcnow().timestamp()}_{character_voice_url.filename}"
            voice_filepath = os.path.join(CHARACTER_VOICE_PATH, voice_filename)
            os.makedirs(CHARACTER_VOICE_PATH, exist_ok=True)
            with open(voice_filepath, "wb") as buffer:
                shutil.copyfileobj(character_voice_url.file, buffer)
            db_character.character_voice_url = voice_filename

        # Update other fields
        db_character.member_id = member_id
        db_character.character_name = character_name
        db_character.age = age
        db_character.language = language
        db_character.default_temperature = default_temperature
        db_character.chat_context = chat_context
        db_character.gender = gender
        db_character.relationship_style = relationship_style
        db_character.catchphrases = catchphrases
        db_character.occupations = occupations
        db_character.appearance = appearance
        db_character.personality_traits = personality_traits
        db_character.speaking_style = speaking_style
        db_character.behavioral_traits = behavioral_traits
        db_character.world_info = world_info
        db_character.author_notes = author_notes

        db_character.modifiedon = datetime.utcnow()
        db.commit()
        db.refresh(db_character)

        return generate_json_encoded_response(
            True,
            "Character details updated successfully",
            "characters",
            db_character
        )

    except Exception as e:
        return generate_json_encoded_response(False, str(e), "", None)
    
@router.delete("/{character_id}")
def delete_character(character_id: int, db: Session = Depends(get_db)):
    db_character = db.query(characters_details.CharactersDetails).filter_by(id = character_id).first()

    if not db_character:
        response_message = "Character not found, please try agin later."
        return generate_json_encoded_response(False, response_message, "", None)
    
    db_character.is_delete = True
    db_character.is_active = False
    db_character.deletedon = datetime.utcnow()
    db_character.delete_msg = "Character is soft deleted"
    db.commit()

    response_message = "Character has been successfully deleted"
    return generate_json_encoded_response(True, response_message, "", None)