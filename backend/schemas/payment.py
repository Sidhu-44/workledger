from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PaymentCreate(BaseModel):
    work_entry_id: str
    amount: float = Field(..., gt=0)
    payment_date: date
    notes: Optional[str] = None


class PaymentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    work_entry_id: str
    customer_id: str
    amount: float
    payment_date: date
    notes: Optional[str] = None
    created_at: datetime
