from sqlalchemy import Column, ForeignKey, Index, String, Text
from sqlalchemy.orm import relationship

from models.base import BaseModel


class Customer(BaseModel):
    __tablename__ = "customers"
    __table_args__ = (
        Index("ix_customers_user_name", "user_id", "name"),
    )

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    phone_number = Column(String(20), nullable=True, index=True)
    address = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)

    owner = relationship("User", back_populates="customers")
    work_entries = relationship("WorkEntry", back_populates="customer", cascade="all, delete-orphan")
