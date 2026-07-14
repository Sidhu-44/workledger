from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.customer import Customer
from models.work_entry import PaymentStatus, WorkEntry


class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def summary(self, user_id: str) -> dict:
        total_customers = self.db.query(func.count(Customer.id)).filter(Customer.user_id == user_id).scalar() or 0

        totals = (
            self.db.query(
                func.count(WorkEntry.id),
                func.coalesce(func.sum(WorkEntry.amount), 0),
                func.coalesce(func.sum(WorkEntry.paid_amount), 0),
                func.coalesce(func.sum(WorkEntry.remaining_amount), 0),
            )
            .filter(WorkEntry.user_id == user_id)
            .first()
        )
        total_work_days, total_earnings, total_paid, total_pending = totals

        today = date.today()
        month_start = today.replace(day=1)
        this_month_earnings = (
            self.db.query(func.coalesce(func.sum(WorkEntry.amount), 0))
            .filter(WorkEntry.user_id == user_id, WorkEntry.work_date >= month_start)
            .scalar()
            or 0
        )

        return {
            "total_customers": total_customers,
            "total_work_days": total_work_days or 0,
            "total_earnings": float(total_earnings or 0),
            "total_paid": float(total_paid or 0),
            "total_pending": float(total_pending or 0),
            "this_month_earnings": float(this_month_earnings or 0),
        }

    def monthly_earnings(self, user_id: str, months: int = 6) -> list[dict]:
        today = date.today()
        results = []
        for i in range(months - 1, -1, -1):
            year = today.year
            month = today.month - i
            while month <= 0:
                month += 12
                year -= 1
            start = date(year, month, 1)
            end = date(year + (1 if month == 12 else 0), (month % 12) + 1, 1)

            total = (
                self.db.query(func.coalesce(func.sum(WorkEntry.amount), 0))
                .filter(WorkEntry.user_id == user_id, WorkEntry.work_date >= start, WorkEntry.work_date < end)
                .scalar()
                or 0
            )
            results.append({"month": start.strftime("%b %Y"), "earnings": float(total)})
        return results

    def weekly_work(self, user_id: str) -> list[dict]:
        today = date.today()
        start = today - timedelta(days=6)
        rows = (
            self.db.query(WorkEntry.work_date, func.count(WorkEntry.id))
            .filter(WorkEntry.user_id == user_id, WorkEntry.work_date >= start, WorkEntry.work_date <= today)
            .group_by(WorkEntry.work_date)
            .all()
        )
        counts = {row[0]: row[1] for row in rows}

        results = []
        for i in range(7):
            day = start + timedelta(days=i)
            results.append({"day": day.strftime("%a"), "jobs": counts.get(day, 0)})
        return results

    def payment_status_breakdown(self, user_id: str) -> list[dict]:
        rows = (
            self.db.query(WorkEntry.payment_status, func.count(WorkEntry.id), func.coalesce(func.sum(WorkEntry.amount), 0))
            .filter(WorkEntry.user_id == user_id)
            .group_by(WorkEntry.payment_status)
            .all()
        )
        return [
            {"status": status.value if isinstance(status, PaymentStatus) else status, "count": count, "amount": float(amount)}
            for status, count, amount in rows
        ]

    def top_customers(self, user_id: str, limit: int = 5) -> list[dict]:
        rows = (
            self.db.query(Customer.id, Customer.name, func.coalesce(func.sum(WorkEntry.amount), 0).label("total"))
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == user_id)
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(WorkEntry.amount).desc())
            .limit(limit)
            .all()
        )
        return [{"customer_id": r[0], "customer_name": r[1], "total_earnings": float(r[2])} for r in rows]
