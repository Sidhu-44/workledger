from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal
from models.payment import Payment
from models.work_entry import WorkEntry
from schemas.payment import PaymentCreate


class PaymentService:
    def __init__(self, db: Session):
        self.db = db

    def list_payments(self, user_id: str, work_entry_id: str | None = None):
        query = self.db.query(Payment).filter(Payment.user_id == user_id)
        if work_entry_id:
            query = query.filter(Payment.work_entry_id == work_entry_id)
        return query.order_by(Payment.payment_date.desc()).all()

    def record_payment(self, payload: PaymentCreate, user_id: str) -> Payment:
        entry = (
            self.db.query(WorkEntry)
            .filter(WorkEntry.id == payload.work_entry_id, WorkEntry.user_id == user_id)
            .first()
        )
        if not entry:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work entry not found.")

        amount = Decimal(str(payload.amount))
        remaining = entry.amount - entry.paid_amount

        if amount > remaining:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment amount exceeds remaining balance ({remaining:.2f}).",
            )

        payment = Payment(
            user_id=user_id,
            work_entry_id=entry.id,
            customer_id=entry.customer_id,
            amount=payload.amount,
            payment_date=payload.payment_date,
            notes=payload.notes,
        )
        self.db.add(payment)

        # Update the work entry's paid/remaining amount + status automatically.
        entry.paid_amount = entry.paid_amount + amount
        entry.recalculate()

        self.db.commit()
        self.db.refresh(payment)
        return payment

    def delete_payment(self, payment_id: str, user_id: str) -> None:
        payment = (
            self.db.query(Payment)
            .filter(Payment.id == payment_id, Payment.user_id == user_id)
            .first()
        )
        if not payment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found.")

        entry = self.db.query(WorkEntry).filter(WorkEntry.id == payment.work_entry_id).first()
        if entry:
            entry.paid_amount = max(0, float(entry.paid_amount) - float(payment.amount))
            entry.recalculate()

        self.db.delete(payment)
        self.db.commit()
