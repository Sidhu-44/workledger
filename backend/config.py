"""
Application configuration.
Reads settings from environment variables (with sane local defaults),
so the same code works locally (SQLite) and in production (Postgres/Supabase).
"""
import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class Settings:
    # --- App ---
    APP_NAME: str = "Worker Ledger API"
    APP_VERSION: str = "1.0.0"
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = ENV != "production"

    # --- Database ---
    # Local dev default = SQLite file, no external DB required.
    # In production set DATABASE_URL to your Supabase/Postgres connection string, e.g.:
    # postgresql+psycopg2://user:password@host:5432/dbname
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./worker_ledger.db")

    # --- Auth / JWT ---
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_IN_PRODUCTION_super_secret_key")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

    @property
    def access_token_expires(self) -> timedelta:
        return timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)

    # --- CORS ---
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

    # --- Pagination defaults ---
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # --- Future AI integration (not implemented, kept modular) ---
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_API_URL: str = "https://generativelanguage.googleapis.com/v1beta/models"
    GEMINI_TIMEOUT_SECONDS: float = float(
        os.getenv("GEMINI_TIMEOUT_SECONDS", "15")
    )
    WHATSAPP_API_TOKEN: str = os.getenv("WHATSAPP_API_TOKEN", "")
    SMS_API_TOKEN: str = os.getenv("SMS_API_TOKEN", "")


settings = Settings()
