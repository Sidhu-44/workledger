from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.user import User
from services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary")
def summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return DashboardService(db).summary(current_user.id)


@router.get("/charts")
def charts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = DashboardService(db)
    return {
        "monthly_earnings": service.monthly_earnings(current_user.id),
        "weekly_work": service.weekly_work(current_user.id),
        "payment_status": service.payment_status_breakdown(current_user.id),
        "top_customers": service.top_customers(current_user.id),
    }


@router.get("/alerts")
def alerts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Powers the dashboard notification bell: pending payments, today's work, monthly summary, low earnings."""
    from datetime import date

    from models.work_entry import WorkEntry

    today = date.today()
    pending_count = (
        db.query(WorkEntry)
        .filter(WorkEntry.user_id == current_user.id, WorkEntry.remaining_amount > 0)
        .count()
    )
    todays_jobs = (
        db.query(WorkEntry)
        .filter(WorkEntry.user_id == current_user.id, WorkEntry.work_date == today)
        .count()
    )
    summary = DashboardService(db).summary(current_user.id)

    notifications = []
    if pending_count:
        notifications.append(
            {"type": "pending_payments", "message": f"You have {pending_count} pending payment(s)."}
        )
    if todays_jobs:
        notifications.append({"type": "todays_work", "message": f"{todays_jobs} job(s) logged for today."})
    notifications.append(
        {"type": "monthly_summary", "message": f"This month's earnings so far: {summary['this_month_earnings']:.2f}"}
    )
    if summary["this_month_earnings"] == 0:
        notifications.append({"type": "low_earnings", "message": "No earnings recorded yet this month."})

    return {"notifications": notifications}
