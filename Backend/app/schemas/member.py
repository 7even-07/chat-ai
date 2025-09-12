from pydantic import BaseModel, EmailStr

class MemberCreate(BaseModel):
    username: str
    email_addr: EmailStr
    phone_number: str
    password: str

class VerifyOTP(BaseModel):
    email_addr: EmailStr
    otp: str

class MemberLogin(BaseModel):
    email_addr: EmailStr
    password: str

class MemberOut(BaseModel):
    id: int
    username: str
    email_addr: EmailStr
    is_login: bool
    is_superuser: bool

    class config:
        from_attributes: True 