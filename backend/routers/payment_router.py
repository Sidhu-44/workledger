from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.user import User
from schemas.payment import PaymentCreate, PaymentOut
from services.payment_service import PaymentService

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.get("", response_model=list[PaymentOut])
def list_payments(
    work_entry_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PaymentService(db).list_payments(current_user.id, work_entry_id)


@router.post("", response_model=PaymentOut, status_code=201)
def record_payment(payload: PaymentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return PaymentService(db).record_payment(payload, current_user.id)


@router.delete("/{payment_id}", status_code=204)
def delete_payment(payment_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    PaymentService(db).delete_payment(payment_id, current_user.id)
    return None
