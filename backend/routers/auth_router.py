from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.user import User
from schemas.user import Token, UserLogin, UserOut, UserProfileUpdate, UserRegister
from services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=201)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.register(payload)
    return service.build_tokens(user)


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.authenticate(payload)
    return service.build_tokens(user)


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    # Stateless JWT: logout is handled client-side by discarding the token.
    # (Kept as an endpoint so the frontend has a clean logout call, and so a
    # token-blocklist can be added later without changing the frontend contract.)
    return {"success": True, "message": "Logged out successfully."}


@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user
