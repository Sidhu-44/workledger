from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.user import User
from models.work_entry import PaymentStatus
from schemas.work_entry import WorkEntryCreate, WorkEntryOut, WorkEntryUpdate
from services.work_entry_service import WorkEntryService

router = APIRouter(prefix="/api/work-entries", tags=["Work Entries"])


def _to_out(entry) -> WorkEntryOut:
    data = WorkEntryOut.model_validate(entry).model_dump()
    data["customer_name"] = entry.customer.name if entry.customer else None
    return WorkEntryOut(**data)


@router.get("")
def list_entries(
    search: Optional[str] = None,
    customer_id: Optional[str] = None,
    status: Optional[PaymentStatus] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    sort_by: str = Query("work_date"),
    sort_dir: str = Query("desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WorkEntryService(db)
    items, total = service.list_entries(
        current_user.id, search, customer_id, status, date_from, date_to, sort_by, sort_dir, page, page_size
    )
    return {"total": total, "page": page, "page_size": page_size, "items": [_to_out(e) for e in items]}


@router.post("", status_code=201)
def create_entry(payload: WorkEntryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = WorkEntryService(db).create_entry(payload, current_user.id)
    return _to_out(entry)


@router.get("/{entry_id}")
def get_entry(entry_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _to_out(WorkEntryService(db).get_entry(entry_id, current_user.id))


@router.put("/{entry_id}")
def update_entry(
    entry_id: str,
    payload: WorkEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _to_out(WorkEntryService(db).update_entry(entry_id, payload, current_user.id))


@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    WorkEntryService(db).delete_entry(entry_id, current_user.id)
    return None
