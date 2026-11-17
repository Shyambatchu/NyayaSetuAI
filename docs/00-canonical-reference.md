# 00 – Canonical Reference (Single Source of Truth)

Every other document **links here instead of redefining** names. If a document disagrees with this file, this file wins and the other document has a bug.

## 1. Evidence labels

| Label | Meaning |
|---|---|
| **[VERIFIED]** | Checked on 2026-10-31 against the source in the ledger (§10). Most checks used public web sources, some of them secondary; re-check before relying on them in production. |
| **[ASSUMPTION]** | Believed true or adopted for planning, not confirmed. Each one needs a check or a decision. |
| **[PROPOSED]** | An architecture or product decision made in this documentation. It can be changed through the [decision register](review/decision-register.md). |

No document in this package claims legal compliance, a government integration or a partnership. Legal statements in the docs and test sets are **planning material until verified against the official text and reviewed by a qualified legal professional**.

## 2. Product identity

| Item | Value | Configured by |
|---|---|---|
| Product name (working) | VidhiVerse AI. Availability **not verified** (L15, D-17). | `APP_NAME`, `VITE_APP_NAME` |
| Tagline | Understand Law. Access Justice. | `VITE_APP_TAGLINE` |
| Category | AI-powered conversational legal information assistant for India. | `VITE_APP_CATEGORY` |
| Description | VidhiVerse AI is an AI-powered conversational legal assistant that helps Indian citizens understand their legal rights and responsibilities, simplify legal documents, discover relevant laws and judgments, and identify appropriate next steps through reliable, source-backed explanations. | `VITE_APP_DESCRIPTION` |
| Primary problem statement | PS-02 – Access to Justice: Legal Information Chatbot | Not configurable |
| Promise | Ask in your language. Understand your rights. Find the law. Know your next step. | i18n strings |
| Repository slug | `vidhiverse-ai` (provisional) | Not user-visible |

**Rule:** the product name appears only in configuration and i18n files, never in code literals, table names, API paths, package names or prompts (prompts use `{app_name}`).

**Standard non-affiliation notice** (`NON_AFFILIATION_V1`, shown on the landing page, Privacy Centre and first slide):

> {app_name} is independently developed and is not affiliated with, or endorsed by, the Government of India, the Department of Justice or any government service, including NYAYA-SETU. It does not replace lawyers or government legal services.

**Standard disclaimer** (`DISCLAIMER_V1`, shown on every answer; `{app_name}` is substituted):

> {app_name} provides general legal information for educational and awareness purposes. It does not provide legal representation or replace advice from a qualified legal professional.

## 3. Feature IDs

**The conversational legal chatbot (F-CHAT) is the primary product and hackathon deliverable. Every other feature supports it.**

| ID | Feature | Role | Priority | Capability |
|---|---|---|---|---|
| F-CHAT | Conversational legal chatbot | **Primary product** | P0 | A |
| F-KB | Official legal knowledge base and RAG | Foundation | P0 | A, C |
| F-CITE | Citations and citation validation | Foundation | P0 | A, C |
| F-SAFE | Five-layer safety and legal disclaimers | Foundation | P0 | All |
| F-DOC | AI Legal Document Understanding | Supporting | P0 | B |
| F-RES | Citation-Backed Legal Research | Supporting | P0 | C |
| F-AUTH | Guest access, accounts, user-level isolation | Enabling | P0 | All |
| F-PLAN | Guided Legal Assistance: three reviewed workflows | Supporting | P1 | D |
| F-LANG | Hindi and Telugu, subject to time, API availability and language-quality validation (provisional, D-25). English is part of P0 F-CHAT. | Supporting | P1 | A |
| F-AID | Legal Aid Navigation | Supporting | P1 | E |
| F-CASE | Personal Legal Matter Companion: basic, optional, time-boxed | Supporting | P1 | F |
| F-HIST | Conversation history | Supporting | P1 | A |
| F-SERP | SerpApi discovery service | Enabling | P1 | Admin only |
| F-ADMIN | Admin Dashboard and Source Management | Enabling | P1 | Basic |
| F-PRIV | Privacy Centre and export (isolation, deletion and retention stay required) | Enabling | P1 | Basic |
| F-VOICE | Voice input and output | Future | P2 | |
| F-LANG-X | Additional Indian languages | Future | P2 | |
| F-CASE-X | Advanced case management | Future | P2 | |
| F-COLLAB | Lawyer collaboration | Future | P2 | |
| F-DOC-X | Advanced document intelligence | Future | P2 | |
| F-BILL | SaaS subscriptions | Future | P2 | |
| F-INST | Institutional integrations | Future | P2 | |

