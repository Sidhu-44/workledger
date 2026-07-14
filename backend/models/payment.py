from sqlalchemy import Column, Date, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import relationship

from models.base import BaseModel


class Payment(BaseModel):
    __tablename__ = "payments"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    work_entry_id = Column(String(36), ForeignKey("work_entries.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)

    amount = Column(Numeric(12, 2), nullable=False)
    payment_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)

    owner = relationship("User", back_populates="payments")
    work_entry = relationship("WorkEntry", back_populates="payments")
    customer = relationship("Customer")
