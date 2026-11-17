# 07 – Feature Specifications

Behaviour, implementation approach and edge cases, in priority order. **The chatbot is the product; every other section supports it, and each must be reachable from a conversation.** Schemas are in [12](../technical/12-api-specification.md) and [11](../technical/11-database-schema.md).

## 1. F-CHAT – Conversational legal chatbot (primary product, P0)

The central experience and the primary PS-02 deliverable: natural-language legal questions, context-aware follow-ups, simple explanations of Indian laws, relevant provisions and judgments, verified citations and official links. It uses the RAG pipeline ([09](../technical/09-rag-architecture.md)).

**How capabilities join the conversation:** the understanding step's `intent` routes each message. `document_question` uses an attached `document_id`; `case_law` and `provision_lookup` draw on research data; `workflow_guidance` and `legal_aid` suggest reviewed workflows and verified resources. Answers carry `suggested_actions`, and supporting screens open beside the chat and return to it.

**Status steps:** Understanding your question → Searching official sources → Checking citations → Translating → Done.

**Clarification rules:**

| Topic | Needed | If missing |
|---|---|---|
| Tenancy, land, stamp duty, shops and establishments, State procedures | State | Ask once |
| Criminal matters, limitation, "what law applied" | Approximate date | Ask if the facts suggest a past event |
| Employment | State, kind of employer | General position with a caveat if declined |
| Constitutional rights, general Central law | None | Answer |

At most two clarifying questions a turn. State comes from the session, then preferences, and is never inferred from IP. A non-legal question returns `refused`. "Will I win?" explains the limit and offers legal aid.

## 2. F-DOC – AI Legal Document Understanding (supporting, P0)

Reached by attaching a document in chat, for legal notices, rental agreements, employment contracts and other legal PDFs.

**Pipeline:** consent → validate (real PDF signature, size, pages, not encrypted) → store → extract with PyMuPDF, keeping page numbers and text positions → OCR with Tesseract if pages have too little text → segment clauses → chunk → embed → `ready`. `POST /documents/{id}/analyze` then queues clause explanations and findings.

**Clause-by-clause explanation.** Segmentation uses numbering and headings first, with an LLM fallback for unnumbered text. Each `document_clauses` row keeps the exact original text and page. Explanations are generated per clause, per language.

**Findings** (`finding_type`):

| Type | Example | Extra fields |
|---|---|---|
| `obligation` | Tenant must pay rent by the 5th | `party` |
| `deadline` | 30 days' notice | `due_date` only if the document states a date, otherwise `due_text` |
| `penalty` | Late fee of 2% | `amount_text` |
| `important_term` | Lock-in period | |
| `possible_concern` | One-sided deposit deduction | Explanation and a question to ask |

**Evidence rule (the core of this feature).** Each finding must have a page number and an exact quote. The server checks the quote is a real substring of the extracted text, after normalizing whitespace, and records its character offsets. **A finding without a matching quote is dropped.** The viewer jumps to the page and highlights the passage.

**Document Q&A** retrieves only from that document's chunks, and answers separate "Your document says", with evidence links, from "The law says", with validated citations. If the document does not say, the answer says so.

**Rules:**
- No unsupported claim that a clause is illegal or unenforceable: those labels are blocked in `possible_concern`. Describe the concern and recommend professional review.
- Dates are never inferred or calculated into legal deadlines. `confidence` is `stated` or `inferred_needs_review`.
- Document text is untrusted data and cannot change instructions.
- OCR-derived evidence displays a warning.

**Secure handling:** registered users only, explicit consent, private storage, authorised file endpoint, sensitive-identifier warning, retention limit, and deletion of the file, chunks, clauses and findings. See [17](../technical/17-ai-safety-and-security.md).

**MVP limits:** PDF only; DOCX and images are F-DOC-X. One document at a time.

## 3. F-RES – Citation-Backed Legal Research (supporting, P0)

| Capability | Behaviour | Endpoint |
|---|---|---|
| Search | Number pattern such as `BNS 303` or `Article 21` goes to exact lookup, otherwise hybrid search | `GET /legal/search` |
| Amendments | Structured list with amending instrument, effect, date and notification | `GET /legal/acts/{id}/amendments` |
| Linked authorities | Judgments linked to a provision, and related provisions | `GET /legal/sections/{id}/related` |
| Compare | Two versions of a section, or an old section and its successor, with a word-level diff | `GET /legal/sections/{id}/compare` |
| Citation verification | Paste a citation and get `verified`, `superseded`, `not_found` or `ambiguous`, with the official link | `POST /legal/citations/verify` |
| Plain explanation | Explains selected records with bound citations through the normal validator | `POST /legal/research/explain` |

**Comparison rules:** the diff is computed deterministically, never by the LLM. The relation comes from `section_concordance`. An `equivalent` mapping is shown as "mapped by [source]", and the page warns that similar wording does not guarantee identical legal effect.

**Judgment links:** `provision_case_links` are curated by people for the MVP. Each shows its relation (`interprets`, `applies`, `upholds`, `strikes_down`, `mentions`) and paragraph reference. The page states that later treatment is not tracked.

**Every result** shows source, jurisdiction, relevant dates, status, last verified date and an official link. A coverage notice says the library is incomplete. `not_found` means "not in our library", not "does not exist", except where an Act is fully indexed and its section count verified.

**Filters:** type, jurisdiction, State, status, year, "law as on" date.

## 4. F-PLAN – Guided Legal Assistance (supporting, P1)

