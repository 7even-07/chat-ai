from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes import chat, character
from app.db.database import engine
from app.models.chat_history import ChatHistory

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/audio", StaticFiles(directory="audio"), name="audio")

@app.on_event("startup")
def on_startup():
    ChatHistory.metadata.create_all(bind=engine)

app.include_router(chat.router)
app.include_router(character.router)
