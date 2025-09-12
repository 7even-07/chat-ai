from fastapi import APIRouter, Depends, Response, status, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.members import Member
from app.schemas.member import MemberCreate, MemberLogin, MemberOut, VerifyOTP
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.core.deps import get_current_member
from app.core.settings import settings
from app.core.utils import generate_otp, new_session_id, utcnow
from app.utils.response import generate_json_encoded_response

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_KW = dict(httponly=True, samesite="lax", secure=False) #set secure=True in HTTPS/prod

@router.post("/register")
def register(payload: MemberCreate, db: Session = Depends(get_db)):
    if db.query(Member).filter((Member.email_addr == payload.email_addr) | (Member.username == payload.username) | (Member.phone_number == payload.phone_number)).first():
        response_message = "User already exist. Please login with other credentials."
        return generate_json_encoded_response(False, response_message, "", None)

    otp = generate_otp()
    member = Member(
        username=payload.username,
        email_addr=payload.email_addr,
        phone_number = payload.phone_number,
        hashed_password=hash_password(payload.password),
        email_verified = False,
        phone_verified = False,
        otp_code = otp
    )
    db.add(member)
    db.commit()
    db.refresh(member)

    print(f"The OTP is {otp}")

    response_message = "Please enter OTP to proceed."
    return generate_json_encoded_response(True, response_message, "", member)

@router.post("/verify-otp")
def verify_otp(payload: VerifyOTP, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.email_addr == payload.email_addr).first()
    if not member:
        response_message = "User not found"
        return generate_json_encoded_response(False, response_message, "", None)
    if member.otp_code != payload.otp:
        response_message = f"Invalid OTP {payload.otp}."
        return generate_json_encoded_response(False, response_message, "", None)
    
    member.email_verified = True
    member.otp_code = None
    db.commit()
    db.refresh(member)

    response_message = "Email verified successfully"
    return generate_json_encoded_response(True, response_message, "", member)


@router.post("/login")
def login(payload: MemberLogin, response: Response, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.email_addr == payload.email_addr).first()
    if not member or not verify_password(payload.password, member.hashed_password):
        response_message = "Invalid credentials."
        return generate_json_encoded_response(False, response_message, "", "")
    if not member.is_active:
        response_message = "Member is deactivated, please contact with administrator."
        return generate_json_encoded_response(False, response_message, "", "")
    
    sid = new_session_id()
    access = create_access_token(sub= member.email_addr, session_id=sid)
    refresh = create_refresh_token(sub= member.email_addr, session_id=sid)

    member.session_id = sid
    member.refresh_token = refresh
    member.last_login = utcnow()
    db.commit()

    response.set_cookie("access_token", access, **COOKIE_KW, max_age=60*settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    response.set_cookie("refresh_token", refresh, **COOKIE_KW, max_age=60*60*24*settings.REFRESH_TOKEN_EXPIRE_DAYS)

    response_message = "Successfully login"
    return generate_json_encoded_response(True, response_message, "", None)

# @router.post("/refresh")
# def refresh_token(response: Response, db: Session = Depends(get_db), current: Member = Depends(get_current_member)):
#     access = create_access_token(sub= current.email_addr)
#     response.set_cookie("access_token", access, **COOKIE_KW, max_age=60*60*24*settings.ACCESS_TOKEN_EXPIRE_MINUTES)

#     response_message = "Refreshed."
#     return generate_json_encoded_response(True, response_message, "", None)

@router.post("/refresh")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    if not token:
        response_message = "No refresh token found."
        return generate_json_encoded_response(False, response_message, "", None)
    
    from jose import jwt
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "refresh":
            response_message = "Invalid token type"
            return generate_json_encoded_response(False, response_message, "", None)
        email_addr = payload.get("sub")
        sid = payload.get("sid")
    except:
        response_message = "Invalid refresh token"
        return generate_json_encoded_response(False, response_message, "", None)
    
    member = db.query(Member).filter(Member.email_addr == email_addr).first()
    if not member or member.session_id != sid or member.refresh_token != token:
        response_message = "Invalid session."
        return generate_json_encoded_response(False, response_message, "", None)
    
    access = create_access_token(sub=email_addr, session_id=sid)
    response.set_cookie("access_token", access, **COOKIE_KW, max_age=60*settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    response_message = "Refreshed."
    return generate_json_encoded_response(True, response_message, "", None)


@router.post("/logout")
def logout(response: Response, db: Session = Depends(get_db), current: Member = Depends(get_current_member)):
    current.session_id = None
    current.refresh_token = None
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    response_message = "Logged out."
    return generate_json_encoded_response(True, response_message, "", None)

@router.get("/me")
def me(current: Member = Depends(get_current_member)):
    response_message = "current"
    return generate_json_encoded_response(True, response_message, "", current)