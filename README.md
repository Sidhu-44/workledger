# Worker Ledger

A simple, mobile-friendly earnings & customer tracker built for daily-wage workers —
painters, electricians, plumbers, carpenters, construction and agricultural workers —
to keep track of who they worked for, what they earned, what's been paid, and what's still owed.

---

## 1. Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, React Hook Form, Recharts
**Backend:** FastAPI, SQLAlchemy, Pydantic, Alembic, JWT Authentication
**Database:** PostgreSQL in production (Supabase-ready) / SQLite for zero-setup local development

---

## 2. Folder Structure

```
worker-ledger/
├── backend/
│   ├── routers/          # API route handlers (auth, customers, work-entries, payments, dashboard, reports, search, settings, ai)
│   ├── models/            # SQLAlchemy ORM models (User, Customer, WorkEntry, Payment)
│   ├── schemas/           # Pydantic request/response schemas
│   ├── services/          # Business logic / repository layer
│   ├── database/          # Engine + session setup
│   ├── middleware/        # Global exception handlers
│   ├── auth/               # Password hashing, JWT, current-user dependency
│   ├── utils/              # Logging, pagination, CSV/Excel/PDF export helpers
│   ├── migrations/        # Alembic migration environment
│   ├── config.py
│   ├── main.py             # FastAPI app entrypoint
│   ├── seed_data.py       # Demo data seeding script
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI (common/, customers/, workentries/, payments/, dashboard/)
    │   ├── pages/          # Route-level pages
    │   ├── layouts/        # AuthLayout, MainLayout (sidebar + topbar)
    │   ├── context/        # AuthContext, ThemeContext
    │   ├── services/       # Axios API layer, one file per resource
    │   └── main.jsx / App.jsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 3. Features

- **Auth:** register/login/logout, JWT access + refresh tokens, protected routes, per-user data isolation
- **Dashboard:** total customers, work days, earnings, paid, pending, this-month earnings + monthly earnings line chart, weekly work bar chart, payment-status pie chart, top-customers chart
- **Customers:** create/edit/delete, search, sort, pagination, per-customer history (jobs, earnings, pending, full work history)
- **Work Entries:** create/edit/delete, search/filter/sort, automatic remaining-amount + payment-status calculation
- **Payments:** record full/partial payments against any work entry, automatically updates the entry's paid/remaining balance
- **Reports:** daily/weekly/monthly/yearly, customer-wise, pending payments, highest-paying customer, most frequent customer; export to CSV, Excel, PDF
- **Global search** across customers and work entries
- **Notifications:** pending payments, today's work, monthly summary, low-earnings alerts
- **Settings:** dark/light mode, currency, language (UI-ready), JSON backup/restore
- **AI-ready:** `/api/ai/*` endpoints scaffolded (voice input, OCR, natural-language search, earnings prediction, expense analysis, auto-summary, WhatsApp/SMS reminders) — not implemented, but wired so a future release can fill them in without changing the frontend contract

---

## 4. Installation Guide (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional for local dev) PostgreSQL — SQLite is used by default, no setup required

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # then edit values as needed

# Seed demo data (creates worker_ledger.db with a demo user + sample records)
python seed_data.py

# Run the API
uvicorn main:app --reload --port 8000
```

API docs (Swagger UI) are available at **http://localhost:8000/docs** once the server is running.

Demo login: phone `9999999999`, password `password123` (after running `seed_data.py`).

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
npm run dev
```

Open **http://localhost:5173**.

---

## 5. Environment Variables

### backend/.env

| Variable | Description | Default |
|---|---|---|
| `ENV` | `development` or `production` | `development` |
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///./worker_ledger.db` |
| `JWT_SECRET_KEY` | Secret used to sign JWTs — **change in production** | — |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifetime | `30` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `OPENAI_API_KEY` / `GEMINI_API_KEY` / `WHATSAPP_API_TOKEN` / `SMS_API_TOKEN` | Reserved for future AI integrations | blank |

### frontend/.env

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |

---

## 6. Database Schema

- **users** — id (UUID), full_name, phone_number (unique), email, hashed_password, trade, currency, language, theme, is_active, timestamps
- **customers** — id, user_id (FK → users), name, phone_number, address, notes, timestamps
- **work_entries** — id, user_id (FK), customer_id (FK → customers), work_date, description, amount, paid_amount, remaining_amount, payment_status (enum: paid/partial/pending), notes, timestamps
- **payments** — id, user_id (FK), work_entry_id (FK → work_entries), customer_id (FK), amount, payment_date, notes, timestamps

All foreign keys cascade on delete. Indexes are set on `user_id` + commonly filtered/sorted columns (`work_date`, `payment_status`, customer `name`) for query performance.

### Running migrations (Postgres / production)

```bash
cd backend
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

(For local SQLite dev, `main.py` calls `Base.metadata.create_all()` on startup, so migrations are optional until you move to Postgres.)

---

## 7. Deployment Guide

### Database — Supabase (PostgreSQL)
1. Create a project at supabase.com.
2. Copy the connection string from Project Settings → Database, and set it as `DATABASE_URL` in the backend environment, e.g.:
   `postgresql+psycopg2://postgres:<password>@db.<ref>.supabase.co:5432/postgres`
3. Run `alembic upgrade head` against it (or let `create_all` run once on first boot for a quick start).

### Backend — Render
1. New → Web Service → connect this repo, root directory `backend/`.
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the environment variables from the table above (`DATABASE_URL` pointing at Supabase, a strong `JWT_SECRET_KEY`, `CORS_ORIGINS` set to your Vercel frontend URL).

### Frontend — Vercel
1. New Project → import this repo, root directory `frontend/`.
2. Framework preset: Vite. Build command `npm run build`, output directory `dist`.
3. Set `VITE_API_BASE_URL` to your Render backend URL.

---

## 8. Sample Data

Run `python seed_data.py` from `backend/` after installing dependencies. It creates one demo user (phone `9999999999` / password `password123`), three customers, five work entries in various payment states, and matching payment records.

---

## 9. Testing Instructions

The API is self-documenting via Swagger UI (`/docs`) and ReDoc (`/redoc`) — use these to manually exercise every endpoint with the demo account.

Suggested manual test pass:
1. Register a new account, then log in.
2. Add a customer, then add a work entry against them with a partial `paid_amount` — confirm `remaining_amount` and `payment_status` are computed correctly.
3. Record a payment from the Payments screen — confirm the work entry's balance updates and the status flips to `paid` once fully settled.
4. Open the customer's detail page — confirm totals and history match.
5. Check the Dashboard cards/charts reflect the same numbers.
6. Try Reports → switch periods, export CSV/Excel/PDF, and open each file.
7. Use the search bar for a customer name and a work description.
8. Toggle dark mode and change currency in Settings; download a backup, then restore it into a second account to confirm the restore flow.

For automated testing, `pytest` + `httpx.AsyncClient` against the FastAPI app (with a temporary SQLite DB per test run) is the recommended approach — this isn't included yet, see Future Improvements.

---

## 10. Future Improvements

- Automated backend test suite (pytest) and frontend component tests
- Real implementations behind the `/api/ai/*` endpoints: voice-to-entry, OCR receipt scanning, natural-language search, monthly earnings prediction, expense analysis, LLM-generated summaries
- WhatsApp / SMS payment-reminder delivery (Twilio or Meta Cloud API)
- Full i18n translations (Hindi, Telugu, Tamil, etc. — language preference is already stored per user)
- Token-blocklist for true server-side logout/revocation
- Offline-first support (service worker + local queue) for workers with unreliable connectivity
- Role-based sharing (e.g. a family member with view-only access)

---

## 11. API Documentation

Once the backend is running, full interactive API documentation is available at:
- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI schema (JSON): `/openapi.json`
