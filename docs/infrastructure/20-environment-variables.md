# 20 – Environment Variables

**Authoritative list.** Real values never go in Git. Commit only `.env.example` files with blank secrets.

| File | Used by |
|---|---|
| `backend/.env` | FastAPI |
| `frontend/.env` | Vite. Everything prefixed `VITE_` is **public**, so no secrets. |

There is no root `.env` / Docker Compose file: the database is a single SQLite file, not a container, so it needs no `POSTGRES_*` variables ([19](19-docker-configuration.md)).

## 1. Backend (`backend/.env.example`)

```env
# Application
APP_ENV=development
APP_NAME=VidhiVerse AI
APP_HOST=127.0.0.1
APP_PORT=8000
CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=INFO

# Database
DATABASE_URL=

# Authentication
SECRET_KEY=
ACCESS_TOKEN_MINUTES=15
REFRESH_TOKEN_DAYS=30
GUEST_EXPIRY_DAYS=30
ADMIN_EMAIL=
ADMIN_INITIAL_PASSWORD=

# LLM
# Current decision (D-01, 2026-11-17): LLM_PROVIDER=gemini, LLM_MODEL=gemini-2.0-flash;
# fallback is Groq via the openai_compatible interface (Groq has no provider value of its
# own — it's reached through LLM_FALLBACK_BASE_URL).
LLM_PROVIDER=
LLM_MODEL=
LLM_API_KEY=
LLM_BASE_URL=
LLM_FALLBACK_PROVIDER=
LLM_FALLBACK_MODEL=
LLM_FALLBACK_API_KEY=
LLM_FALLBACK_BASE_URL=
LLM_DATA_POLICY=may_train
LLM_ALLOW_USER_DOCUMENTS=false
LLM_DAILY_TOKEN_LIMIT=500000

# Embeddings and retrieval
EMBEDDING_PROVIDER=local
EMBEDDING_MODEL=intfloat/multilingual-e5-small
EMBEDDING_DIMENSIONS=384
RAG_MIN_SIMILARITY=0.78
RERANKER_ENABLED=false
RERANKER_MODEL=
CITATION_ENTAILMENT_ENABLED=false

# Language and voice
ENABLED_LANGUAGES=en
TRANSLATION_PROVIDER=llm
SPEECH_PROVIDER=none
BHASHINI_API_KEY=
BHASHINI_USER_ID=

# SerpApi
SERPAPI_ENABLED=false
SERPAPI_API_KEY=
SERPAPI_DAILY_CAP=50
SERPAPI_COST_PER_SEARCH=1
SERPAPI_CHAT_FALLBACK_ENABLED=false

# Storage and documents
STORAGE_PROVIDER=local
STORAGE_PATH=./storage
MAX_UPLOAD_MB=20
MAX_UPLOAD_PAGES=100
DEFAULT_DOCUMENT_RETENTION_DAYS=30
TESSERACT_CMD=
```

## 2. Frontend (`frontend/.env.example`)

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=VidhiVerse AI
VITE_APP_TAGLINE=Understand Law. Access Justice.
VITE_APP_CATEGORY=AI-powered conversational legal information assistant for India.
VITE_APP_DESCRIPTION=VidhiVerse AI is an AI-powered conversational legal assistant that helps Indian citizens understand their legal rights and responsibilities, simplify legal documents, discover relevant laws and judgments, and identify appropriate next steps through reliable, source-backed explanations.
```

## 3. Reference

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | `sqlite+aiosqlite:///../storage/vidhiverse.db` — a file path, not a server; no user/password |
| `SECRET_KEY` | Yes | At least 32 random bytes. Generate: `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `LLM_PROVIDER` | For chat | `ollama`, `openai_compatible`, `gemini`, `anthropic` |
| `LLM_MODEL` | For chat | Set from the current provider list after evaluation |
| `LLM_BASE_URL` | Provider-specific | Ollama default `http://localhost:11434` |
| `LLM_DATA_POLICY` | Yes | `may_train`, `no_train`, `local`. Operator sets after reading terms. Defaults to the most restrictive assumption. |
| `LLM_ALLOW_USER_DOCUMENTS` | No | Ignored and treated as false when policy is `may_train` |
| `ENABLED_LANGUAGES` | Yes | Comma-separated ISO codes. `en` until another language passes validation. |
| `TRANSLATION_PROVIDER` | Yes | `llm`, `bhashini`, `none` |
| `SPEECH_PROVIDER` | Yes | `none`, `bhashini`; browser voice needs no backend |
| `SERPAPI_ENABLED` | Yes | Off until the admin intends to use credits |
| `STORAGE_PROVIDER` | Yes | `local` now; object storage later |

## 4. Rules

1. `.gitignore` includes `.env`, `.env.*`, with `!.env.example`.
2. A Git pre-commit secret scan runs on every commit.
3. A leaked key must be rotated, not only removed from history.
4. Do not share `.env` in chat, screenshots or demo recordings.
5. Show no terminal with environment output during the live demo.
