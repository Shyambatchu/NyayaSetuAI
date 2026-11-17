# 06 – Non-Functional Requirements

All numbers are targets to test on the local machine. They are not measurements.

## Accuracy and trust

| ID | Requirement | Target |
|---|---|---|
| NFR-Q1 | Citation correctness | 98%+ |
| NFR-Q2 | Supported-answer accuracy | 90%+ |
| NFR-Q3 | Retrieval recall@5 | 90%+ |
| NFR-Q4 | Unsupported claims in critical set | 0 |
| NFR-Q5 | Multilingual comprehension (human rated) | 90%+ |
| NFR-Q6 | Each displayed legal record shows last verified date | 100% |
| NFR-Q7 | Displayed findings whose quote matches extracted text | 100% (enforced) |
| NFR-Q8 | Evidence accuracy: passage supports the finding (human rated) | 98%+ |
| NFR-Q9 | Deadline and penalty extraction recall on the test set | 90%+ |
| NFR-Q10 | Displayed workflows with recorded legal review, if delivered | 100% (enforced) |

## Performance (reference: 16 GB RAM laptop, cloud LLM) **[ASSUMPTION: hardware]**

| ID | Requirement | Target |
|---|---|---|
| NFR-P1 | First status event after send | under 1 s |
| NFR-P2 | Retrieval, excluding LLM (p95) | under 800 ms |
| NFR-P3 | Complete English answer (p95) | under 15 s |
| NFR-P4 | Complete Hindi or Telugu answer (p95), if delivered | under 25 s |
| NFR-P5 | Research list and search (p95) | under 1 s |
| NFR-P6 | 10-page text PDF ready for analysis | under 60 s |
| NFR-P8 | 10-page clause and findings analysis complete | under 3 min |
| NFR-P9 | Citation verification and comparison (p95, no LLM) | under 500 ms |
| NFR-P7 | Landing page on simulated Fast 3G | usable under 5 s |

With a local Ollama model, P3 and P4 will likely be much slower. Record the numbers in the LLM evaluation ([09 §9](../technical/09-rag-architecture.md)).

## Reliability

| ID | Requirement |
|---|---|
| NFR-R1 | LLM failure returns `LLM_UNAVAILABLE` with verified helplines and legal aid links, and never a generated guess |
| NFR-R2 | Database survives process/machine restarts: it is a file in `storage/`, outside any process lifecycle |
| NFR-R3 | Ingestion jobs can resume and are idempotent by checksum |
| NFR-R4 | Failed translation returns the English answer with a clear notice |
| NFR-R5 | SerpApi being down has no effect on any user feature |
| NFR-R6 | Research lookup, comparison, citation verification, workflow checklists, matters and legal aid keep working with no LLM |

## Security and privacy

| ID | Requirement |
|---|---|
| NFR-S1 | Secrets only in environment files; `.env` ignored by Git |
| NFR-S2 | Isolation enforced for every user-owned table; tests prove cross-user access returns 404 |
| NFR-S3 | Logs contain no question text, document text, tokens or keys by default |
| NFR-S4 | Uploaded files stored outside any web-served directory and only served through authorised endpoints |
| NFR-S5 | Rate limits per user and IP (values in [14 §8](../technical/14-backend-architecture.md)) |
| NFR-S6 | Data minimisation: email, password and an optional display name for accounts; guests have none of these |
| NFR-S7 | Before any deployment: HTTPS, encryption at rest and a security review. Phase 1 local storage is not encrypted by the application, so use only synthetic documents for testing unless the machine's disk is encrypted. |
| NFR-S8 | No personal documents go to a provider that may train on them (L9) |
| NFR-S9 | Matter notes are never sent to an external LLM without an explicit user action |
| NFR-S10 | The file endpoint serves only the owner, with `Content-Disposition` and no public URL |

## Accessibility and usability

| ID | Requirement |
|---|---|
| NFR-A1 | Target WCAG 2.2 AA for contrast, keyboard use and labels. Gold `#C6A15B` fails AA as small text on white and ivory, so it is decorative only. |
| NFR-A2 | Responsive from 360 px on all core pages; touch targets at least 44 px |
| NFR-A3 | Telugu and Devanagari render correctly with bundled Noto fonts |
| NFR-A4 | Streaming status text is announced to screen readers |
| NFR-A5 | Plain-language answers, target roughly Class 8 reading level, human-assessed |

## Maintainability and portability

| ID | Requirement |
|---|---|
| NFR-M1 | LLM, embedding, translation, speech, storage providers sit behind interfaces |
| NFR-M2 | Product name and tagline are configuration |
| NFR-M3 | Schema changes only by Alembic migration |
| NFR-M4 | Prompt templates are versioned files; each message stores its `prompt_version` |
| NFR-M5 | Works on Windows, macOS, Linux with native Python and Node; the database is a portable SQLite file, no Docker required |
| NFR-M6 | Backend coverage of 70%+ for services and 100% of citation validator branches |

## Cost

| ID | Requirement |
|---|---|
| NFR-C1 | Phase 1 requires no paid hosting |
| NFR-C2 | SerpApi use cannot exceed bucket budgets without an explicit admin action on the reserve |
| NFR-C3 | LLM usage logged per message by tokens; daily ceiling through `LLM_DAILY_TOKEN_LIMIT` |