Delivered if time permits. The chatbot understands the situation through conversation and offers a match.

**Design decision: workflows are authored and legally reviewed content, not LLM output. The AI must not independently invent legal procedures or unreviewed workflows.** The LLM only helps match a situation to a template and rephrase explanations. It cannot add steps, authorities, deadlines or fees.

**Flow:** describe a situation in chat, or browse → `POST /workflows/match` suggests templates, and the user chooses → answer a few questions (State, dates, facts) → branching produces a personal checklist → tick off items → optionally attach to a matter.

**Template definition (`workflow_templates.definition`):**

```json
{
  "questions": [{"key": "state", "type": "state", "required": true}],
  "steps": [{
    "key": "gather_invoice",
    "kind": "document",
    "label_key": "wf.consumer.invoice",
    "show_if": {"always": true},
    "why": "...",
    "source_refs": [{"section_key": "consumer-protection-act-2019#<verified section>"}]
  }],
  "authorities": [{"resource_key": "...", "show_if": {"state": "TG"}}],
  "escalate_if": [{"condition": "court_notice_received", "message_key": "wf.seek_advocate"}]
}
```

`show_if` uses a small declarative rule format with no executable code.

**MVP templates** ([D-19](../review/decision-register.md)): defective goods consumer complaint; rental deposit or eviction, Telangana first; unpaid wages. All content needs legal sign-off, and only `verified` templates are shown.

**Each output shows:** possible next steps, phrased as options ("You may consider…"); required documents; relevant authorities with verified contacts; official portal links; sources; the date reviewed; and a prompt to see an advocate or legal aid. Limitation periods and fees appear only with a verified source and a warning to confirm them.

**Safety:** if the situation shows `immediate_safety`, safety guidance comes first, and no workflow is offered until the person chooses.

## 5. F-AID – Legal Aid Navigation (supporting, P1)

| Section | Behaviour |
|---|---|
| "Am I eligible?" | Guided checklist from s.12, resulting in "You may be eligible; the authority decides". No income figure unless a verified record for that State exists. |
| Find help | NALSA, State and District Legal Services Authorities by location |
| Official services | Links to NALSA, Tele-Law and other government services, each labelled "Official government service" with its verified URL. **No integration or affiliation is implied.** |
| Helplines | NALSA 15100 once verified (L8); others only after checks (L10) |

**Data rule:** seed records start `unverified`, and public endpoints return only `verified`. A record not re-verified in 180 days reverts to `needs_review`. The MVP covers NALSA and five States ([D-11](../review/decision-register.md)).

## 6. F-CASE – Personal Legal Matter Companion (supporting, P1, optional)

| Capability | MVP | Later |
|---|---|---|
| Matters | Create, rename, close, delete | Sharing with an advocate, with consent |
| Document organisation | Attach and detach own documents | Folders, tags |
| Timeline | User events, plus events from findings | Automatic ordering across documents |
| Deadlines | Add one, or promote a `deadline` finding **after the user confirms it** | Recurring rules |
| Reminders | In-app list through `GET /reminders/due`; `.ics` calendar download | Email, SMS or push ([D-20](../review/decision-register.md)) |
| Notes | Private plain-text notes | Encryption at application level |

Reminder text says "Reminder based on a date you confirmed. Check actual deadlines with the court, authority or your advocate." A missed reminder must not be represented as affecting legal rights; **the product makes no guarantee of deadline accuracy.**

Notes and matter data are never sent to an LLM, unless the user explicitly asks a question about them. Users are told their notes are **not protected by lawyer-client privilege** ([D-21](../review/decision-register.md)).

## 7. F-CITE and F-KB

**Citation cards:** title, type, jurisdiction, status, dates, excerpt in original text, official link. Repealed law on a current question gets a prominent label. Only `verified` material is citable, and reviewer actions go to `audit_logs`. See [09](../technical/09-rag-architecture.md) and [10](../technical/10-legal-data-ingestion.md).

## 8. F-LANG and F-VOICE

English is the complete P0 chatbot experience. Hindi and Telugu are P1, subject to time, API availability and language-quality validation. Additional languages are P2 ([15](../technical/15-multilingual-architecture.md)). Workflow text uses human-reviewed strings, not on-the-fly translation. Voice input and output are P2.

## 9. F-SAFE, F-AUTH, F-PRIV

See [17](../technical/17-ai-safety-and-security.md). Guests can use the chatbot, Research, the Planner and Legal Aid, and a guest's plans last as long as the guest account. Documents and matters need a registered account. The Privacy Centre shows stored data, retention, external providers, export and deletion.

## 10. F-SERP and F-ADMIN

See [16](../technical/16-serpapi-integration.md). Admin Dashboard: corpus by status, stale sources, jobs, credits, negative feedback, LLM tokens. Source Management: `legal_sources`, `source_updates` review, and verification of amendments, judgment links and workflow templates through the source workflow.

## 11. MVP boundary

| In MVP | Deferred |
|---|---|
| PDF with basic OCR, clause explanations, evidence highlights | DOCX, images, multi-document comparison (F-DOC-X) |
| Curated judgments and links | Citator, subsequent treatment |
| Three reviewed workflows, if time permits | Template authoring UI, broad topic coverage |
| Optional basic matter, timeline, user-confirmed reminders | Advanced case management, lawyer collaboration, email, SMS |
| Links to government services | Any API integration, only if officially documented and permitted |
| English committed; Hindi and Telugu if validated | F-LANG-X |
