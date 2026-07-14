"""
Shared model base: UUID primary key + created/updated timestamps.
UUIDs are stored as 36-char strings for portability between SQLite and Postgres.
If you're on Postgres only, you can switch this to sqlalchemy.dialects.postgresql.UUID.
"""
import uuid

from sqlalchemy import Column, DateTime, String, func

from database.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class BaseModel(Base):
    __abstract__ = True

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
