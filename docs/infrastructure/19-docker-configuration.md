# 19 – Docker Configuration

**There is no Docker in the MVP.** The database moved from `pgvector/pgvector:pg16` in a
container to a single SQLite file opened directly by the backend process ([11](../technical/11-database-schema.md),
[22](22-database-migrations.md)) — this removed the only reason `docker-compose.yml`
existed. Backend and frontend already ran natively; now nothing runs in a container.

This also resolves D-13 and R-21 (Docker not found on the development machine's PATH,
[decision register](../review/decision-register.md)): there is nothing left that needed it.

## 1. What replaced it

| Before | Now |
|---|---|
| `docker compose up -d` (starts the `db` container) | Nothing to start — `storage/vidhiverse.db` is a plain file |
| `docker compose exec db psql ...` | `sqlite3 storage/vidhiverse.db` (or any SQLite GUI) |
| Named volume `vidhiverse_pgdata` | The file itself, under `storage/` (already gitignored, already survives restarts) |
| `pg_isready` healthcheck | None needed — opening the file *is* the health check |

## 2. Optional local LLM (Ollama)

The earlier `docker-compose.yml` also had an opt-in `ollama` profile for a local LLM
(D-01/D-06). That was already optional and unrelated to the database decision above. If a
local LLM is wanted later, run Ollama natively (`ollama serve`) rather than in Docker — on
Windows this reaches the GPU directly, which a container may not — and point
`LLM_BASE_URL` at it. No `docker-compose.yml` is needed for this either.

## 3. Future deployment

A backend Dockerfile remains a possible future-phase item if this ever moves to a hosted
deployment ([24](24-deployment-guide-future.md)) — that is a separate decision from the
local MVP covered here, and does not bring Docker back into local development.
