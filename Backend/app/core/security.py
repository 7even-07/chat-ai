from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from app.core.settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(payload: dict, minutes: int = 15, days: int = 0):
    to_encode = payload.copy()
    exp = datetime.now(timezone.utc) + timedelta(minutes=minutes, days=days)
    to_encode.update({"exp": exp})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_access_token(sub: str, session_id: str):
    return create_token({"sub": sub, "sid": session_id, "type": "access"},
                         minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

def create_refresh_token(sub: str, session_id: str):
    return create_token({"sub": sub, "sid": session_id, "type": "refresh"},
                         days=settings.REFRESH_TOKEN_EXPIRE_DAYS)