# 21 – Installation Guide

> The target procedure for after Week 1 scaffolding. **Today the repository contains only documentation, so these steps cannot yet run.** Update this guide as the code lands. The Week 1 checklist includes running it on a clean machine.

## 1. Install prerequisites

Install the tools listed in [18 §1](18-local-development-setup.md). No Docker is needed — check the rest:

```bash
python --version
```

```bash
node --version
```

```bash
tesseract --list-langs
```

## 2. Get the code

```bash
git clone <repository-url> vidhiverse-ai
```

```bash
cd vidhiverse-ai
```

## 3. Configure

Copy the two example files and fill them in as described in [20](20-environment-variables.md):

```bash
cp backend/.env.example backend/.env
```

```bash
cp frontend/.env.example frontend/.env
```

## 4. Create the database

```bash
python database/schema/apply_schema.py
```

This creates `storage/vidhiverse.db` from [`schema.sql`](../../database/schema/schema.sql) — no server to wait on.

## 5. Install the backend

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
```

Download the embedding model. It needs internet once and is cached locally after that:

```bash
python ../scripts/download_models.py
```

## 6. Mark the migration state and seed

Step 4 already created every table via `schema.sql`, so tell Alembic the database is already at `head` rather than running `alembic upgrade head` (which would try to `CREATE TABLE` a second time and fail):

```bash
alembic stamp head
```

From here on, schema changes go through a new Alembic revision and `alembic upgrade head` as usual ([22](22-database-migrations.md)).

```bash
python ../scripts/seed_admin.py
```

```bash
python ../scripts/seed_legal_aid.py
```

Seeded legal aid data stays `unverified`, and is hidden until reviewed.

## 7. Load the first legal text

Place an officially obtained file and manifest as described in [10](../technical/10-legal-data-ingestion.md), then:

```bash
python -m app.ingestion.cli register ../legal-data/metadata/constitution-of-india.yaml
```

```bash
python -m app.ingestion.cli parse --act constitution-of-india --report
```

```bash
python -m app.ingestion.cli publish --act constitution-of-india
```

## 8. Run the backend

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Check `http://localhost:8000/api/v1/health`.

## 9. Run the frontend

In a new terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`.

## 10. Verify

| Test | Expected |
|---|---|
| `/api/v1/health` | `database: ok` |
| Swagger | Loads at `/docs` |
| Open chat, ask "What does Article 21 say?" | Answer with a verified citation, once the Constitution is ingested and an LLM is set |
| Ask about "Section 999 of the BNS" (BNS ingested) | `insufficient_sources` |
| Upload a synthetic PDF, analyze, tap a finding | Passage highlighted (needs an LLM allowed for documents) |
| Compare a section, and verify a fake citation | Diff shows; `not_found` |
| Start a verified workflow | Checklist appears (needs reviewed templates) |
| Restart the backend process | Data remains (`storage/vidhiverse.db` is untouched) |

## 11. Without an LLM key

Retrieval, Research lookup, comparison, citation verification, Planner checklists, matters, Legal Aid and "section not found" still work. Chat returns `503 LLM_UNAVAILABLE` for generated answers and shows retrieved sources.
