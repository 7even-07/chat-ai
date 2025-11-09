import os

DB_PATH = "chat_ai"
AUDIO_DIR = "audio"
FFMPEG_PATH = os.path.join("tools", "ffmpeg", "bin", "ffmpeg.exe")
MODEL_PATH = "models/xtts_v2"
SPEAKER_WAV = os.path.join(MODEL_PATH, "sample.wav")
LANGUAGE = "en"

os.makedirs(AUDIO_DIR, exist_ok=True)

# site details
SITE_URL = "http://localhost:3000"
KOBOLD_AI_SITE_URL = "http://localhost:5001"
DOMAIN_NAME = "localhost"

# character image dir
CHARACTER_AVATAR_PATH = "uploads/characters/avatar-img"

# character voice dir
CHARACTER_VOICE_PATH = "uploads/characters/voice"