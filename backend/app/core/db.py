"""Async SQLAlchemy engine for the single SQLite file, with sqlite-vec loaded
and PRAGMA foreign_keys = ON on every connection.

See docs/technical/11-database-schema.md#4-ddl for why the extension has to be
loaded through `run_async` on this dialect's connection wrapper, not called
directly on the dbapi_connection.
"""

import sys
from collections.abc import AsyncGenerator
from pathlib import Path

import sqlite_vec
from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

REPO_ROOT = Path(__file__).resolve().parents[3]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from database.schema.apply_schema import apply_schema  # noqa: E402

engine = create_async_engine(settings.DATABASE_URL, future=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


@event.listens_for(engine.sync_engine, "connect")
def _on_connect(dbapi_connection, _connection_record):
    async def _load_vec(raw_conn):
        await raw_conn.enable_load_extension(True)
        await raw_conn.load_extension(sqlite_vec.loadable_path())
        await raw_conn.enable_load_extension(False)

    dbapi_connection.run_async(_load_vec)
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")
    cursor.close()


def _db_path_from_url(url: str) -> Path:
    # "sqlite+aiosqlite:///../storage/vidhiverse.db" -> "../storage/vidhiverse.db"
    return Path(url.split("///", 1)[1])


async def ensure_schema() -> None:
    db_path = _db_path_from_url(settings.DATABASE_URL).resolve()
    if not db_path.exists():
        apply_schema(db_path)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session
