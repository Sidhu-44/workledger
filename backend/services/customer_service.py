from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from models.customer import Customer
from models.work_entry import WorkEntry
from schemas.customer import CustomerCreate, CustomerUpdate


class CustomerService:
    """Encapsulates all data access + rules for Customers (repository pattern)."""

    def __init__(self, db: Session):
        self.db = db

    def _get_owned_or_404(self, customer_id: str, user_id: str) -> Customer:
        customer = (
            self.db.query(Customer)
            .filter(Customer.id == customer_id, Customer.user_id == user_id)
            .first()
        )
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")
        return customer

    def list_customers(
        self,
        user_id: str,
        search: Optional[str] = None,
        sort_by: str = "name",
        sort_dir: str = "asc",
        page: int = 1,
        page_size: int = 20,
    ):
        query = self.db.query(Customer).filter(Customer.user_id == user_id)

        if search:
            like = f"%{search}%"
            query = query.filter(
                or_(Customer.name.ilike(like), Customer.phone_number.ilike(like), Customer.address.ilike(like))
            )

        sort_column = getattr(Customer, sort_by, Customer.name)
        query = query.order_by(sort_column.desc() if sort_dir == "desc" else sort_column.asc())

        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total

    def get_customer(self, customer_id: str, user_id: str) -> Customer:
        return self._get_owned_or_404(customer_id, user_id)

    def create_customer(self, payload: CustomerCreate, user_id: str) -> Customer:
        customer = Customer(user_id=user_id, **payload.model_dump())
        self.db.add(customer)
        self.db.commit()
        self.db.refresh(customer)
        return customer

    def update_customer(self, customer_id: str, payload: CustomerUpdate, user_id: str) -> Customer:
        customer = self._get_owned_or_404(customer_id, user_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(customer, field, value)
        self.db.commit()
        self.db.refresh(customer)
        return customer

    def delete_customer(self, customer_id: str, user_id: str) -> None:
        customer = self._get_owned_or_404(customer_id, user_id)
        self.db.delete(customer)
        self.db.commit()

    def get_customer_history(self, customer_id: str, user_id: str) -> dict:
        customer = self._get_owned_or_404(customer_id, user_id)

        stats = (
            self.db.query(
                func.count(WorkEntry.id),
                func.coalesce(func.sum(WorkEntry.amount), 0),
                func.coalesce(func.sum(WorkEntry.remaining_amount), 0),
            )
            .filter(WorkEntry.customer_id == customer_id, WorkEntry.user_id == user_id)
            .first()
        )
        total_jobs, total_earnings, pending_amount = stats

        history = (
            self.db.query(WorkEntry)
            .filter(WorkEntry.customer_id == customer_id, WorkEntry.user_id == user_id)
            .order_by(WorkEntry.work_date.desc())
            .all()
        )

        return {
            "customer": customer,
            "total_jobs": total_jobs or 0,
            "total_earnings": float(total_earnings or 0),
            "pending_amount": float(pending_amount or 0),
            "history": history,
        }
