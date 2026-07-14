from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from auth.security import create_access_token, create_refresh_token, hash_password, verify_password
from models.user import User
from schemas.user import UserLogin, UserRegister


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, payload: UserRegister) -> User:
        existing = self.db.query(User).filter(User.phone_number == payload.phone_number).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this phone number already exists.",
            )

        user = User(
            full_name=payload.full_name,
            phone_number=payload.phone_number,
            email=payload.email,
            hashed_password=hash_password(payload.password),
            trade=payload.trade,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate(self, payload: UserLogin) -> User:
        user = self.db.query(User).filter(User.phone_number == payload.phone_number).first()
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid phone number or password.",
            )
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled.")
        return user

    @staticmethod
    def build_tokens(user: User) -> dict:
        return {
            "access_token": create_access_token(subject=user.id),
            "refresh_token": create_refresh_token(subject=user.id),
            "token_type": "bearer",
            "user": user,
        }
