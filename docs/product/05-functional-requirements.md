# 05 – Functional Requirements

Priority: **M** must (P0), **S** should (P1), **C** could. Test IDs are defined in [23](../infrastructure/23-testing-strategy.md).

**F-CHAT is the primary product. Other sections are supporting capabilities.**

## Conversational legal chatbot (F-CHAT) – primary

| ID | Requirement | Pri | API | Test |
|---|---|---|---|---|
| FR-CHAT-01 | Create a session with language and optional State | M | `POST /chat/sessions` | T-API |
| FR-CHAT-02 | Send a question; receive an SSE-streamed response | M | `POST /chat/sessions/{id}/messages` | T-API |
| FR-CHAT-03 | Use the last 10 messages to rewrite follow-ups into standalone queries | M | same | T-RAG |
| FR-CHAT-04 | Return `needs_clarification` with questions when State, date or essential facts are missing and the law depends on them | M | same | Q-11 |
| FR-CHAT-05 | Return structured answer: content, citations, related provisions, next steps, disclaimer | M | same | T-API |
| FR-CHAT-06 | Record thumbs up/down with an optional reason | S | `POST /chat/messages/{id}/feedback` | T-API |
| FR-CHAT-07 | Display starter questions per language, and offer document upload, research or a plan where relevant | S | Static i18n | T-UI |
| FR-CHAT-08 | Reject questions over 2,000 characters with `VALIDATION_ERROR` | M | same | T-API |
| FR-CHAT-09 | Accept a `document_id` so the conversation can answer about an attached document | M | same | T-API |
| FR-CHAT-10 | Return `suggested_actions` for documents, comparison, workflows and legal aid | M | same | T-API |
| FR-CHAT-11 | Include relevant provisions and judgments, with official links, in answers | M | same | T-RAG |

## History (F-HIST)

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-HIST-01 | List own sessions newest first | S | `GET /chat/sessions` |
| FR-HIST-02 | Open a session and its messages | S | `GET /chat/sessions/{id}` |
| FR-HIST-03 | Delete a session | S | `DELETE /chat/sessions/{id}` |
| FR-HIST-04 | When `store_history` is false, delete messages 24 hours after last activity | S | Preference and worker |

## Knowledge base (F-KB) and citations (F-CITE)

| ID | Requirement | Pri |
|---|---|---|
| FR-KB-01 | Ingest official PDF or HTML with the full metadata in [10 §4](../technical/10-legal-data-ingestion.md) | M |
| FR-KB-02 | Parse Act, Part, Chapter, Section, sub-section | M |
| FR-KB-03 | Store versions with `valid_from` and `valid_to` | M |
| FR-KB-04 | Hybrid retrieval with jurisdiction, date, validity filters | M |
| FR-KB-05 | Only `verified` chunks qualify as citations; `needs_review` chunks are excluded by default | M |
| FR-KB-06 | Map IPC, CrPC, Evidence Act sections to successors via `section_concordance` | S |
| FR-CITE-01 | Reject any citation marker not bound to a retrieved chunk | M |
| FR-CITE-02 | Detect section, Article or case references in text not supported by cited sources; repair once, else withhold | M |
| FR-CITE-03 | Persist each citation in `legal_citations` | M |
| FR-CITE-04 | Direct lookup answers "section not found" for non-existent references | M |

## Language (F-LANG) – English P0; Hindi and Telugu P1; others P2

Hindi and Telugu are subject to time, API availability and language-quality validation (provisional, D-25). `GET /languages` and enablement by configuration are P0, so that later languages need no structural change.

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-LANG-01 | List supported languages | M | `GET /languages` |
| FR-LANG-02 | Detect `en`, `hi`, `te` including best-effort Romanized forms | S | `POST /languages/detect` |
| FR-LANG-03 | Reply in the preferred language; preserve Act names, section numbers, citations | S | Chat |
| FR-LANG-04 | Translate on demand through provider interface | S | `POST /languages/translate` |
| FR-LANG-05 | Show original-language legal text beside explanation | S | Citation card |

## Voice (F-VOICE)

