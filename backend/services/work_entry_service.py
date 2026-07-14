from datetime import date
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from models.customer import Customer
from models.work_entry import PaymentStatus, WorkEntry
from schemas.work_entry import WorkEntryCreate, WorkEntryUpdate


class WorkEntryService:
    def __init__(self, db: Session):
        self.db = db

    def _get_owned_or_404(self, entry_id: str, user_id: str) -> WorkEntry:
        entry = (
            self.db.query(WorkEntry)
            .filter(WorkEntry.id == entry_id, WorkEntry.user_id == user_id)
            .first()
        )
        if not entry:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work entry not found.")
        return entry

    def _validate_customer(self, customer_id: str, user_id: str) -> None:
        exists = (
            self.db.query(Customer)
            .filter(Customer.id == customer_id, Customer.user_id == user_id)
            .first()
        )
        if not exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid customer.")

    def list_entries(
        self,
        user_id: str,
        search: Optional[str] = None,
        customer_id: Optional[str] = None,
        status_filter: Optional[PaymentStatus] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        sort_by: str = "work_date",
        sort_dir: str = "desc",
        page: int = 1,
        page_size: int = 20,
    ):
        query = self.db.query(WorkEntry).filter(WorkEntry.user_id == user_id)

        if customer_id:
            query = query.filter(WorkEntry.customer_id == customer_id)
        if status_filter:
            query = query.filter(WorkEntry.payment_status == status_filter)
        if date_from:
            query = query.filter(WorkEntry.work_date >= date_from)
        if date_to:
            query = query.filter(WorkEntry.work_date <= date_to)
        if search:
            like = f"%{search}%"
            query = query.join(Customer).filter(
                or_(WorkEntry.description.ilike(like), Customer.name.ilike(like))
            )

        sort_column = getattr(WorkEntry, sort_by, WorkEntry.work_date)
        query = query.order_by(sort_column.desc() if sort_dir == "desc" else sort_column.asc())

        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total

    def get_entry(self, entry_id: str, user_id: str) -> WorkEntry:
        return self._get_owned_or_404(entry_id, user_id)

    def create_entry(self, payload: WorkEntryCreate, user_id: str) -> WorkEntry:
        self._validate_customer(payload.customer_id, user_id)

        entry = WorkEntry(
            user_id=user_id,
            customer_id=payload.customer_id,
            work_date=payload.work_date,
            description=payload.description,
            amount=payload.amount,
            paid_amount=payload.paid_amount,
            notes=payload.notes,
        )
        entry.recalculate()
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def update_entry(self, entry_id: str, payload: WorkEntryUpdate, user_id: str) -> WorkEntry:
        entry = self._get_owned_or_404(entry_id, user_id)

        data = payload.model_dump(exclude_unset=True)
        if "customer_id" in data and data["customer_id"]:
            self._validate_customer(data["customer_id"], user_id)

        for field, value in data.items():
            setattr(entry, field, value)

        entry.recalculate()
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def delete_entry(self, entry_id: str, user_id: str) -> None:
        entry = self._get_owned_or_404(entry_id, user_id)
        self.db.delete(entry)
        self.db.commit()
