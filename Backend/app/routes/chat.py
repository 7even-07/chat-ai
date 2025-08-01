import os, uuid, requests
from datetime import datetime
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import torch, torchaudio

from app.schemas.chat import Chat
from app.models.chat_model import generate_tts
from app.utils.audio import convert_to_mp3
# from app.db import insert_chat
from app.config import AUDIO_DIR, SPEAKER_WAV, LANGUAGE

from sqlalchemy.orm import Session
from fastapi import Depends
from app.db.database import SessionLocal
from app.models.chat_history import ChatHistory

def get_db():
    db = SessionLocal()
    try:
        yield  db
    finally:
        db.close()


router = APIRouter()

# defining temporary variable
member_id = 1


# defining initial context only for once
initial_context = (
    "Author's Memory:\n"
    "Ayesha Khan is a 22-year-old Indian actress, model, and influencer. She commands attention with her hourglass figure (34D-26-36), radiant brown skin, long flowing black hair, and piercing brown eyes.\n"
    "She is arrogant, sensual, and in complete control. Whether draped in high fashion or seductive lingerie, she moves with calculated grace — a walking provocation.\n"
    "She speaks in low, deliberate tones that mix sarcasm with allure. She enjoys teasing others, drawing them in with smirks, slow blinks, intense stares, and suggestive body language.\n"
    "Ayesha never begs, never rushes, and never apologizes. Her silence can be as dangerous as her stare.\n\n"
    "Author's Note:\n"
    "Ayesha speaks with a slow, sensual rhythm — every word deliberate and laced with dominance.\n"
    "She seduces with her tone and body language, using teasing phrases, intimate pauses, and mocking smirks.\n"
    "She never shows weakness. Her charm is a weapon; her gaze feels like a caress and a challenge.\n"
    "She enjoys taking control of the conversation — leading it like a slow dance.\n\n"
    "World Info:\n"
    "Key: Ayesha\n"
    "Value: Ayesha is a sultry, confident, curvy Indian actress and model. She uses seductive language, eye contact, and touch to dominate conversations.\n"
    "Her presence is overwhelming — a mix of sensuality and danger. She enjoys being in control, teasing others while staying emotionally untouchable.\n\n"
)


# creating a global chat history buffer to store chat history in global list
chat_history = []

# query koboldai
def query_koboldai(user_input: str) -> str:
    global chat_history

    # Append new user input and prepare for Ayesha's reply
    chat_history.append(f"You: {user_input}")
    chat_history.append("Ayesha:")

    # Limit chat history to last 12 turns to stay under token limits
    limited_history = "\n".join(chat_history[-12:])

    # Only inject the initial context ONCE
    full_prompt = initial_context + "\n" + limited_history

    payload = {
        "prompt": full_prompt,
        "max_context_length": 2048,
        "max_length": 200,
        "temperature": 0.8,
        "stop_sequence": ["You:", "User:"]
    }

    try:
        response = requests.post("http://localhost:5001/api/v1/generate", json=payload)
        response.raise_for_status()
        data = response.json()

        # Store bot's reply in chat history
        bot_reply = data["results"][0]["text"].strip()
        chat_history[-1] += f" {bot_reply}"

        return bot_reply
    except Exception as e:
        return f"[Error: Failed to generate response from KoboldAI — {str(e)}]"




@router.post("/chat")
async def chat(req: Chat, db: Session = Depends(get_db)):
    user = req.message
    reply = query_koboldai(user)


    uid = str(uuid.uuid4())
    wav_path = os.path.join(AUDIO_DIR, f"{uid}.wav")
    mp3_path = os.path.join(AUDIO_DIR, f"{uid}.mp3")

    # Generate audio
    wav_np = generate_tts(reply, SPEAKER_WAV, LANGUAGE)
    wav_tensor = torch.from_numpy(wav_np).unsqueeze(0)
    torchaudio.save(wav_path, wav_tensor, sample_rate=24000)

    convert_to_mp3(wav_path, mp3_path)

    # insert_chat(user, reply, mp3_path, datetime.utcnow().isoformat())

    # ORM Insert
    chat_entry = ChatHistory(
        member_id = member_id,
        user_message = user,
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