| ID | Requirement | Pri |
|---|---|---|
| FR-VOICE-01 | Browser speech input where available, with a privacy notice (stretch) | C |
| FR-VOICE-02 | Read answers aloud where a voice exists (stretch) | C |
| FR-VOICE-03 | `POST /voice/transcribe` and `POST /voice/synthesize` return `503 FEATURE_UNAVAILABLE` until a provider is configured | C |

## Document Understanding (F-DOC) – supporting, P0

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-DOC-01 | Upload PDF up to 20 MB and 100 pages, with consent | M | `POST /documents/upload` |
| FR-DOC-02 | Extract text with page and character positions; OCR when no text layer exists | M | Worker |
| FR-DOC-03 | Show processing status | M | `GET /documents/{id}` |
| FR-DOC-04 | Summarize in plain language | M | `POST /documents/{id}/summarize` |
| FR-DOC-05 | Segment and explain clause by clause | M | `POST /documents/{id}/analyze`, `GET /documents/{id}/clauses` |
| FR-DOC-06 | Identify obligations, deadlines, penalties, important terms, possible concerns | M | `GET /documents/{id}/findings` |
| FR-DOC-07 | Every finding has a page and an exact quote verified against extracted text; otherwise it is dropped | M | Evidence check |
| FR-DOC-08 | Open the original at the page and highlight the passage | M | `GET /documents/{id}/file` |
| FR-DOC-09 | Answer only from the document, with evidence; separate document content from law; say when the document is silent | M | `POST /documents/{id}/ask` |
| FR-DOC-10 | No unsupported claim that a clause is illegal or unenforceable; describe the concern and recommend review | M | Prompt and output check |
| FR-DOC-11 | Delete file, chunks, clauses, findings and derived data | M | `DELETE /documents/{id}` |
| FR-DOC-12 | Warn when the upload appears to contain sensitive identifiers | S | Worker |

## Citation-Backed Research (F-RES) – supporting, P0

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-RES-01 | List and filter Acts | M | `GET /legal/acts` |
| FR-RES-02 | View an Act and its sections | M | `GET /legal/acts/{id}` |
| FR-RES-03 | View a section with version and amendment notes | M | `GET /legal/sections/{id}` |
| FR-RES-04 | Search by keyword, meaning or number across the corpus | M | `GET /legal/search` |
| FR-RES-05 | Search and view judgments | M | `GET /legal/cases/search`, `GET /legal/cases/{id}` |
| FR-RES-06 | Every result has source, jurisdiction, dates, link | M | All above |
| FR-RES-07 | List public sources and verification dates | S | `GET /legal/sources` |
| FR-RES-08 | Show amendments with instrument, effect and date | M | `GET /legal/acts/{id}/amendments` |
| FR-RES-09 | Link provisions to judgments and related provisions | M | `GET /legal/sections/{id}/related` |
| FR-RES-10 | Compare historical and current provisions by deterministic diff | M | `GET /legal/sections/{id}/compare` |
| FR-RES-11 | Verify a citation against the index and show the official link | M | `POST /legal/citations/verify` |
| FR-RES-12 | Explain selected research records in accessible language with validated citations | S | `POST /legal/research/explain` |

## Guided Assistance (F-PLAN) – supporting, P1

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-PLAN-01 | Browse verified workflows | S | `GET /workflows`, `GET /workflows/{id}` |
| FR-PLAN-02 | Understand the situation through conversation and suggest reviewed workflows; the user chooses | S | `POST /workflows/match` |
| FR-PLAN-03 | Start a plan and answer questions | S | `POST /workflows/{id}/runs`, `PATCH /workflow-runs/{id}` |
| FR-PLAN-04 | Produce required documents, preparation steps, authorities, procedural information and possible next steps by declarative rules | S | `GET /workflow-runs/{id}` |
| FR-PLAN-05 | Track checklist progress | S | `PATCH /workflow-runs/{id}/items/{item_id}` |
| FR-PLAN-06 | Show only `verified` templates, with sources and review date | S | All |
| FR-PLAN-07 | The LLM cannot add steps, authorities, deadlines or fees (mandatory whenever F-PLAN is built) | S | Design and test |
| FR-PLAN-08 | Never imply representation; show escalation to an advocate or legal aid | S | Content review |
| FR-PLAN-09 | List own plans | S | `GET /workflow-runs` |

