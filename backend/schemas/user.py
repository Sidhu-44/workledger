from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    phone_number: str = Field(..., min_length=8, max_length=20)
    email: Optional[str] = None
    password: str = Field(..., min_length=6, max_length=100)
    trade: Optional[str] = None


class UserLogin(BaseModel):
    phone_number: str
    password: str


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    trade: Optional[str] = None
    currency: Optional[str] = None
    language: Optional[str] = None
    theme: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    phone_number: str
    email: Optional[str] = None
    trade: Optional[str] = None
    currency: str
    language: str
    theme: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut
