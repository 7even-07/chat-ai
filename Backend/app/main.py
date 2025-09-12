from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import  os
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.utils.response import generate_json_encoded_response

from app.routes import chat, auth ,character
from app.db.database import engine
from app.models import characters_details
from app.models.chat_history import ChatHistory

app = FastAPI()

# Automatically create missing tables
characters_details.Base.metadata.create_all(bind=engine)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Extract the first error message
    error_details = exc.errors()[0]
    field = error_details.get("loc")[-1]
    msg = error_details.get("msg", "Invalid input")

    return JSONResponse(
        content=generate_json_encoded_response(
            response_code=False,
            response_message=f"{field.replace('_', ' ').capitalize()}: {msg}",
            redirect_url="",
            response_data=None
        ),
        status_code=422
    )

app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# Mount the 'uploads' directory to server image via URL
UPLOADS_PATH = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOADS_PATH, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_PATH), name="uploads")


@app.on_event("startup")
def on_startup():
    ChatHistory.metadata.create_all(bind=engine)

app.include_router(chat.router)
app.include_router(auth.router)
app.include_router(character.router)
