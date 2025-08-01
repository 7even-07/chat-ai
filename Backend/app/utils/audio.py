import subprocess, os
from app.config import FFMPEG_PATH

def convert_to_mp3(wav_path, mp3_path):
    subprocess.run([FFMPEG_PATH, "-y", "-i", wav_path, mp3_path], stderr=subprocess.DEVNULL)
    os.remove(wav_path)
