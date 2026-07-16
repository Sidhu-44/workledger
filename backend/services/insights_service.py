from datetime import date, datetime, timedelta, timezone
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.customer import Customer
from models.payment import Payment
from models.work_entry import WorkEntry
from schemas.ai_insights import CustomerAmount, DashboardInsights, MonthlyTrend, OverdueCustomer

_TRADE_KEYWORDS = {
    "paint": "painting",
    "electric": "electrical",
    "wiring": "electrical",
    "plumb": "plumbing",
    "carpenter": "carpentry",
    "carpentry": "carpentry",
    "mason": "masonry",
    "tile": "tiling",
    "weld": "welding",
    "construction": "construction",
}

OVERDUE_THRESHOLD_DAYS = 15


def _month_bounds(anchor: date, months_back: int = 0) -> tuple[date, date]:
    year, month = anchor.year, anchor.month - months_back
    while month <= 0:
        month += 12
        year -= 1
    start = date(year, month, 1)
    end_year, end_month = (year + 1, 1) if month == 12 else (year, month + 1)
    end = date(end_year, end_month, 1)
    return start, end


class InsightsService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_insights(self, user_id: str) -> DashboardInsights:
        today = date.today()

        total_pending_amount = self._total_pending(user_id)
        highest_paying_customer = self._top_customer_by(user_id, order="desc", limit=1)
        highest_outstanding_customer = self._highest_outstanding_customer(user_id)
        overdue_customers_count = self._overdue_customers_count(user_id)
        monthly_trend = self._monthly_trend(user_id, today)
        average_payment = self._average_payment(user_id)
        top_customers = self._top_customers(user_id, limit=3)
        overdue_customers = self._overdue_customers(user_id, today)

        raw_entries = (
            self.db.query(WorkEntry.description, WorkEntry.amount, WorkEntry.work_date)
            .filter(WorkEntry.user_id == user_id)
            .all()
        )

        recommendations = self._build_recommendations(
            monthly_trend=monthly_trend,
            overdue_customers=overdue_customers,
            raw_entries=raw_entries,
            user_id=user_id,
            today=today,
        )

        return DashboardInsights(
            total_pending_amount=total_pending_amount,
            highest_paying_customer=highest_paying_customer,
            highest_outstanding_customer=highest_outstanding_customer,
            overdue_customers_count=overdue_customers_count,
            this_month_earnings=monthly_trend.this_month,
            monthly_trend=monthly_trend,
            average_payment=average_payment,
            top_customers=top_customers,
            overdue_customers=overdue_customers,
            recommendations=recommendations,
            generated_at=datetime.now(timezone.utc),
        )

    def _total_pending(self, user_id: str) -> float:
        total = (
            self.db.query(func.coalesce(func.sum(WorkEntry.remaining_amount), 0))
            .filter(WorkEntry.user_id == user_id)
            .scalar()
        )
        return float(total or 0)

    def _top_customer_by(self, user_id: str, order: str = "desc", limit: int = 1) -> Optional[CustomerAmount]:
        query = (
            self.db.query(Customer.id, Customer.name, func.coalesce(func.sum(WorkEntry.amount), 0).label("total"))
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == user_id)
            .group_by(Customer.id, Customer.name)
        )
        if order == "desc":
            query = query.order_by(func.sum(WorkEntry.amount).desc())
        else:
            query = query.order_by(func.sum(WorkEntry.amount).asc())
        row = query.limit(limit).first()
        if not row:
            return None
        return CustomerAmount(customer_id=row[0], customer_name=row[1], amount=float(row[2]))

    def _highest_outstanding_customer(self, user_id: str) -> Optional[CustomerAmount]:
        row = (
            self.db.query(
                Customer.id,
                Customer.name,
                func.coalesce(func.sum(WorkEntry.remaining_amount), 0).label("total"),
            )
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == user_id)
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(WorkEntry.remaining_amount).desc())
            .first()
        )
        if not row or float(row[2]) <= 0:
            return None
        return CustomerAmount(customer_id=row[0], customer_name=row[1], amount=float(row[2]))

    def _overdue_customers_count(self, user_id: str) -> int:
        count = (
            self.db.query(func.count(func.distinct(WorkEntry.customer_id)))
            .filter(WorkEntry.user_id == user_id, WorkEntry.remaining_amount > 0)
            .scalar()
        )
        return count or 0

    def _monthly_trend(self, user_id: str, today: date) -> MonthlyTrend:
        this_start, this_end = _month_bounds(today, months_back=0)
        last_start, last_end = _month_bounds(today, months_back=1)

        this_month = (
            self.db.query(func.coalesce(func.sum(WorkEntry.amount), 0))
            .filter(
                WorkEntry.user_id == user_id,
                WorkEntry.work_date >= this_start,
                WorkEntry.work_date < this_end,
            )
            .scalar()
            or 0
        )
        last_month = (
            self.db.query(func.coalesce(func.sum(WorkEntry.amount), 0))
            .filter(
                WorkEntry.user_id == user_id,
                WorkEntry.work_date >= last_start,
                WorkEntry.work_date < last_end,
            )
            .scalar()
            or 0
        )

        this_month = float(this_month)
        last_month = float(last_month)

        if last_month > 0:
            change_percent = round(((this_month - last_month) / last_month) * 100, 1)
        else:
            change_percent = 100.0 if this_month > 0 else 0.0

        if change_percent > 0:
            trend = "up"
        elif change_percent < 0:
            trend = "down"
        else:
            trend = "neutral"

        return MonthlyTrend(
            this_month=this_month,
            last_month=last_month,
            change_percent=change_percent,
            trend=trend,
        )

    def _average_payment(self, user_id: str) -> float:
        avg = (
            self.db.query(func.coalesce(func.avg(Payment.amount), 0))
            .filter(Payment.user_id == user_id)
            .scalar()
        )
        return round(float(avg or 0), 2)

    def _top_customers(self, user_id: str, limit: int = 3) -> list[CustomerAmount]:
        rows = (
            self.db.query(
                Customer.id,
                Customer.name,
                func.coalesce(func.sum(WorkEntry.amount), 0).label("total"),
            )
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == user_id)
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(WorkEntry.amount).desc())
            .limit(limit)
            .all()
        )
        return [
            CustomerAmount(customer_id=r[0], customer_name=r[1], amount=float(r[2]))
            for r in rows
        ]

    def _overdue_customers(self, user_id: str, today: date) -> list[OverdueCustomer]:
        cutoff = today - timedelta(days=OVERDUE_THRESHOLD_DAYS)
        rows = (
            self.db.query(
                Customer.id,
                Customer.name,
                func.coalesce(func.sum(WorkEntry.remaining_amount), 0).label("remaining"),
                func.min(WorkEntry.work_date).label("oldest_unpaid_date"),
            )
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(
                Customer.user_id == user_id,
                WorkEntry.remaining_amount > 0,
                WorkEntry.work_date <= cutoff,
            )
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(WorkEntry.remaining_amount).desc())
            .all()
        )
        return [
            OverdueCustomer(
                customer_id=r[0],
                customer_name=r[1],
                remaining_amount=float(r[2]),
                days_overdue=(today - r[3]).days,
            )
            for r in rows
        ]

    def _build_recommendations(
        self,
        monthly_trend: MonthlyTrend,
        overdue_customers: list[OverdueCustomer],
        raw_entries: list,
        user_id: str,
        today: date,
    ) -> list[str]:
        recs: list[str] = []

        if overdue_customers:
            worst = overdue_customers[0]
            recs.append(
                f"Follow up with {worst.customer_name} — {worst.days_overdue} days overdue "
                f"on {worst.remaining_amount:,.0f}."
            )

        if monthly_trend.last_month > 0:
            if monthly_trend.change_percent >= 0:
                direction = "increased"
            else:
                direction = "decreased"
            recs.append(
                f"This month's earnings {direction} by {abs(monthly_trend.change_percent):.0f}% vs last month."
            )

        this_start, this_end = _month_bounds(today, months_back=0)
        last_start, last_end = _month_bounds(today, months_back=1)

        pending_this = (
            self.db.query(func.coalesce(func.sum(WorkEntry.remaining_amount), 0))
            .filter(
                WorkEntry.user_id == user_id,
                WorkEntry.work_date >= this_start,
                WorkEntry.work_date < this_end,
            )
            .scalar()
            or 0
        )
        pending_last = (
            self.db.query(func.coalesce(func.sum(WorkEntry.remaining_amount), 0))
            .filter(
                WorkEntry.user_id == user_id,
                WorkEntry.work_date >= last_start,
                WorkEntry.work_date < last_end,
            )
            .scalar()
            or 0
        )
        pending_this = float(pending_this)
        pending_last = float(pending_last)

        if pending_last > 0:
            pending_change = round(((pending_this - pending_last) / pending_last) * 100, 0)
            if pending_change < 0:
                recs.append(f"New pending amount is down {abs(pending_change):.0f}% compared to last month.")
            elif pending_change > 0:
                recs.append(
                    f"New pending amount is up {pending_change:.0f}% compared to last month — worth following up."
                )

        trade_totals: dict[str, float] = {}
        for description, amount, _work_date in raw_entries:
            desc_lower = (description or "").lower()
            for keyword, label in _TRADE_KEYWORDS.items():
                if keyword in desc_lower:
                    trade_totals[label] = trade_totals.get(label, 0) + float(amount)
                    break
        if trade_totals:
            top_trade = max(trade_totals, key=trade_totals.get)
            recs.append(f"You earned the most from {top_trade} work.")

        weekend_total = 0.0
        weekend_days = 0
        weekday_total = 0.0
        weekday_days = 0
        for _description, amount, work_date in raw_entries:
            if work_date.weekday() >= 5:
                weekend_total += float(amount)
                weekend_days += 1
            else:
                weekday_total += float(amount)
                weekday_days += 1

        if weekend_days > 0 and weekday_days > 0:
            weekend_avg = weekend_total / weekend_days
            weekday_avg = weekday_total / weekday_days
            if weekend_avg > weekday_avg * 1.1:
                recs.append("Your weekend income is higher than weekdays on average.")

        return recs