## Matter Companion (F-CASE) – supporting, P1, optional

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-CASE-01 | Create, view, edit, close and delete private matters | C | `POST /matters`, `GET /matters`, `GET /matters/{id}`, `PATCH /matters/{id}`, `DELETE /matters/{id}` |
| FR-CASE-02 | Attach and detach own documents | C | `POST /matters/{id}/documents`, `DELETE /matters/{id}/documents/{document_id}` |
| FR-CASE-03 | Timeline combining events and sources | C | `GET /matters/{id}/timeline`, `POST /matters/{id}/events`, `DELETE /matter-events/{id}` |
| FR-CASE-04 | Add deadlines, or promote a finding only after user confirmation | C | `GET /matters/{id}/deadlines`, `POST /matters/{id}/deadlines`, `PATCH /matter-deadlines/{id}` |
| FR-CASE-05 | In-app reminders and calendar download | C | `GET /reminders/due`, `GET /matters/{id}/deadlines.ics` |
| FR-CASE-06 | Private notes, with a no-privilege notice | C | `GET /matters/{id}/notes`, `POST /matters/{id}/notes`, `DELETE /matter-notes/{id}` |

## Legal aid (F-AID)

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-AID-01 | Explain general eligibility, s.12 and s.13 of the 1987 Act, without deciding it | S | `GET /legal-aid/eligibility` |
| FR-AID-02 | Find authorities by State and district | S | `GET /legal-aid/authorities` |
| FR-AID-03 | List official resources and application links | S | `GET /legal-aid/resources` |
| FR-AID-04 | List verified helplines | S | `GET /legal-aid/helplines` |
| FR-AID-06 | Link to Tele-Law and other official services, labelled and with no implied affiliation | S | `GET /legal-aid/resources` |
| FR-AID-05 | Chat links to Navigator when intent is `legal_aid` or affordability is mentioned | S | Chat |

## Accounts and privacy (F-AUTH, F-PRIV)

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-AUTH-01 | Silent guest session | M | `POST /auth/guest` |
| FR-AUTH-02 | Register; a guest's history transfers on registration | M | `POST /auth/register` |
| FR-AUTH-03 | Login, refresh rotation, logout | M | `POST /auth/login`, `/auth/refresh`, `/auth/logout` |
| FR-AUTH-04 | Read own profile and change preferences | S | `GET /users/me`, `PATCH /users/preferences` |
| FR-AUTH-05 | All user data filtered by authenticated user | M | All |
| FR-PRIV-01 | Export own data as JSON | S | `GET /users/me/export` |
| FR-PRIV-02 | Delete account and data | S | `DELETE /users/me` |
| FR-PRIV-03 | Set document retention period | S | `PATCH /users/preferences` |

## SerpApi and admin (F-SERP, F-ADMIN)

| ID | Requirement | Pri | API |
|---|---|---|---|
| FR-SERP-01 | Budget-checked discovery with cache and logs | S | `POST /admin/serpapi/search` |
| FR-SERP-02 | Discovered links stored for human review, never used as authority | M | `GET /admin/source-updates`, `PATCH /admin/source-updates/{id}` |
| FR-SERP-03 | Show estimated and actual credit use separately | S | `GET /admin/serpapi-usage` |
| FR-ADM-01 | Source and validation status | S | `GET /admin/source-status`, `PATCH /admin/sources/{id}` |
| FR-ADM-02 | Start and monitor ingestion | S | `POST /admin/ingestion-jobs`, `GET /admin/ingestion-status` |
| FR-ADM-03 | Review answer and general feedback | C | `GET /admin/feedback` |
| FR-ADM-04 | Accept general product feedback | C | `POST /feedback` |
| FR-ADM-05 | Service health | S | `GET /health` |
