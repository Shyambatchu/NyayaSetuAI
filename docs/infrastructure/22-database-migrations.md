# 22 – Database Migrations

Alembic is the only way to change the schema. Migrations are stored at `database/migrations/`, configured in `backend/alembic.ini` with `script_location = ../database/migrations`. The database itself is a single SQLite file (no server), so "running migrations" means opening that file directly — there is no container or connection string pointing at a different host.

`sqlite-vec` is a Python-loaded extension, not a SQL `CREATE EXTENSION`: the engine must call `conn.load_extension` (or `sqlite_vec.load(conn)`) and `PRAGMA foreign_keys = ON` on every new connection, via SQLAlchemy's `event.listens_for(engine, "connect")`. There is no migration revision for this — it is connection setup, not schema.

## 1. Migration plan

| Revision | Content | Week |
|---|---|---|
| `0001_identity` | `users`, `user_preferences`, `refresh_tokens` | 1 |
| `0002_chat` | `chat_sessions`, `chat_messages` | 1 |
| `0003_legal_core` | `legal_sources`, `legal_acts` (+ `legal_acts_title_trgm`), `legal_sections`, `legal_cases` (+ `legal_cases_title_trgm`), `section_concordance` | 1 |
| `0004_legal_chunks` | `legal_chunks` + `legal_chunks_vec` + `legal_chunks_fts` (+ triggers), `legal_citations` | 1 |
| `0005_documents` | `user_documents`, `document_chunks` + `document_chunks_vec` + `document_chunks_fts` (+ triggers) | 1 |
| `0006_operations` | `ingestion_jobs`, `feedback`, `source_updates`, `audit_logs` | 1 |
| `0007_serpapi` | `serpapi_cache`, `serpapi_usage_logs` | 2 |
| `0008_research_depth` | `legal_amendments`, `provision_case_links` | 3 |
| `0009_document_intelligence` | `document_clauses`, `document_findings` | 3 |
| `0010_legal_aid` | `legal_aid_authorities`, `legal_aid_resources` | 4, P1 |
| `0011_matters` | `legal_matters`, `matter_documents`, `matter_events`, `matter_deadlines`, `matter_notes` | 4, P1 |
| `0012_workflows` | `workflow_templates` + `workflow_templates_vec`, `workflow_runs`, `workflow_checklist_items` | 4, P1 |

`0006` references `0005` (`ingestion_jobs.document_id`), so the document tables are created in Week 1, even though the document feature arrives in Week 3. `0012` references `0011` through `workflow_runs.matter_id`, so the matter tables are needed for workflows, even if the companion feature itself is skipped. Urgent helplines need `0010` for safety guidance, so run it by Week 2 if verified helpline records are ready.

DDL source: [`database/schema/schema.sql`](../../database/schema/schema.sql) (also excerpted in [11 §4](../technical/11-database-schema.md)). Each Alembic revision's `upgrade()` should just be the slice of `schema.sql` for that revision's tables, via `op.execute(...)`.

## 2. Workflow

```bash
alembic revision -m "add_x"
```

```bash
alembic upgrade head
```

```bash
alembic downgrade -1
```

```bash
alembic history
```

Autogenerate can start a revision, but must be read by a person: it does not know about `vec0`/FTS5 virtual tables, their sync triggers, partial indexes, or `CHECK (json_valid(...))`. Write those by hand with `op.execute`. Autogenerate is also unreliable for column changes on SQLite in general — see rule 4 below.

## 3. Rules

1. Each revision has an upgrade and a downgrade, unless a data loss downgrade is explicitly documented.
2. Applied migrations are never edited, only followed.
3. Test in CI: upgrade from empty, downgrade one step, upgrade again.
4. SQLite's `ALTER TABLE` can only rename/add a column — it cannot drop, retype, or re-constrain one. Any other column change needs Alembic's [batch mode](https://alembic.sqlalchemy.org/en/latest/batch.html) (`with op.batch_alter_table(...)`), which recreates the table under the hood. Do this inside a single transaction and re-run the affected table's triggers/virtual-table definitions afterward if it has `_vec`/`_fts` companions.
5. Use expand-then-contract for later live deployments.
6. Changing embedding dimension: add a new `vec0` companion table at the new dimension, re-embed into it, swap the app over, drop the old one. Never mix dimensions in one `vec0` table.

## 4. Seeds

| Seed | Idempotent how | Environment |
|---|---|---|
| Admin | Upsert by email | Local |
| Legal aid YAML | Upsert by `source_url` and title | All, `unverified` |
| Workflow templates | Upsert by key and version; a new content change means a new version | All, `unverified` |
| Test corpus | Fixed IDs | Tests only |

## Backup and restore

The database is one file, so backup and restore are file operations — no server to connect to or dump from.

Backup, keeping the file somewhere safe and outside Git:

```bash
cp storage/vidhiverse.db backups/vidhiverse-$(date +%Y%m%d).db
```

Restore:

```bash
cp backups/vidhiverse-20261101.db storage/vidhiverse.db
```

A safer backup takes a consistent snapshot even mid-write, using SQLite's own backup API rather than a raw file copy:

```bash
sqlite3 storage/vidhiverse.db ".backup backups/vidhiverse-$(date +%Y%m%d).db"
```

Also back up `storage/` (uploaded documents, not just the database). **A corpus snapshot is a demo-day safety net:** take one after every verified publication, and test the restore before the event.

## Local reset

Destructive: deletes all local data.

```bash
rm storage/vidhiverse.db
```

```bash
alembic upgrade head
```

Then run the seeds in [21 §6](21-installation-guide.md) and either restore a corpus snapshot or republish the corpus.

## 5. Scaling beyond the MVP

If the corpus or concurrent-write load ever outgrows a single SQLite file (see the capacity estimate in [11 §6](../technical/11-database-schema.md#6-capacity-estimate)), the migration path is to a managed PostgreSQL + pgvector service, not to a bigger local file. `schema.sql`'s PostgreSQL-dialect ancestor is preserved in this file's git history if that move is ever needed; the translation table in [11 §4](../technical/11-database-schema.md#4-ddl) runs in reverse for that purpose.
