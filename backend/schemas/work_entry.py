from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from models.work_entry import PaymentStatus


class WorkEntryCreate(BaseModel):
    customer_id: str
    work_date: date
    description: str = Field(..., min_length=1)
    amount: float = Field(..., ge=0)
    paid_amount: float = Field(default=0, ge=0)
    notes: Optional[str] = None


class WorkEntryUpdate(BaseModel):
    customer_id: Optional[str] = None
    work_date: Optional[date] = None
    description: Optional[str] = None
    amount: Optional[float] = Field(default=None, ge=0)
    paid_amount: Optional[float] = Field(default=None, ge=0)
    notes: Optional[str] = None


class WorkEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    customer_id: str
    customer_name: Optional[str] = None
    work_date: date
    description: str
    amount: float
    paid_amount: float
    remaining_amount: float
    payment_status: PaymentStatus
    notes: Optional[str] = None
    created_at: datetime


class PaginatedWorkEntries(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[WorkEntryOut]
