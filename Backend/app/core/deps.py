from fastapi import Depends, HTTPException, status, Request
from jose import jwt, JWTError
from app.core.settings import settings
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.members import Member


def get_current_member(request: Request, db: Session = Depends(get_db)) -> Member:
    token = None

    # 1. Try to read from cookie
    if "access_token" in request.cookies:
        token = request.cookies.get("access_token")

    # 2. Try to read from Authorization header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    # 3. Decode JWT
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        email_addr = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # 4. Lookup member in DB
    member = db.query(Member).filter(Member.email_addr == email_addr).first()
    if not member:
        raise HTTPException(status_code=401, detail="Member not found")

    return member
