import os, uuid, requests
from datetime import datetime
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import torch, torchaudio
from app.config import KOBOLD_AI_SITE_URL

from app.schemas.chat import Chat
from app.models.chat_model import generate_tts
from app.utils.audio import convert_to_mp3
# from app.db import insert_chat
from app.config import AUDIO_DIR, SPEAKER_WAV, LANGUAGE

from sqlalchemy.orm import Session
from fastapi import Depends
from app.db.database import SessionLocal

from app.models import characters_details
from app.models.chat_history import ChatHistory
from app.utils.response import generate_json_encoded_response

def get_db():
    db = SessionLocal()
    try:
        yield  db
    finally:
        db.close()


router = APIRouter()

def build_chat_history_text(db: Session, member_id: int, character_id: int) -> str:
    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.member_id == member_id, ChatHistory.character_id == character_id)
        .order_by(ChatHistory.addedon.asc())
        .limit(12)
        .all()
    )
    history_lines = []
    for chat in chats:
        history_lines.append(f"You: {chat.user_message}")
        history_lines.append(f"{chat.reply_message}")
    return "\n".join(history_lines)

@router.get("/chat/history")
async def get_chat_history_api(
    member_id: int,
    character_id: int,
    db: Session = Depends(get_db)
):
    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.member_id == member_id, ChatHistory.character_id == character_id)
        .order_by(ChatHistory.addedon.asc())
        .limit(12)
        .all()
    )

    chat_list = []
    for chat in chats:
        chat_list.append({
            "id": f"user-{chat.id}",
            "sender": "user",
            "text": chat.user_message,
            "timestamp": chat.addedon.isoformat() if chat.addedon else None
        })
        chat_list.append({
            "id": f"bot-{chat.id}",
            "sender": "bot",
            "text": chat.reply_message.lstrip(":").strip(),
            "audio_url": chat.audio_path,
            "timestamp": chat.addedon.isoformat() if chat.addedon else None
        })

    chat_list.sort(key=lambda x: x["timestamp"])

    return generate_json_encoded_response(1, "Previous chat restored.", "", chat_list)


@router.post("/chat")
async def chat(req: Chat, db: Session = Depends(get_db)):
    # user = req.message
    # reply = query_koboldai(user)
    user_message = req.message
    character_id = req.characterId
    member_id = req.memberId

    # fetch character details
    character = (
        db.query(characters_details.CharactersDetails).filter_by(id=character_id, is_delete= False).first()
    )

    if not character:
        response_message = "Character not found."
        return generate_json_encoded_response(False, response_message, "", None)
    
    # Build dynamic initial context from db fields
    speaker_wav = SPEAKER_WAV
    language = LANGUAGE
    if character.character_voice_url:
        speaker_wav = "uploads/characters/voice/" + character.character_voice_url

    if character.language:
        language = character.language

    initial_context = (
        f"Author's Memory:\n"
        f"{character.character_name} is a {character.author_notes}. \n"
        f"Personality : {character.personality_traits} \n"
        f"Speaking style: {character.speaking_style} \n\n"
        f"World info: {character.world_info} \n"
        f"Key: {character.character_name} \n"
        f"Value: {character.world_info} \n"
    )

    # Build chat history dynamically
    history = build_chat_history_text(db, member_id, character_id)

    # Build prompt
    # full_prompt = initial_context + "\n" + history + f"You: {user_message}\n {character.character_name}"
    full_prompt = (
        initial_context + "\n" +
        history +
        f"\nYou: {user_message}\n{character.character_name}: "
    )


    # Query KoboldAI with character-specific context
    payload = {
        "prompt": full_prompt,
        "max_context_length": 2048,
        "max_length": 200,
        "temperature": 0.8,
        "stop_sequence": ["You:", "User:"]
    }

    try:
        response = requests.post(f"{KOBOLD_AI_SITE_URL}/api/v1/generate", json=payload)
        response.raise_for_status()
        data = response.json()
        reply = data["results"][0]["text"].strip()
    except Exception as e:
        response_message = f"KoboldAI error: {str(e)}"
        return generate_json_encoded_response(False, response_message, "", None)
    
    # generate audio
    uid = str(uuid.uuid4())
    wav_path = os.path.join(AUDIO_DIR, f"{uid}.wav")
    mp3_path = os.path.join(AUDIO_DIR, f"{uid}.mp3")

    # Generate audio
    wav_np = generate_tts(reply, speaker_wav, language)
    wav_tensor = torch.from_numpy(wav_np).unsqueeze(0)
    torchaudio.save(wav_path, wav_tensor, sample_rate=24000)

    convert_to_mp3(wav_path, mp3_path)

    # insert_chat(user, reply, mp3_path, datetime.utcnow().isoformat())

    # ORM Insert
    chat_entry = ChatHistory(
        member_id = member_id,
        character_id = character_id,
        user_message = user_message,
        reply_message = reply,
        audio_path = mp3_path,
    )

    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)

    return JSONResponse({
        "id": chat_entry.id,
        "reply_text": reply,
        "audio_url": f"/audio/{uid}.mp3",
        "timestamp": chat_entry.addedon.isoformat() if chat_entry.addedon else None
    })
