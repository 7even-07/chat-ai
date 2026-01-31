from pydantic_settings import BaseSettings
from app.config import SITE_URL

class Settings(BaseSettings):
    SECRET_KEY: str = "FAMILY09"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALGORITHM: str = "HS256"
    BACKEND_CORS_ORIGINS: list[str] = [SITE_URL]

settings = Settings()