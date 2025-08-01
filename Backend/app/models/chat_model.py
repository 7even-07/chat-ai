import os
import torch
from TTS.tts.models.xtts import Xtts, XttsAudioConfig, XttsArgs
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.config.shared_configs import BaseDatasetConfig
from app.config import MODEL_PATH

# Register extra config types for unpickling
torch.serialization.add_safe_globals([XttsConfig, XttsAudioConfig, BaseDatasetConfig, XttsArgs])

config = XttsConfig()
config.load_json(os.path.join(MODEL_PATH, "config.json"))

model = Xtts(config)
model.load_checkpoint(
    config=config,
    checkpoint_path=os.path.join(MODEL_PATH, "model.pth"),
    vocab_path=os.path.join(MODEL_PATH, "vocab.json"),
    speaker_file_path=os.path.join(MODEL_PATH, "speakers_xtts.pth"),
    use_deepspeed=False
)
model.eval()

def generate_tts(text, speaker_wav, language):
    return model.synthesize(
        config=config,
        text=text,
        speaker_wav=speaker_wav,
        language=language
    )["wav"]
