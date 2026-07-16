from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel


class CustomerAmount(BaseModel):
    customer_id: str
    customer_name: str
    amount: float


class OverdueCustomer(BaseModel):
    customer_id: str
    customer_name: str
    remaining_amount: float
    days_overdue: int


class MonthlyTrend(BaseModel):
    this_month: float
    last_month: float
    change_percent: float
    trend: Literal["up", "down", "neutral"]


class DashboardInsights(BaseModel):
    """
    Structured output for GET /api/ai/dashboard-insights.

    Every numeric field here is computed deterministically from SQL/Python
    (see services/insights_service.py) -- nothing here is LLM-generated yet.
    `recommendations` is the one field designed to be swapped for a Gemini/
    OpenAI call later: today it's built from simple rules over this same
    data, but a future version can hand this same computed data to an LLM
    and replace just that list, without changing the response shape or the
    frontend that consumes it.
    """

    total_pending_amount: float
    highest_paying_customer: Optional[CustomerAmount] = None
    highest_outstanding_customer: Optional[CustomerAmount] = None
    overdue_customers_count: int
    this_month_earnings: float
    monthly_trend: MonthlyTrend
    average_payment: float
    top_customers: List[CustomerAmount] = []
    overdue_customers: List[OverdueCustomer] = []
    recommendations: List[str] = []
    generated_at: datetime