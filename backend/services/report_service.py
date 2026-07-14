from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.customer import Customer
from models.work_entry import WorkEntry


class ReportService:
    """Read-only aggregation queries backing the Reports screen and exports."""

    def __init__(self, db: Session):
        self.db = db

    def period_report(self, user_id: str, date_from: date, date_to: date) -> dict:
        entries = (
            self.db.query(WorkEntry)
            .filter(WorkEntry.user_id == user_id, WorkEntry.work_date >= date_from, WorkEntry.work_date <= date_to)
            .order_by(WorkEntry.work_date.asc())
            .all()
        )
        total_earnings = sum(float(e.amount) for e in entries)
        total_paid = sum(float(e.paid_amount) for e in entries)
        total_pending = sum(float(e.remaining_amount) for e in entries)
        return {
            "date_from": date_from,
            "date_to": date_to,
            "total_jobs": len(entries),
            "total_earnings": total_earnings,
            "total_paid": total_paid,
            "total_pending": total_pending,
            "entries": entries,
        }

    def customer_wise_report(self, user_id: str) -> list[dict]:
        rows = (
            self.db.query(
                Customer.id,
                Customer.name,
                func.count(WorkEntry.id),
                func.coalesce(func.sum(WorkEntry.amount), 0),
                func.coalesce(func.sum(WorkEntry.paid_amount), 0),
                func.coalesce(func.sum(WorkEntry.remaining_amount), 0),
            )
            .outerjoin(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == user_id)
            .group_by(Customer.id, Customer.name)
            .order_by(Customer.name.asc())
            .all()
        )
        return [
            {
                "customer_id": r[0],
                "customer_name": r[1],
                "total_jobs": r[2],
                "total_earnings": float(r[3]),
                "total_paid": float(r[4]),
                "total_pending": float(r[5]),
            }
            for r in rows
        ]

    def pending_payments_report(self, user_id: str) -> list[WorkEntry]:
        return (
            self.db.query(WorkEntry)
            .filter(WorkEntry.user_id == user_id, WorkEntry.remaining_amount > 0)
            .order_by(WorkEntry.remaining_amount.desc())
            .all()
        )

    def highest_paying_customer(self, user_id: str) -> dict | None:
        row = (
            self.db.query(Customer.id, Customer.name, func.coalesce(func.sum(WorkEntry.amount), 0).label("total"))
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == user_id)
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(WorkEntry.amount).desc())
            .first()
        )
        if not row:
            return None
        return {"customer_id": row[0], "customer_name": row[1], "total_earnings": float(row[2])}

    def most_frequent_customer(self, user_id: str) -> dict | None:
        row = (
            self.db.query(Customer.id, Customer.name, func.count(WorkEntry.id).label("jobs"))
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == user_id)
            .group_by(Customer.id, Customer.name)
            .order_by(func.count(WorkEntry.id).desc())
            .first()
        )
        if not row:
            return None
        return {"customer_id": row[0], "customer_name": row[1], "total_jobs": row[2]}
