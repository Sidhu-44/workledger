"""
Business logic for POST /api/ai/chat.

This is rule-based intent detection (keyword matching) dispatched to small,
single-purpose handler methods -- each handler runs its own SQL aggregation
against the logged-in user's real data and formats a natural-language
sentence from the result. Nothing here is hardcoded per-question; every
reply is built from whatever the database currently contains, so the text
changes as the user's data changes.

No external AI provider is used yet. When Gemini/OpenAI is wired up later,
the natural place to plug it in is `_handle_fallback` (for open-ended
questions the keyword rules don't recognise) and/or as a rephrasing pass
over the structured facts each handler below already computes.
"""
from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.customer import Customer
from models.payment import Payment
from models.user import User
from models.work_entry import WorkEntry
from services.insights_service import _month_bounds


class AiChatService:
    def __init__(self, db: Session, user: User):
        self.db = db
        self.user = user
        self.user_id = user.id

        self._intent_rules = [
            ("pending_payments", ["who owes", "owes me", "pending payment", "pending amount", "overdue", "unpaid"]),
            ("top_customer", ["top customer", "best customer", "highest paying"]),
            ("average_payment", ["average payment", "avg payment", "average received", "typical payment"]),
            ("this_month_earnings", ["this month", "month's earning", "monthly earning"]),
            (
                "business_summary",
                ["business summary", "summary", "overview", "how am i doing", "how is business", "how's business"],
            ),
            ("total_earnings", ["total earning", "total income", "lifetime earning", "all time earning", "overall earning"]),
        ]

        self._handlers = {
            "pending_payments": self._handle_pending_payments,
            "top_customer": self._handle_top_customer,
            "average_payment": self._handle_average_payment,
            "this_month_earnings": self._handle_this_month_earnings,
            "business_summary": self._handle_business_summary,
            "total_earnings": self._handle_total_earnings,
        }

    def generate_reply(self, message: str) -> str:
        intent = self._detect_intent(message)
        handler = self._handlers.get(intent, self._handle_fallback)
        return handler()

    def _detect_intent(self, message: str) -> str:
        text = message.lower()
        for intent, keywords in self._intent_rules:
            if any(keyword in text for keyword in keywords):
                return intent
        return "fallback"

    def _money(self, amount: float) -> str:
        symbol = "\u20b9" if self.user.currency == "INR" else f"{self.user.currency} "
        return f"{symbol}{amount:,.0f}"

    def _handle_pending_payments(self) -> str:
        rows = (
            self.db.query(Customer.name, func.coalesce(func.sum(WorkEntry.remaining_amount), 0).label("remaining"))
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == self.user_id, WorkEntry.remaining_amount > 0)
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(WorkEntry.remaining_amount).desc())
            .all()
        )

        if not rows:
            return "Nobody currently owes you anything -- all your work entries are fully paid. \U0001f389"

        total_pending = sum(float(r[1]) for r in rows)
        top_rows = rows[:3]
        names = ", ".join(f"{name} ({self._money(float(amount))})" for name, amount in top_rows)

        if len(rows) == 1:
            return f"{rows[0][0]} owes you {self._money(float(rows[0][1]))}. That's your only pending balance right now."

        return (
            f"{len(rows)} customers owe you money, totalling {self._money(total_pending)}. "
            f"The largest balances are: {names}."
        )

    def _handle_top_customer(self) -> str:
        row = (
            self.db.query(Customer.name, func.coalesce(func.sum(WorkEntry.amount), 0).label("total"))
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == self.user_id)
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(WorkEntry.amount).desc())
            .first()
        )

        if not row:
            return "You don't have any customer earnings recorded yet -- add a work entry to see this."

        return f"Your top customer is {row[0]}, who has brought in {self._money(float(row[1]))} in total earnings."

    def _handle_average_payment(self) -> str:
        avg = (
            self.db.query(func.coalesce(func.avg(Payment.amount), 0))
            .filter(Payment.user_id == self.user_id)
            .scalar()
        )
        count = self.db.query(func.count(Payment.id)).filter(Payment.user_id == self.user_id).scalar() or 0

        if count == 0:
            return "You haven't recorded any payments yet, so there's no average to show."

        return f"Your average payment received is {self._money(float(avg or 0))}, based on {count} recorded payment(s)."

    def _handle_this_month_earnings(self) -> str:
        today = date.today()
        this_start, this_end = _month_bounds(today, months_back=0)
        last_start, last_end = _month_bounds(today, months_back=1)

        this_month = (
            self.db.query(func.coalesce(func.sum(WorkEntry.amount), 0))
            .filter(WorkEntry.user_id == self.user_id, WorkEntry.work_date >= this_start, WorkEntry.work_date < this_end)
            .scalar()
            or 0
        )
        last_month = (
            self.db.query(func.coalesce(func.sum(WorkEntry.amount), 0))
            .filter(WorkEntry.user_id == self.user_id, WorkEntry.work_date >= last_start, WorkEntry.work_date < last_end)
            .scalar()
            or 0
        )
        this_month, last_month = float(this_month), float(last_month)

        base = f"You've earned {self._money(this_month)} so far this month."
        if last_month > 0:
            change = round(((this_month - last_month) / last_month) * 100)
            if change > 0:
                return base + f" That's up {abs(change)}% compared to last month."
            if change < 0:
                return base + f" That's down {abs(change)}% compared to last month."
            return base + " That's about the same as last month."
        return base

    def _handle_total_earnings(self) -> str:
        totals = (
            self.db.query(
                func.coalesce(func.sum(WorkEntry.amount), 0),
                func.coalesce(func.sum(WorkEntry.paid_amount), 0),
                func.coalesce(func.sum(WorkEntry.remaining_amount), 0),
            )
            .filter(WorkEntry.user_id == self.user_id)
            .first()
        )
        total_earnings, total_paid, total_pending = (float(t or 0) for t in totals)

        if total_earnings == 0:
            return "You don't have any earnings recorded yet -- add a work entry to get started."

        return (
            f"Your total earnings so far are {self._money(total_earnings)}, of which {self._money(total_paid)} "
            f"has been paid and {self._money(total_pending)} is still pending."
        )

    def _handle_business_summary(self) -> str:
        total_customers = (
            self.db.query(func.count(Customer.id)).filter(Customer.user_id == self.user_id).scalar() or 0
        )
        totals = (
            self.db.query(
                func.count(WorkEntry.id),
                func.coalesce(func.sum(WorkEntry.amount), 0),
                func.coalesce(func.sum(WorkEntry.remaining_amount), 0),
            )
            .filter(WorkEntry.user_id == self.user_id)
            .first()
        )
        total_jobs, total_earnings, total_pending = totals[0] or 0, float(totals[1] or 0), float(totals[2] or 0)

        top_customer_row = (
            self.db.query(Customer.name, func.coalesce(func.sum(WorkEntry.amount), 0).label("total"))
            .join(WorkEntry, WorkEntry.customer_id == Customer.id)
            .filter(Customer.user_id == self.user_id)
            .group_by(Customer.id, Customer.name)
            .order_by(func.sum(WorkEntry.amount).desc())
            .first()
        )

        if total_customers == 0 or total_jobs == 0:
            return "You're just getting started -- add a customer and a work entry, and I'll be able to give you a full business summary."

        summary = (
            f"You have {total_customers} customer(s) and {total_jobs} work entr{'y' if total_jobs == 1 else 'ies'} logged, "
            f"with total earnings of {self._money(total_earnings)}."
        )
        if total_pending > 0:
            summary += f" {self._money(total_pending)} is still pending across your customers."
        else:
            summary += " Everything is fully paid up right now."
        if top_customer_row:
            summary += f" Your top customer is {top_customer_row[0]}."
        return summary

    def _handle_fallback(self) -> str:
        return (
            "I can help with things like pending payments, your top customer, this month's earnings, "
            "total earnings, average payment, or a full business summary. Try asking about one of those, "
            "or tap a suggestion below."
        )