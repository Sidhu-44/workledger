from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.user import User
from services.report_service import ReportService
from utils.export import export_csv, export_excel, export_pdf

router = APIRouter(prefix="/api/reports", tags=["Reports"])


def _resolve_period(period: str, date_from: date | None, date_to: date | None) -> tuple[date, date]:
    today = date.today()
    if period == "daily":
        return today, today
    if period == "weekly":
        return today - timedelta(days=6), today
    if period == "monthly":
        return today.replace(day=1), today
    if period == "yearly":
        return today.replace(month=1, day=1), today
    # "custom" -> use provided dates, defaulting to the last 30 days
    return date_from or (today - timedelta(days=30)), date_to or today


@router.get("/period")
def period_report(
    period: str = Query("monthly", pattern="^(daily|weekly|monthly|yearly|custom)$"),
    date_from: date | None = None,
    date_to: date | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    d_from, d_to = _resolve_period(period, date_from, date_to)
    data = ReportService(db).period_report(current_user.id, d_from, d_to)
    return {
        "date_from": data["date_from"],
        "date_to": data["date_to"],
        "total_jobs": data["total_jobs"],
        "total_earnings": data["total_earnings"],
        "total_paid": data["total_paid"],
        "total_pending": data["total_pending"],
    }


@router.get("/customer-wise")
def customer_wise(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return ReportService(db).customer_wise_report(current_user.id)


@router.get("/pending-payments")
def pending_payments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entries = ReportService(db).pending_payments_report(current_user.id)
    return [
        {
            "id": e.id,
            "customer_name": e.customer.name if e.customer else None,
            "work_date": e.work_date,
            "amount": float(e.amount),
            "paid_amount": float(e.paid_amount),
            "remaining_amount": float(e.remaining_amount),
        }
        for e in entries
    ]


@router.get("/highest-paying-customer")
def highest_paying_customer(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return ReportService(db).highest_paying_customer(current_user.id)


@router.get("/most-frequent-customer")
def most_frequent_customer(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return ReportService(db).most_frequent_customer(current_user.id)


@router.get("/export")
def export_report(
    format: str = Query(..., pattern="^(csv|excel|pdf)$"),
    period: str = Query("monthly", pattern="^(daily|weekly|monthly|yearly|custom)$"),
    date_from: date | None = None,
    date_to: date | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    d_from, d_to = _resolve_period(period, date_from, date_to)
    data = ReportService(db).period_report(current_user.id, d_from, d_to)
    entries = data["entries"]

    if format == "csv":
        content, media_type, filename = export_csv(entries), "text/csv", "report.csv"
    elif format == "excel":
        content, media_type, filename = (
            export_excel(entries),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "report.xlsx",
        )
    else:
        content, media_type, filename = export_pdf(entries), "application/pdf", "report.pdf"

    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
