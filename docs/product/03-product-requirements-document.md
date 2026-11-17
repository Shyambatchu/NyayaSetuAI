# 03 – Product Requirements Document

Names and IDs come from the [canonical reference](../00-canonical-reference.md). Behaviour is in [07](07-feature-specifications.md).

## 1. Positioning

> VidhiVerse AI is an AI-powered conversational legal assistant that helps Indian citizens understand their legal rights and responsibilities, simplify legal documents, discover relevant laws and judgments, and identify appropriate next steps through reliable, source-backed explanations.

**Category:** AI-powered conversational legal information assistant for India. **Problem statement:** PS-02 – Access to Justice: Legal Information Chatbot.

### Product rules

1. The conversational legal assistant is the central experience and primary hackathon deliverable.
2. VidhiVerse AI is not a separate or broader Legal Intelligence Platform, and not a replacement for the chatbot through a document-management system, research portal or case-management platform.
3. All other capabilities support and strengthen the chatbot, and each must be reachable from a conversation.

### Differentiation rules

1. VidhiVerse AI does not replace Nyaya Setu; the positioning is respectful and complementary.
2. Do not claim Nyaya Setu lacks a feature without verified direct testing.
3. Do not use unverified claims about its language count, RAG architecture or capabilities.
4. Differentiate on the depth of document explanations, evidence-linked findings, legal research and guided assistance.
5. Link to existing government services where appropriate.
6. State clearly that VidhiVerse AI is independently developed and is not affiliated with the Government of India.

## 2. Goals and non-goals

| # | Goal | Measure (targets) |
|---|---|---|
| G1 | A responsive chatbot that accurately answers legal questions | Supported-answer accuracy 90%+; follow-ups resolve |
| G2 | Source-backed answers | Citation correctness 98%+; recall@5 90%+ |
| G3 | Refuse to invent law or document content | 0 unsupported claims in the critical set |
| G4 | Simplify documents within the conversation | 100% of displayed findings have a matching quote and page |
| G5 | Lead to a next step | Answers offer next steps; workflows and legal aid when delivered |
| G6 | Local and low cost | Full stack on one laptop |

**Non-goals (Phase 1):** legal representation, outcome prediction, drafting filings, lawyer marketplace, voice, broad language coverage, government API integrations, cloud deployment, billing and compliance claims.

## 3. Requirements by priority

### P0 – Must deliver

| # | Capability | Feature | Acceptance |
|---|---|---|---|
| 1 | **Conversational legal chatbot** | F-CHAT | Natural-language questions; context-aware follow-ups; simple explanations; State clarification; Demo 1 passes |
| 2 | Official Indian legal knowledge base | F-KB | Priority Acts and curated judgments searchable, with metadata |
| 3 | RAG-based retrieval and answer generation | F-KB | Hybrid retrieval with date and jurisdiction filters |
| 4 | Citation validation | F-CITE | No citation lacks an indexed record; statutes and cases are never fabricated; Demo 5 passes |
| 5 | Legal document explainer | F-DOC | Upload, clause explanation, obligations, deadlines, penalties, terms, questions, quotation and page for each finding, deletion; no unsupported "illegal" or "unenforceable" claim; Demo 2 passes |
| 6 | Citation-backed legal research | F-RES | Relevant Acts, sections, amendments, judgments; relation to the question; official sources; current and historical comparison; Demo 3 passes |
| 7 | AI safety and legal disclaimers | F-SAFE | Five layers; injection tests pass; disclaimer on every answer |

**Enabling P0 work** (not optional): the complete English experience, multilingual-ready architecture, guest access and accounts, user-level isolation (F-AUTH), and document security and deletion.

### P1 – Deliver if time permits

| # | Capability | Feature | Acceptance |
|---|---|---|---|
| 1 | Three legally reviewed guided workflows | F-PLAN | Matched through conversation; no unreviewed step shown; AI cannot invent procedures; Demo 4 passes |
| 2 | Hindi and Telugu, subject to time, API availability and language-quality validation (provisional, D-25) | F-LANG | Protected terms survive; native review; per-language evaluation |
| 3 | Legal Aid Navigator | F-AID | Only `verified` records; links to NALSA and Tele-Law |
| 4 | Basic case companion (optional, time-boxed; must not delay the chatbot) | F-CASE | Documents, timeline, user-confirmed reminders; other users get 404 |

Also P1: F-HIST, F-PRIV interfaces, F-SERP and F-ADMIN basics. **Privacy controls themselves are not optional:** isolation, deletion, and retention stay required.

### P2 – Future roadmap

Voice input and output (F-VOICE), additional Indian languages (F-LANG-X), advanced case management (F-CASE-X), lawyer collaboration (F-COLLAB), SaaS subscriptions (F-BILL), institutional integrations (F-INST), advanced document intelligence (F-DOC-X).

**Do not remove critical legal accuracy, evidence validation, security or privacy requirements to meet the schedule.**

## 4. Key product decisions

| Decision | Choice | Reason |
|---|---|---|
| Entry point | Chat is the landing action and default page | PS-02 and product rule 1 |
| Documents and research | Started from, and return to, the conversation; detail views are supporting screens | Support the chatbot rather than compete with it |
| Workflows | Human-authored and reviewed; LLM matches and explains only | A wrong procedure can cost someone a remedy |
| Findings | No matching quote means no display | Evidence is the promise |
| Deadlines | Become reminders only after user confirmation | Extraction can be wrong |
| Comparison | Deterministic diff | Models must not invent differences |
| Streaming | Status first, text after validation | Accuracy outranks first-token speed |
| Sign-up | Not needed for chat or research; needed for documents and matters | Barrier removal, with consent for sensitive data |
| Under-18 users | General information only; no upload or matters, pending review | [D-09](../review/decision-register.md) |

## 5. Answer format (user-visible)

Each `answered` response has: short answer; what the law says, with citations; responsibilities or limits; possible next steps; sources with official links and verification dates; disclaimer and uncertainty notes; and suggested actions such as upload a document, compare a provision, start a reviewed workflow, or find legal aid.

## 6. Dependencies

| Dependency | Needed for | Risk if unavailable | Fallback |
|---|---|---|---|
| LLM provider (suitable data terms) | F-CHAT, F-DOC, F-RES | Critical | Local model; synthetic documents only |
| Official Acts, Gazette notifications | F-KB, F-RES | Critical | Manual downloads, smaller scope |
| Curated judgments and link review | F-RES | High | Fewer, well-verified links |
| Official concordance source | Comparison | High | Limit to verified pairs |
| Qualified legal reviewer | Critical sets; F-PLAN | High | Disclose no review; workflows do not ship |
| PDF.js | Evidence viewer | Medium | Quote and page text only |
| ~~Docker~~ | ~~Database~~ | n/a | Removed: database is a SQLite file, no longer a Docker dependency |
| SerpApi | Discovery | Low | Manual |
| BHASHINI | Translation | Low | LLM translation |

## 7. Release criteria for the hackathon MVP

- All P0 acceptance criteria met, with the chatbot demonstrated first.
- Evaluation results reported as measured.
- Any P1 feature shown has met its own review requirements.
- No secrets in the repository; no cloud resources created.
