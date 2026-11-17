# Consistency Review

Review of all 30 documents, the canonical reference and the README. First carried out 2026-10-31, and re-run after the VidhiVerse AI rename, the withdrawn repositioning (§6) and the final chatbot-first positioning (§7).

**Addendum, 2026-11-17:** the database moved from PostgreSQL+pgvector in Docker to a single
SQLite file (`sqlite-vec` + FTS5) — see [19](../infrastructure/19-docker-configuration.md) and
[11](../technical/11-database-schema.md). Everything below this line describes the
PostgreSQL-era design as it stood on 2026-10-31 and is kept as a historical record, not a
current description — in particular, §1's "parses with the PostgreSQL parser" and §4.7/§4.6's
Docker and Supabase findings no longer apply to the current schema.

## 1. Automated checks

Run with throwaway scripts outside the repository. No application code was written.

| Check | Result |
|---|---|
| All 30 required files exist with the names in the brief | Pass |
| Internal links and heading anchors resolve | Pass |
| Endpoints named anywhere exist in the canonical list; all 83 appear in [12](../technical/12-api-specification.md) | Pass |
| DDL, canonical list, ER diagram and migration plan all contain the same 34 tables | Pass |
| Every environment variable used is defined in [20](../infrastructure/20-environment-variables.md) | Pass |
| Decision, risk, ledger and feature IDs resolve to a definition | Pass |
| All Mermaid diagrams parse with Mermaid 11 | Pass |
| The DDL parses with the PostgreSQL parser (`libpg-query`), and foreign keys reference earlier tables | Pass |
| No secret-like strings or claims of certified compliance | Pass |
| Every canonical endpoint maps to a functional requirement | Pass |
| No statement that Nyaya Setu lacks a feature; no unverified language or architecture claims; no claim that the name is available; no claim to replace lawyers | Pass; matches were reviewed and are all prohibitions |
| No current document describes the product as a Legal Intelligence Platform | Pass; the phrase remains only as the PRD's prohibition, as history in this review, and in a closed decision |
| Category, tagline and non-affiliation text in README, canonical reference, overview, demo and slides | Pass |

**Not tested:** the DDL has been parsed, not executed, as Docker was unavailable. Setup commands have not been run since no code exists yet. Execute the DDL in Week 1.

## 2. Issues found and fixed

| # | Issue | Fix |
|---|---|---|
| 1 | Streaming versus validation: the brief wants both streamed responses and pre-display citation validation, which conflict | Status events stream at once, and text is released after validation |
| 2 | Retrieval SQL used a shared CTE that would have stopped the HNSW index being used | Filters repeated per branch |
| 3 | SerpApi plan spent credits in Week 1, but the roadmap builds the service in Week 2 | Week 1 now uses manual lookup |
| 4 | Section page promised a cached AI explanation with no column, endpoint or validation path | Replaced by "Explain this in chat" |
| 5 | Migration order: `ingestion_jobs` references documents, yet document tables were planned for Week 2 | Tables move to Week 1, feature stays in Week 3 |
| 6 | Reserve confirmation and forced cache refresh were in [16](../technical/16-serpapi-integration.md), but not the API | Added to request body |
| 7 | Document summary cache had no per-language storage | `summary_json` is keyed by language |
| 8 | Curated judgments had no roadmap task | Added to Week 3 |
| 9 | Test case total was wrong | Corrected to 190 |
| 10 | `state_code` values were undefined | Added to canonical reference |
| 11 | Some enum columns lacked `CHECK` constraints | Added |
| 12 | Data-minimisation requirement conflicted with the optional display name | Requirement updated |

## 3. Where this package departs from the brief

Each is deliberate. Reverse any through the [decision register](decision-register.md).

| Brief | Package | Reason |
|---|---|---|
| Top-level `ai-engine/` | `backend/app/ai/` | Same process and dependencies |
| 16 tables | 34 | Eighteen more needed by required and strategy features |
| 37 endpoints | 83 | Research depth, Planner, Companion, privacy, guest access and admin actions had no route |
| Corpus list | Adds Legal Services Authorities Act, Transfer of Property Act, Registration Act, historical criminal laws, Labour Codes | Demos 2, 3 and 4 and temporal law need them |
| "Streaming responses" | Validated text only | See issue 1 |
| "Encryption at rest" | Pre-deployment gate, not in local Phase 1 | Honest statement; use synthetic documents locally |
| NYAYA-SETU described as an existing service | Product renamed to VidhiVerse AI; non-affiliation notice retained | It is now reported as a same-purpose AI chatbot (L1) |

## 4. Findings the brief did not anticipate

