from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database.database import Base, engine
from middleware.exception_handlers import register_exception_handlers
from routers import (
    ai_router,
    auth_router,
    customer_router,
    dashboard_router,
    payment_router,
    report_router,
    search_router,
    settings_router,
    work_entry_router,
)
from utils.logger import logger

# Import all models so they're registered on Base.metadata before create_all runs.
import models  # noqa: F401,E402

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API for Worker Ledger - a simple earnings & customer tracker for daily-wage workers.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(auth_router.router)
app.include_router(customer_router.router)
app.include_router(work_entry_router.router)
app.include_router(payment_router.router)
app.include_router(dashboard_router.router)
app.include_router(report_router.router)
app.include_router(search_router.router)
app.include_router(settings_router.router)
app.include_router(ai_router.router)


@app.on_event("startup")
def on_startup():
    # For local/dev convenience. In production, prefer Alembic migrations
    # (see migrations/) instead of create_all.
    Base.metadata.create_all(bind=engine)
    logger.info("%s v%s started in %s mode.", settings.APP_NAME, settings.APP_VERSION, settings.ENV)


@app.get("/")
def root():
    return {"message": "Worker Ledger API is running.", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