## 4. Enumerations

| Enum | Values |
|---|---|
| `answer_status` | `answered`, `needs_clarification`, `insufficient_sources`, `refused`, `urgent_referral` |
| `intent` | `rights_information`, `provision_lookup`, `procedure_next_steps`, `legal_aid`, `document_question`, `case_law`, `recent_update`, `workflow_guidance`, `out_of_scope` |
| `urgency` | `none`, `elevated`, `immediate_safety` |
| `effective_status` | `in_force`, `partially_in_force`, `not_yet_in_force`, `repealed`, `superseded_version`, `unknown` |
| `validation_status` | `unverified`, `verified`, `needs_review`, `rejected` |
| `source_type` | `constitution`, `central_act`, `state_act`, `rules`, `regulations`, `notification`, `judgment`, `government_resource` |
| `jurisdiction_level` | `national`, `central`, `state`, `union_territory` |
| `document status` | `uploaded`, `extracting`, `ocr`, `chunking`, `embedding`, `ready`, `failed`, `deleted` |
| `serp_bucket` | `legal_discovery`, `case_discovery`, `updates`, `regional_resources`, `evaluation`, `reserve` |
| `language` | `en` (P0); `hi`, `te` (P1); others later (ISO 639-1). `ENABLED_LANGUAGES` controls what is offered. |
| `role` | `user`, `admin` |
| `finding_type` | `obligation`, `deadline`, `penalty`, `important_term`, `possible_concern` |
| `citation_check` | `verified`, `superseded`, `not_found`, `ambiguous` |
| `link_relation` | `interprets`, `applies`, `upholds`, `strikes_down`, `mentions` |
| `workflow_run status` | `in_progress`, `completed`, `abandoned` |
| `checklist status` | `pending`, `done`, `not_applicable` |
| `matter status` | `open`, `closed` |
| `deadline status` | `pending`, `done`, `dismissed` |
| `state_code` | Two-letter project codes in `core/languages.py`; MVP uses `TG` Telangana, `AP` Andhra Pradesh, `UP` Uttar Pradesh, `DL` Delhi, `MH` Maharashtra |

`validation_status` describes **our review of a record**. `effective_status` describes **the law itself**. They must never be merged.

## 5. Database tables (34)

**Required by the brief (16):** `users`, `user_preferences`, `chat_sessions`, `chat_messages`, `legal_sources`, `legal_acts`, `legal_sections`, `legal_chunks`, `legal_cases`, `legal_citations`, `user_documents`, `document_chunks`, `feedback`, `source_updates`, `audit_logs`, `serpapi_usage_logs`.

**Supporting additions (6):** `refresh_tokens`, `ingestion_jobs`, `section_concordance`, `legal_aid_authorities`, `legal_aid_resources`, `serpapi_cache`.

**Strategy additions (12):** `document_clauses`, `document_findings`, `legal_amendments`, `provision_case_links`, `workflow_templates`, `workflow_runs`, `workflow_checklist_items`, `legal_matters`, `matter_documents`, `matter_events`, `matter_deadlines`, `matter_notes`.

