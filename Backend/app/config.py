import os

DB_PATH = "chat_ai"
AUDIO_DIR = "audio"
FFMPEG_PATH = os.path.join("tools", "ffmpeg", "bin", "ffmpeg.exe")
MODEL_PATH = "models/xtts_v2"
SPEAKER_WAV = os.path.join(MODEL_PATH, "sample.wav")
LANGUAGE = "en"

os.makedirs(AUDIO_DIR, exist_ok=True)
