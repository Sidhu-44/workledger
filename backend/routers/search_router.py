from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.customer import Customer
from models.user import User
from models.work_entry import WorkEntry

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("")
def global_search(q: str = Query(..., min_length=1), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Searches across customers (name/phone) and work entries
    (description/amount/date/status) in one call for the top nav search bar.
    """
    like = f"%{q}%"

    customers = (
        db.query(Customer)
        .filter(Customer.user_id == current_user.id)
        .filter(or_(Customer.name.ilike(like), Customer.phone_number.ilike(like)))
        .limit(10)
        .all()
    )

    entries_query = (
        db.query(WorkEntry)
        .filter(WorkEntry.user_id == current_user.id)
        .join(Customer)
        .filter(or_(WorkEntry.description.ilike(like), Customer.name.ilike(like)))
    )
    entries = entries_query.limit(10).all()

    return {
        "customers": [{"id": c.id, "name": c.name, "phone_number": c.phone_number} for c in customers],
        "work_entries": [
            {
                "id": e.id,
                "customer_name": e.customer.name if e.customer else None,
                "description": e.description,
                "amount": float(e.amount),
                "work_date": e.work_date,
                "payment_status": e.payment_status,
            }
            for e in entries
        ],
    }
