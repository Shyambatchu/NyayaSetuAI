# 29 – Development Roadmap

**Rewritten 2026-11-17 (D-03).** The team page confirmed: code freeze is **2026-12-01
09:18 IST** — about **13 working days from today**, not the four weeks this doc originally
assumed — and the build is **solo**, not a 3–4 person team. The capacity table in the
original plan already said what that means: *"2 people or fewer: not achievable as
written"* for the full P0 scope. So this is not the four-week plan compressed — it's a
different, much smaller plan: **just the chatbot core**, built to actually ship a working,
deployed demo rather than a partial, broken attempt at everything.

**Cut entirely for this submission** (all deferred to post-hackathon, not abandoned):
full auth/registration (guest-only sessions instead — also better UX, no sign-up friction),
document explainer, legal research module, guided workflows, Hindi/Telugu, Legal Aid
Navigator, case companion, SerpApi, admin UI. Reasons are in the
[decision register](../review/decision-register.md) (D-01, D-03, D-04, D-05, D-07, D-18, D-22).

## 0. Deployment is a Day-1 task, not a Week-4 task

The team page requires a **deployed demo link**, not a local-only demo ([D-22](../review/decision-register.md)).
Decided targets: backend on **Render's free web service**, frontend on a static free host
(Cloudflare Pages or Vercel). Render free tier's filesystem is ephemeral — it resets on
every restart/redeploy ([24](../infrastructure/24-deployment-guide-future.md)) — which matters
specifically because the database is a SQLite *file*:

- **Legal corpus:** precompute it once, locally (chunk + embed), and commit the result as a
  small seed (`database/seeds/`) that boot-time startup loads directly. This means the
  embedding model only has to run once, on a dev machine, never inside the free host — the
  deployed process only embeds the user's one-line question per request, which is cheap.
- **User chat history:** will not survive a Render restart on the free tier. Acceptable for
  a demo: there's no real user data at stake, and `storage/.gitkeep`'s retention logic
  already assumes files can be purged. State this plainly if asked; don't let it surprise anyone.
- **Embedding provider:** prefer an API-based embedder (e.g. Gemini's embedding endpoint)
  over running a local transformer in-process, to avoid the memory/cold-start cost noted in
  [24](../infrastructure/24-deployment-guide-future.md) on a free-tier host. Confirm the actual
  output dimension from the provider's docs before fixing `vec0`'s `float[N]` in `schema.sql`
  — don't assume it's still 384.

Deploy a trivial "hello world" version of both services on Day 1–2, before any real
feature work, so hosting problems surface with 12 days of runway left, not 1.

**Manual steps (need your own account/login — not something that can be scripted):**

1. Push this repo to GitHub (the local backend+frontend scaffold and `render.yaml` are ready as of 2026-11-17).
2. On [render.com](https://render.com): New → Blueprint → connect the repo → it reads `render.yaml` at the root. Fill in the `sync: false` secrets (`LLM_API_KEY`, `LLM_FALLBACK_API_KEY`) now; leave `CORS_ORIGINS` for step 4.
3. On [pages.cloudflare.com](https://pages.cloudflare.com) (or Vercel): connect the same repo, root directory `frontend`, build command `npm run build`, output directory `dist`, environment variable `VITE_API_BASE_URL` = `https://<your-render-service>.onrender.com/api/v1`.
4. Back on Render: set `CORS_ORIGINS` to the Cloudflare Pages URL from step 3, redeploy.
5. Open the Cloudflare Pages URL and send a test message — confirms the same path just verified locally works deployed.

I can prepare every file and value above, and verify the result once a URL exists, but creating accounts and clicking through these dashboards needs you signed in.

## 1. Phases

| Phase | Days (of ~13) | Deliverable |
|---|---:|---|
| 1. Scaffold + deploy skeleton | 1–2 | FastAPI + React shells running locally **and** on Render + Cloudflare Pages; SQLite schema applied (`apply_schema.py`); guest-only chat session, no auth flow |
| 2. Corpus | 3–6 | ~10–15 hand-verified chunks across a few sources (Constitution Articles 14/19/21, Consumer Protection Act complaint provisions, one or two IPC→BNS mappings); embeddings precomputed and committed as a seed |
| 3. RAG pipeline | 6–9 | Hybrid retrieval (`vec0` + FTS5, fused with RRF — query pattern in [09 §4](../technical/09-rag-architecture.md#4-hybrid-retrieval)), Gemini generation, citation validator against source text, `insufficient_sources` gate, disclaimers |
| 4. Chat API + UI, redeploy | 9–11 | SSE streaming answers, citation cards in the UI, deployed version matches local behaviour |
| 5. Rehearse + submit | 12–13 | Demo rehearsed **against the deployed link**, project description written, short backup screen-recording made, submitted from the team page with a day of margin — not at 09:17 IST on the freeze date |

**Non-negotiable even under time pressure:** citation validation and the
`insufficient_sources`/decline path. A chatbot that states law without a checked source is
the one thing this project explicitly must not ship — cut UI polish before cutting this.

## 2. Why this is the right cut, not corner-cutting

Judging weights (confirmed, [26 §4](26-hackathon-strategy.md#4-actual-judging-criteria-hackindia-ai-for-lawyers-hackathon-confirmed-d-03)):
Technical Implementation 40%, Innovation 30%, UX 20%, Impact 10%. A deployed, working
chatbot with validated citations scores on the 70% that is Technical Implementation +
Innovation; a half-built document explainer with no time left to test it scores on neither
and risks breaking the demo. One thing done solidly beats three things half-done.

## 3. If time is left after Phase 5

In order, only if the core is deployed, rehearsed and solid first:

1. A second verified corpus source (breadth over the same, already-working pipeline)
2. A minimal document Q&A path (upload → chunk → same retrieval, no clause/findings UI)
3. Basic research lookup (section-number → verified text, no comparison/verification)

Do not start any of these before Phase 5 is genuinely done — a working narrow demo beats a
broken broad one, and the deadline is fixed.

## Post-hackathon

Everything cut above, plus brand clearance (D-17), legal assessment, user testing, then the
P2 roadmap, deployment evaluation ([24](../infrastructure/24-deployment-guide-future.md)) and
SaaS planning ([25](../infrastructure/25-saas-scalability.md)).