Each addition is justified in [11-database-schema](technical/11-database-schema.md#3-why-tables-were-added).

## 6. API endpoints (83, prefix `/api/v1`)

Thirty-seven come from the brief. Additions are marked ➕ (platform support) and ★ (supporting capabilities; workflow and matter routes are P1 and are built only if those features are), and are justified in [12-api-specification](technical/12-api-specification.md#2-endpoints-added-to-the-brief).

| Group | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, ➕`POST /auth/guest` |
| Users | `GET /users/me`, `PATCH /users/preferences`, ➕`DELETE /users/me`, ➕`GET /users/me/export` |
| Chat | `POST /chat/sessions`, `GET /chat/sessions`, `GET /chat/sessions/{id}`, `POST /chat/sessions/{id}/messages`, `POST /chat/messages/{id}/feedback`, `DELETE /chat/sessions/{id}` |
| Legal | `GET /legal/acts`, `GET /legal/acts/{id}`, `GET /legal/sections/{id}`, `GET /legal/cases/search`, `GET /legal/cases/{id}`, `GET /legal/sources`, ➕`GET /legal/search`, ★`GET /legal/acts/{id}/amendments`, ★`GET /legal/sections/{id}/compare`, ★`GET /legal/sections/{id}/related`, ★`POST /legal/citations/verify`, ★`POST /legal/research/explain` |
| Documents | `POST /documents/upload`, `GET /documents`, `GET /documents/{id}`, `POST /documents/{id}/summarize`, `POST /documents/{id}/ask`, `DELETE /documents/{id}`, ★`POST /documents/{id}/analyze`, ★`GET /documents/{id}/clauses`, ★`GET /documents/{id}/findings`, ★`GET /documents/{id}/file` |
| Workflows | ★`GET /workflows`, ★`POST /workflows/match`, ★`GET /workflows/{id}`, ★`POST /workflows/{id}/runs`, ★`GET /workflow-runs`, ★`GET /workflow-runs/{id}`, ★`PATCH /workflow-runs/{id}`, ★`PATCH /workflow-runs/{id}/items/{item_id}` |
| Matters | ★`POST /matters`, ★`GET /matters`, ★`GET /matters/{id}`, ★`PATCH /matters/{id}`, ★`DELETE /matters/{id}`, ★`POST /matters/{id}/documents`, ★`DELETE /matters/{id}/documents/{document_id}`, ★`GET /matters/{id}/timeline`, ★`POST /matters/{id}/events`, ★`DELETE /matter-events/{id}`, ★`GET /matters/{id}/deadlines`, ★`POST /matters/{id}/deadlines`, ★`PATCH /matter-deadlines/{id}`, ★`GET /matters/{id}/deadlines.ics`, ★`GET /matters/{id}/notes`, ★`POST /matters/{id}/notes`, ★`DELETE /matter-notes/{id}`, ★`GET /reminders/due` |
| Language | `GET /languages`, `POST /languages/detect`, `POST /languages/translate` |
| Voice | `POST /voice/transcribe`, `POST /voice/synthesize` |
| Legal aid | `GET /legal-aid/eligibility`, `GET /legal-aid/authorities`, `GET /legal-aid/resources`, `GET /legal-aid/helplines` |
| Feedback | ➕`POST /feedback` |
| System | `GET /health` |
| Admin | `GET /admin/source-status`, `GET /admin/serpapi-usage`, `GET /admin/ingestion-status`, ➕`PATCH /admin/sources/{id}`, ➕`POST /admin/ingestion-jobs`, ➕`POST /admin/serpapi/search`, ➕`GET /admin/source-updates`, ➕`PATCH /admin/source-updates/{id}`, ➕`GET /admin/feedback` |

## 7. Frontend pages and routes

| # | Page (brief) | Route | Access |
|---|---|---|---|
| 1 | Landing Page | `/` | Public |
| 2 | AI Legal Chat (**primary experience**) | `/chat`, `/chat/:sessionId` | Guest or user |
| 3 | Legal Research | `/research`, `/research/acts/:id`, `/research/sections/:id`, `/research/cases/:id` | Public |
| 4 | Document Explainer | `/documents`, `/documents/:id` | Registered user |
| 5 | Legal Aid Navigator | `/legal-aid` | Public |
| 6 | Conversation History | `/history` | Guest or user |
| 7 | Language Settings | `/settings/language` | Guest or user |
| 8 | User Profile | `/profile` | Registered user |
| 9 | Privacy Centre | `/privacy` | Public; actions need sign-in |
| 10 | Feedback | `/feedback` | Guest or user |
| 11 | Admin Dashboard | `/admin` | Admin |
| 12 | Source Management | `/admin/sources` | Admin |
| 13 | Guided Assistance (P1) | `/planner`, `/planner/:runId` | Browse: public; plans: guest or user |
| 14 | Matter Companion (P1, optional) | `/matters`, `/matters/:id` | Registered user |

## 8. Core architecture decisions

| Topic | Decision |
|---|---|
| Deployment shape | Modular monolith: one FastAPI process, one React app, one SQLite file — no database server, no Docker |
| Python / Node | Python 3.12, Node 24 (matches the development machine); SQLite with `sqlite-vec` (vector search) and FTS5 (full-text/trigram) |
| AI code location | `backend/app/ai/`, replacing the brief's top-level `ai-engine/` ([reason](technical/14-backend-architecture.md#2-repository-structure-and-changes-from-the-brief)) |
| Background work | In-process worker polling `ingestion_jobs`; no Redis |
| Embeddings | `intfloat/multilingual-e5-small`, 384 dimensions, `query: ` and `passage: ` prefixes, subject to a licence and performance check |
| Retrieval | SQLite FTS5 full-text search + `sqlite-vec` brute-force vector search, fused with Reciprocal Rank Fusion (k = 60), optional reranker behind `RERANKER_ENABLED` |
| Positioning | Conversational legal information assistant under PS-02. Not a separate or broader platform. Other capabilities support the chatbot and are reachable from a conversation. |
| Language architecture | Multilingual-ready from Week 1, with English the only committed language ([15](technical/15-multilingual-architecture.md#1-language-plan)) |
| Chat integration | Messages may carry a `document_id`; answers carry `suggested_actions` that open documents, comparison, workflows or legal aid |
| Government services | Existing services are linked and labelled, with no implied affiliation. Integration only if officially documented and permitted. |
| Document evidence | A finding is shown only if its quote is a substring of the extracted text |
| Workflows | Human-authored, reviewed, versioned JSON with declarative rules. The LLM matches and rephrases, and cannot add steps. |
| Provision comparison | Deterministic diff; mapping from `section_concordance` |
| Reminders | In-app and `.ics` only in MVP; deadlines need user confirmation |
| Answer pipeline | Generate canonical English, validate citations, safety check, then translate with protected tokens |
| Streaming | SSE status events during processing; **answer text is released only after validation** |
| Citation markers | `[[C1]]`, `[[C2]]`… bound to retrieved chunks by the server |
| Guests | Real `users` row with `is_guest = true`, 30-day expiry, no document upload or matters |
| Auth | Argon2id passwords; 15-minute JWT access token in memory; rotating 30-day refresh token in an httpOnly cookie, hashed in the database |
| IDs and time | UUID primary keys (`audit_logs` excepted); `timestamptz` in UTC; legal effect dates as `date` |
| Errors | `{"error":{"code","message","details","request_id"}}` |
| Pagination | `?limit=&cursor=` returning `{"items":[],"next_cursor":null}` |

## 9. Environment variables

The authoritative list is [20-environment-variables](infrastructure/20-environment-variables.md).

## 10. Verification ledger (checked 2026-10-31)

| # | Fact | Consequence | Confidence | Source |
|---|---|---|---|---|
| L1 | An AI-powered "Nyaya Setu" legal chatbot under the Department of Justice is live; WhatsApp access was reported in early 2026 and a formal launch around 29 March–1 April 2026. Reported dates differ. | The reason the earlier working name was dropped. We still keep the non-affiliation notice and treat these services as referral destinations. See [R-01](hackathon/30-known-limitations-and-risks.md). | Medium: press, no primary release found | [Digit](https://www.digit.in/news/apps/need-legal-advice-governments-nyaya-setu-is-now-available-on-whatsapp-for-free-heres-how-to-use.html), [OpenGov Asia](https://opengovasia.com/india-launches-disha-2-0-to-expand-digital-access-to-justice/) |
| L2 | DPDP Rules 2025 notified November 2025 (G.S.R. 846(E) as reported); core obligations commence about 18 months later, in May 2027. Sources differ on the exact day. | Plan for them now; confirm dates from the Gazette. | Medium: law-firm summaries | [AZB](https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/), [Mondaq](https://www.mondaq.com/india/data-protection/1708164/digital-personal-data-protection-rules-2025-notified) |
| L3 | SerpApi counts only successful searches; cached, errored and failed searches are not charged. Free plan is listed as 250 searches a month. | Local cache and budget guard design. Cache lifetime on SerpApi's side is unconfirmed, so we keep our own. | High for charging rule | [SerpApi pricing](https://serpapi.com/pricing.md) |
| L4 | Supabase Free: 500 MB database per project, 1 GB storage, pause after 1 week of inactivity, no automatic backups, 2 active projects. | The 500 MB limit may not hold the corpus plus vectors. | Medium-high | [Supabase pricing](https://supabase.com/pricing) |
| L5 | Render Free: spins down after 15 minutes without traffic, local filesystem changes lost, 750 free instance hours a month, spin-up up to about a minute. | Unsuitable for local file storage or an in-memory embedding model. | High | [Render docs](https://render.com/docs/free) |
| L6 | BHASHINI community clients use a user ID and API key. No official developer documentation was retrieved. | **No endpoints are specified in this package.** Provider stays behind an interface until access is confirmed. | Low | [Community client](https://github.com/vinayakjaas/sb_translate) |
| L7 | BNS, BNSS and BSA commenced 1 July 2024, replacing IPC, CrPC and the Evidence Act, with older matters still governed by older law. The BNS notification has an exception, recalled as s.106(2), not confirmed. | Temporal retrieval is mandatory. Encode the exception only from the Gazette. | High for date, low for exception | [LiveLaw](https://www.livelaw.in/amp/top-stories/new-criminal-laws-replacing-ipc-crpc-evidence-act-to-come-into-force-from-july-1-2024-250395) |
| L8 | NALSA helpline 15100 is reported by NALSA sites and a DoT short-code allocation. Legal aid eligibility sits in s.12 and the merit test in s.13 of the Legal Services Authorities Act, 1987. | Seed after checking. Income ceilings vary, so they are State data and not hard-coded. | High for 15100 | [NALSA Kerala](https://kerala.nalsa.gov.in/?p=6549), [DoT](https://dot.gov.in/node/5359) |
| L9 | The Gemini API free tier is reported as using submitted content to improve Google's products; paid tiers do not. | Free-tier LLMs must never receive user documents or unredacted personal data. | Medium-high | [Google pricing](https://ai.google.dev/pricing) |
| L10 | Tele-Law helpline number was **not** confirmed; `14454` is from memory. A WhatsApp number was reported in press only. | Do not seed either until confirmed on an official page. | Unverified | n/a |
| L11 | Model card facts for `multilingual-e5-small` (MIT licence, 384 dimensions, prefixes) are from memory. | Confirm on the model card in Week 1. | Medium | [Model card](https://huggingface.co/intfloat/multilingual-e5-small) |
| L12 | The Web Speech API's recognition depends on browser and vendor service, and Telugu voices depend on the device. From engineering knowledge, not re-tested. | Spike in Week 3 with a device matrix. | Medium | n/a |
| L16 | Public sources describe Nyaya Setu as a voice and text legal assistant, with an official portal reported at [nyayasetu.doj.gov.in](https://nyayasetu.doj.gov.in/). Details of its language coverage, architecture and capabilities were **not confirmed** from official documentation, and no direct test was done. | Treat as an existing, complementary government service. Do not state specifics or claim gaps without verified direct testing (D-14). | Medium for existence; none for details | [Prayas India](https://theprayasindia.com/nyaya-setu-ai-chatbot/) |
| L14 | The four Labour Codes came into force on 21 November 2025, replacing 29 Central labour laws, with savings for existing rules; central rules were reported notified in May 2026 and State rules vary. | Employment answers must not rely on older Acts for current events. Older Acts are kept as historical. Check details in the Gazette. | Medium-high: law-firm updates | [Trilegal](https://trilegal.com/knowledge-repository/trilegal-update-labour-codes-go-live/), [SCC Online](https://www.scconline.com/blog/?p=367766) |
| L15 | Two web searches found no product, company or trademark named exactly "VidhiVerse". They did find similar elements: "Vidhi AI", a legal model on Hugging Face, and a VIDHI DESIGN STUDIO trademark application. Marks ending in "-verse" are also common, and the government's DISHA 2.0 reportedly includes a platform named VIDHI-Sanjeevani. | **This is not clearance.** No trademark registry or domain registrar was checked. See D-17. | Low: general web search only | [Vidhi AI](https://huggingface.co/shreyansh12183/Vidhi-AI-Instruct), [Vidhi Design Studio](https://www.registerkaro.in/trademark-search/vidhi-design-studio-6922279), [OpenGov Asia](https://opengovasia.com/india-launches-disha-2-0-to-expand-digital-access-to-justice/) |
| L13 | Docker was **not found** on the Git Bash PATH of the development machine on 2026-10-31. Python 3.12.3 and Node 24.18.0 were found. | **Resolved 2026-11-17, moot rather than fixed:** the database moved from Docker Postgres+pgvector to a single SQLite file ([19](technical/19-docker-configuration.md)), so nothing in the MVP needs Docker any more. | Checked locally | Local check |
