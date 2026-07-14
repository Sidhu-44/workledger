import enum

from sqlalchemy import Column, Date, Enum, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.orm import relationship

from models.base import BaseModel


class PaymentStatus(str, enum.Enum):
    PAID = "paid"
    PARTIAL = "partial"
    PENDING = "pending"


class WorkEntry(BaseModel):
    __tablename__ = "work_entries"
    __table_args__ = (
        Index("ix_work_entries_user_date", "user_id", "work_date"),
        Index("ix_work_entries_user_status", "user_id", "payment_status"),
    )

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)

    work_date = Column(Date, nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False, default=0)
    paid_amount = Column(Numeric(12, 2), nullable=False, default=0)
    remaining_amount = Column(Numeric(12, 2), nullable=False, default=0)
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    notes = Column(Text, nullable=True)

    owner = relationship("User", back_populates="work_entries")
    customer = relationship("Customer", back_populates="work_entries")
    payments = relationship("Payment", back_populates="work_entry", cascade="all, delete-orphan")

    def recalculate(self):
        """Keep remaining_amount and payment_status consistent with amount/paid_amount."""
        amount = self.amount or 0
        paid = self.paid_amount or 0
        self.remaining_amount = amount - paid
        if paid <= 0:
            self.payment_status = PaymentStatus.PENDING
        elif paid >= amount:
            self.payment_status = PaymentStatus.PAID
        else:
            self.payment_status = PaymentStatus.PARTIAL
