from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    phone_number: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None


class CustomerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    phone_number: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime


class CustomerSummary(CustomerOut):
    total_jobs: int = 0
    total_earnings: float = 0
    pending_amount: float = 0
