"""
Seeds the database with one demo user, a few customers, work entries and
payments, so you can explore the app immediately after setup.

Run with:  python seed_data.py
Login with phone: 9999999999  password: password123
"""
from datetime import date, timedelta

from auth.security import hash_password
from database.database import Base, SessionLocal, engine
from models.customer import Customer
from models.payment import Payment
from models.user import User
from models.work_entry import WorkEntry

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    existing = db.query(User).filter(User.phone_number == "9999999999").first()
    if existing:
        print("Demo user already exists. Skipping seed.")
    else:
        user = User(
            full_name="Ramesh Kumar",
            phone_number="9999999999",
            email="ramesh@example.com",
            hashed_password=hash_password("password123"),
            trade="Painter",
        )
        db.add(user)
        db.flush()

        customers_data = [
            {"name": "Suresh Reddy", "phone_number": "9000000001", "address": "MG Road, Vijayawada"},
            {"name": "Lakshmi Devi", "phone_number": "9000000002", "address": "Benz Circle, Vijayawada"},
            {"name": "Anand Traders", "phone_number": "9000000003", "address": "Governorpet, Vijayawada"},
        ]
        customers = []
        for c in customers_data:
            customer = Customer(user_id=user.id, **c)
            db.add(customer)
            customers.append(customer)
        db.flush()

        today = date.today()
        work_data = [
            (customers[0], today - timedelta(days=2), "Living room wall painting", 5000, 5000),
            (customers[0], today - timedelta(days=20), "Exterior wall painting", 12000, 6000),
            (customers[1], today - timedelta(days=5), "Kitchen wiring repair", 2500, 0),
            (customers[1], today - timedelta(days=35), "Full house rewiring", 18000, 18000),
            (customers[2], today - timedelta(days=1), "Office painting job", 8000, 3000),
        ]
        for customer, work_date, description, amount, paid in work_data:
            entry = WorkEntry(
                user_id=user.id,
                customer_id=customer.id,
                work_date=work_date,
                description=description,
                amount=amount,
                paid_amount=paid,
            )
            entry.recalculate()
            db.add(entry)
            db.flush()

            if paid > 0:
                db.add(
                    Payment(
                        user_id=user.id,
                        work_entry_id=entry.id,
                        customer_id=customer.id,
                        amount=paid,
                        payment_date=work_date,
                        notes="Initial payment",
                    )
                )

        db.commit()
        print("Seed data created. Login with phone 9999999999 / password123")
finally:
    db.close()
