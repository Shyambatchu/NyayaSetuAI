"""Create (or upgrade an empty) VidhiVerse AI SQLite database from schema.sql.

No server, no Docker: this opens a single file with Python's built-in sqlite3,
loads the sqlite-vec extension for the vector-search virtual tables, and runs
schema.sql. Safe to re-run against an existing file (every statement uses
CREATE ... IF NOT EXISTS where SQLite supports it; re-running against a
database that already has these tables will fail on the CREATE TABLE
statements, which is intentional -- this is a from-scratch bootstrap, not a
migration tool).

Usage:
    python database/schema/apply_schema.py [path/to/db.sqlite3]

Default path: storage/vidhiverse.db (relative to the repository root).
"""

import sqlite3
import sys
from pathlib import Path

import sqlite_vec

REPO_ROOT = Path(__file__).resolve().parents[2]
SCHEMA_FILE = Path(__file__).resolve().with_name("schema.sql")
DEFAULT_DB_PATH = REPO_ROOT / "storage" / "vidhiverse.db"


def apply_schema(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    schema_sql = SCHEMA_FILE.read_text(encoding="utf-8")

    conn = sqlite3.connect(db_path)
    try:
        conn.enable_load_extension(True)
        sqlite_vec.load(conn)
        conn.enable_load_extension(False)
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.executescript(schema_sql)
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    target = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_DB_PATH
    apply_schema(target)
    print(f"Schema applied to {target}")