1. **Government Nyaya Setu was a direct namesake of the earlier working name.** The team has since moved to VidhiVerse AI. See [R-01](../hackathon/30-known-limitations-and-risks.md) and [R-23](../hackathon/30-known-limitations-and-risks.md).
2. **Labour law changed.** The four Labour Codes took effect on 21 November 2025 (L14), so "relevant labour legislation" means the Codes, with older Acts as historical.
3. **Free LLM tiers may use submitted content** (L9), so Demo 2 cannot run on such a tier using real documents.
4. **PyMuPDF is AGPL or commercial** ([R-12](../hackathon/30-known-limitations-and-risks.md)), which matters at SaaS stage.
5. **Gold on ivory fails contrast for text,** so the palette is limited to decorative use of gold.
6. **Supabase Free's 500 MB** (L4) may not hold the corpus.
7. **Docker was not found on the machine's Git Bash PATH** (L13).

## 5. Remaining weaknesses

- Facts in the [ledger](../00-canonical-reference.md#10-verification-ledger-checked-2026-10-31) mostly rest on secondary sources. Items L6, L10, L11 and L12 are not confirmed at all.
- Legal content in examples, demos and test samples has not been checked by a lawyer.
- Performance targets and capacity estimates are unmeasured guesses.
- Official website terms and API availability were not reviewed.
- Personas are not based on user research.

## 6. Rename and earlier repositioning review (repositioning withdrawn, see §7)

### Rename to VidhiVerse AI

Product branding, environment examples, Docker names, database defaults, folder references and demo materials now use VidhiVerse AI.

**Old-name references kept on purpose:**

| Reference | Why |
|---|---|
| Government "Nyaya Setu" or "NYAYA-SETU" | Refers to the government service: non-affiliation notice, differentiation rules, ledger, risks, links |
| "Bharatiya Nyaya Sanhita" | Name of the statute |
| Source URLs containing `nyaya-setu`, and `nyayasetu.doj.gov.in` | Links to third-party and official pages |
| "Earlier working name" | History, without restating the old name |

**Outside the documents:** the project folder is still `C:\NyayaSetuAI`. It was not renamed, as that would disturb the open session.

### Repositioning issues found and handled

| # | Issue | Resolution |
|---|---|---|
| 1 | The then-new positioning conflicted with PS-02's "conversational chatbot" wording | Resolved in §7 |
| 2 | The team's description of Nyaya Setu could not be fully confirmed from public sources: language count and RAG | Specifics removed from the documents; L16 and D-14 |
| 3 | The brief's five demos centred on chat | Replaced, and the change is stated in the demo script |
| 4 | Description changed during the pass | Superseded by §7 |
| 5 | Migration numbers would have run out of time order | Renumbered in build order |
| 6 | Guest plan storage disagreed between documents | Guests may run plans, kept with the guest account |
| 7 | An LLM-written procedure would be high risk | Workflows are human-authored; LLM can only match and explain |

### Limits of this review

SQL was parsed, not executed. Endpoint schemas are specified, not implemented. Workflow examples, legal mappings and demo results are unverified until legal review.

## 7. Final positioning review

**Decision:** VidhiVerse AI is a conversational legal information assistant under PS-02. The chatbot is primary; other capabilities support it.

### What changed

| Area | Result |
|---|---|
| Framing | Chatbot first in overview, PRD, specifications, navigation, roadmap, demo and slides |
| Priorities | Workflows, Hindi and Telugu, Legal Aid and the companion moved to P1. Voice, more languages, advanced case management, collaboration and SaaS are P2. |
| Schema | **Unchanged: 34 tables.** Only the migration schedule moved. |
| Endpoints | **Unchanged: 83.** Chat messages gained `document_id`; answers gained `evidence` and `suggested_actions`. |
| Nyaya Setu | Unverified language and architecture details were removed. Positioning is complementary. |
| Organisers | The D-18 question was replaced, and D-22 was added for other confirmations |

### Issues found and handled

| # | Issue | Resolution |
|---|---|---|
| 1 | The strategy lists Telugu and Hindi both under "initial MVP" support and under P1 | Team confirmed: English P0, Hindi and Telugu P1, others P2. Provisional until the official briefing (D-25). |
| 2 | Supporting capabilities had no defined link to chat | Added intent routing, `document_id` and `suggested_actions`, with no schema change |
| 3 | P0 and P1 together are about 91 person-days against 80 for four people | P0 gate before P1, with a capacity table in the roadmap |
| 4 | Week-2 chat safety needs verified helplines, from a table once planned for P1 | `0011` can run early; the Legal Aid **screen** stays P1 |
| 5 | Migration `0013` needs `0012`, even if the companion is skipped | Noted; matter tables are created, the feature is not built |
| 6 | The API referred to a summary format removed from the specification | Format is now stated in the API |
| 7 | Telugu appeared as a required demo step | Moved to an optional segment |

### Roadmap verdict

P0 is achievable in four weeks with about four people, tight with three, and not achievable as written with two or fewer. P1 will be partial at best. These are estimates, and the team size is still unknown (D-03).
