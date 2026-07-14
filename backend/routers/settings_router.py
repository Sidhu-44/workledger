import json

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.customer import Customer
from models.payment import Payment
from models.user import User
from models.work_entry import WorkEntry

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("/backup")
def backup(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Exports the user's entire dataset as a single JSON file for backup/restore."""
    customers = db.query(Customer).filter(Customer.user_id == current_user.id).all()
    entries = db.query(WorkEntry).filter(WorkEntry.user_id == current_user.id).all()
    payments = db.query(Payment).filter(Payment.user_id == current_user.id).all()

    data = {
        "version": 1,
        "customers": [
            {"id": c.id, "name": c.name, "phone_number": c.phone_number, "address": c.address, "notes": c.notes}
            for c in customers
        ],
        "work_entries": [
            {
                "id": e.id,
                "customer_id": e.customer_id,
                "work_date": e.work_date.isoformat(),
                "description": e.description,
                "amount": float(e.amount),
                "paid_amount": float(e.paid_amount),
                "notes": e.notes,
            }
            for e in entries
        ],
        "payments": [
            {
                "id": p.id,
                "work_entry_id": p.work_entry_id,
                "customer_id": p.customer_id,
                "amount": float(p.amount),
                "payment_date": p.payment_date.isoformat(),
                "notes": p.notes,
            }
            for p in payments
        ],
    }

    content = json.dumps(data, indent=2).encode("utf-8")
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": 'attachment; filename="worker_ledger_backup.json"'},
    )


@router.post("/restore")
async def restore(file: UploadFile, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Restores customers/work entries/payments from a previously exported backup file.
    Existing data for this user is NOT deleted first -- restored records are added alongside it,
    with new IDs, to avoid accidental data loss.
    """
    from datetime import date as date_cls

    try:
        raw = await file.read()
        data = json.loads(raw)
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid backup file.")

    id_map = {}
    for c in data.get("customers", []):
        new_customer = Customer(
            user_id=current_user.id,
            name=c["name"],
            phone_number=c.get("phone_number"),
            address=c.get("address"),
            notes=c.get("notes"),
        )
        db.add(new_customer)
        db.flush()
        id_map[c["id"]] = new_customer.id

    entry_id_map = {}
    for e in data.get("work_entries", []):
        customer_id = id_map.get(e["customer_id"])
        if not customer_id:
            continue
        new_entry = WorkEntry(
            user_id=current_user.id,
            customer_id=customer_id,
            work_date=date_cls.fromisoformat(e["work_date"]),
            description=e["description"],
            amount=e["amount"],
            paid_amount=e["paid_amount"],
            notes=e.get("notes"),
        )
        new_entry.recalculate()
        db.add(new_entry)
        db.flush()
        entry_id_map[e["id"]] = new_entry.id

    for p in data.get("payments", []):
        work_entry_id = entry_id_map.get(p["work_entry_id"])
        customer_id = id_map.get(p["customer_id"])
        if not work_entry_id or not customer_id:
            continue
        db.add(
            Payment(
                user_id=current_user.id,
                work_entry_id=work_entry_id,
                customer_id=customer_id,
                amount=p["amount"],
                payment_date=date_cls.fromisoformat(p["payment_date"]),
                notes=p.get("notes"),
            )
        )

    db.commit()
    return {
        "success": True,
        "restored_customers": len(id_map),
        "restored_work_entries": len(entry_id_map),
    }
