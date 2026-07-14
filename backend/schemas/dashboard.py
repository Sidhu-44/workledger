from typing import List

from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_customers: int
    total_work_days: int
    total_earnings: float
    total_paid: float
    total_pending: float
    this_month_earnings: float


class MonthlyEarningPoint(BaseModel):
    month: str
    earnings: float


class WeeklyWorkPoint(BaseModel):
    day: str
    jobs: int


class PaymentStatusSlice(BaseModel):
    status: str
    count: int
    amount: float


class TopCustomerPoint(BaseModel):
    customer_id: str
    customer_name: str
    total_earnings: float


class DashboardCharts(BaseModel):
    monthly_earnings: List[MonthlyEarningPoint]
    weekly_work: List[WeeklyWorkPoint]
    payment_status: List[PaymentStatusSlice]
    top_customers: List[TopCustomerPoint]
