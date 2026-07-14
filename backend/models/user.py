from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship

from models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    full_name = Column(String(150), nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(150), unique=True, nullable=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    trade = Column(String(100), nullable=True)  # e.g. "Painter", "Electrician"
    currency = Column(String(10), nullable=False, default="INR")
    language = Column(String(10), nullable=False, default="en")
    theme = Column(String(10), nullable=False, default="light")  # light | dark
    is_active = Column(Boolean, default=True, nullable=False)

    customers = relationship("Customer", back_populates="owner", cascade="all, delete-orphan")
    work_entries = relationship("WorkEntry", back_populates="owner", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="owner", cascade="all, delete-orphan")
