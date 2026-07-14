from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.user import User
from schemas.customer import CustomerCreate, CustomerOut, CustomerUpdate
from services.customer_service import CustomerService

router = APIRouter(prefix="/api/customers", tags=["Customers"])


@router.get("")
def list_customers(
    search: Optional[str] = None,
    sort_by: str = Query("name"),
    sort_dir: str = Query("asc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = CustomerService(db)
    items, total = service.list_customers(current_user.id, search, sort_by, sort_dir, page, page_size)
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [CustomerOut.model_validate(c) for c in items],
    }


@router.post("", response_model=CustomerOut, status_code=201)
def create_customer(
    payload: CustomerCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return CustomerService(db).create_customer(payload, current_user.id)


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return CustomerService(db).get_customer(customer_id, current_user.id)


@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: str,
    payload: CustomerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return CustomerService(db).update_customer(customer_id, payload, current_user.id)


@router.delete("/{customer_id}", status_code=204)
def delete_customer(customer_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    CustomerService(db).delete_customer(customer_id, current_user.id)
    return None


@router.get("/{customer_id}/history")
def customer_history(customer_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    data = CustomerService(db).get_customer_history(customer_id, current_user.id)
    return {
        "customer": CustomerOut.model_validate(data["customer"]),
        "total_jobs": data["total_jobs"],
        "total_earnings": data["total_earnings"],
        "pending_amount": data["pending_amount"],
        "history": [
            {
                "id": e.id,
                "work_date": e.work_date,
                "description": e.description,
                "amount": float(e.amount),
                "paid_amount": float(e.paid_amount),
                "remaining_amount": float(e.remaining_amount),
                "payment_status": e.payment_status,
            }
            for e in data["history"]
        ],
    }
