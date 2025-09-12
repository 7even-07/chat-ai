import random
from datetime import datetime, timedelta, timezone
from typing import Tuple

def generate_otp() -> str:
    return f"{random.randint(0, 99999):06d}"

def new_session_id() -> str:
    import uuid
    return str(uuid.uuid4())

def utcnow():
    return datetime.now(timezone.utc)