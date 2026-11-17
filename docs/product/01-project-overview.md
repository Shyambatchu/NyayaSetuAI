# 01 – Project Overview

| | |
|---|---|
| Product | VidhiVerse AI (working name; availability not verified, see §6) |
| Category | AI-powered conversational legal information assistant for India. |
| Tagline | Understand Law. Access Justice. |
| Hackathon | AI for Lawyers Hackathon 2026 |
| Problem statement | **PS-02 – Access to Justice: Legal Information Chatbot** |
| Goal | Hackathon MVP that can grow into a SaaS product |
| Constraint | Runs entirely on a local machine in Phase 1, zero-cost first, 2,250 SerpApi credits |
| Status | Documentation only. No application code and no cloud resources exist. |

## 1. What we are building

VidhiVerse AI is an AI-powered conversational legal assistant that helps Indian citizens understand their legal rights and responsibilities, simplify legal documents, discover relevant laws and judgments, and identify appropriate next steps through reliable, source-backed explanations.

**The conversational legal chatbot is the product and the primary hackathon deliverable.** Everything else supports and strengthens the conversation. VidhiVerse AI is not a document-management system, research portal or case-management platform.

**Vision:** make Indian legal knowledge accessible, understandable and approachable for every citizen through AI.

## 2. What makes the chatbot different

| Supporting capability | What it adds to the conversation |
|---|---|
| A. Intelligent Legal Conversation | Follow-ups, plain explanations, provisions and judgments, verified citations and official links |
| B. AI Legal Document Understanding | Ask about your own notice or agreement; exact quotations and page references support every finding |
| C. Citation-Backed Legal Research | How provisions relate to your question, original sources, current and historical comparison |
| D. Guided Legal Assistance | Your situation is matched to legally reviewed workflows; the AI cannot invent a procedure |
| E. Legal Aid Navigation | Free legal aid, Legal Services Authorities, verified contacts, links to NALSA and Tele-Law |
| F. Personal Legal Matter Companion (optional) | Basic document organisation, timelines, user-confirmed reminders |

**Foundation:** the system would rather say "I could not verify this" than invent law or document content, and it knows *when* a law applied (BNS replaced IPC on 1 July 2024 **[VERIFIED: L7]**).

**Relationship with government services:** the Department of Justice operates Nyaya Setu (L1). Our position is complementary: VidhiVerse AI does not replace it, and we link to government services where appropriate. Our focus is the depth of document explanations, evidence-linked findings, legal research and guided assistance.

## 3. Scope at a glance

| Priority | Capability | Feature ID | Spec |
|---|---|---|---|
| **P0** | Conversational legal chatbot (**primary product**) | F-CHAT | [07 §1](07-feature-specifications.md) |
| **P0** | Official legal knowledge base; RAG; citation validation | F-KB, F-CITE | [09](../technical/09-rag-architecture.md), [10](../technical/10-legal-data-ingestion.md) |
| **P0** | Legal document explainer (supporting) | F-DOC | [07 §2](07-feature-specifications.md) |
| **P0** | Citation-backed legal research (supporting) | F-RES | [07 §3](07-feature-specifications.md) |
| **P0** | AI safety and legal disclaimers | F-SAFE | [17](../technical/17-ai-safety-and-security.md) |
| P1 | Three legally reviewed guided workflows | F-PLAN | [07 §4](07-feature-specifications.md) |
| P1 | Hindi and Telugu, subject to time, API availability and language-quality validation; English is complete in P0 | F-LANG | [15](../technical/15-multilingual-architecture.md) |
| P1 | Legal Aid Navigator | F-AID | [07 §5](07-feature-specifications.md) |
| P1 | Basic case companion (optional, time-boxed) | F-CASE | [07 §6](07-feature-specifications.md) |
| P2 | Voice, more languages, advanced case management, lawyer collaboration, SaaS subscriptions, institutional integrations | See [canonical reference](../00-canonical-reference.md#3-feature-ids) | [25](../infrastructure/25-saas-scalability.md) |

## 4. Technology summary

| Layer | Choice |
|---|---|
| Frontend | React, TypeScript, Vite, Material UI, Redux Toolkit, RTK Query, PDF.js viewer |
| Backend | Python 3.12, FastAPI |
| Data | SQLite (single file), `sqlite-vec`, FTS5 — no server, no Docker |
| Embeddings | `intfloat/multilingual-e5-small` (check pending, L11) |
| LLM | Provider interface; chosen by evaluation ([D-01](../review/decision-register.md)) |
| Documents | PyMuPDF, Tesseract OCR |
| Search | SerpApi, admin discovery only |

## 5. Hackathon MVP versus SaaS

| Hackathon MVP | Later SaaS |
|---|---|
| Local machine only | Managed hosting ([24](../infrastructure/24-deployment-guide-future.md)) |
| Chatbot with documents and research | Deeper analysis across documents, a citator |
| Reviewed workflows and languages, if time permits | Wider coverage |
| Basic companion, optional | Advanced case management and lawyer collaboration |
| Links to government services | Integration only where officially available |

Essential public legal information and safety assistance stay free in every future plan.

## 6. Branding and affiliation

- VidhiVerse AI is independently developed and is not affiliated with the Government of India.
- We claim no endorsement or partnership, and do not claim to replace lawyers or government legal services.
- The name is configuration, so a rename needs no architecture change.

**VidhiVerse AI is not confirmed as legally available.** A web search found no exact match, which is not clearance (L15). **Open decision:** trademark, domain and brand-availability verification ([D-17](../review/decision-register.md)).

## 7. Reading order

Product: [PRD](03-product-requirements-document.md). Engineers: [System architecture](../technical/08-system-architecture.md), then [Local setup](../infrastructure/18-local-development-setup.md). Presenters: [Hackathon strategy](../hackathon/26-hackathon-strategy.md).
