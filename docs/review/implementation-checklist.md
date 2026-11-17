# Implementation Checklist

Work through the gates in order. Do not begin cloud deployment in any of them. **The conversational chatbot is the primary deliverable, and P1 starts only after the P0 gate.**

## Gate 0 – Before coding

- [ ] Get hackathon rules, date, judging criteria, team list (D-03)
- [ ] Ask organisers the PS-02 supporting-capabilities question, and the other confirmations (D-18, D-22)
- [ ] Re-check the [capacity table](../hackathon/29-development-roadmap.md#capacity-check) against the real team
- [x] Docker/native-PostgreSQL question closed: database is a SQLite file, no Docker needed (D-13); still record RAM and GPU
- [ ] Appoint legal reviewer (D-04)
- [ ] Check SerpApi credit terms (D-05)
- [ ] Sign off corpus tiers, judgments, demo States (D-07)
- [ ] Start source terms review (D-08)
- [ ] Shortlist LLM candidates and read data terms (D-01)
- [ ] Decide repository visibility and licence (D-16)
- [ ] Run preliminary trademark, domain and brand-availability search for VidhiVerse AI (D-17)
- [ ] Confirm model card facts (L11)

## Gate 1 – Foundation (Week 1)

- [ ] Initialize Git, `.gitignore`, `.gitattributes`, pre-commit, secret scan
- [ ] Add `.env.example` files; run `database/schema/apply_schema.py`; data survives restart (it's a file in `storage/`)
- [ ] Scaffold FastAPI and React, with config-driven brand, i18n files and `ENABLED_LANGUAGES=en`
- [ ] Execute migrations `0001`–`0007` from empty; test backup and restore
- [ ] Guest, register with guest conversion, login, refresh, logout; isolation harness
- [ ] Manifest, parser, QA report, embeddings; first Acts verified; measure database size

**Exit:** M1.

## Gate 2 – Conversational chatbot (Week 2)

- [ ] LLM providers behind interface; bake-off; `LLM_DATA_POLICY` enforced (D-01)
- [ ] Remaining Tier 1 Acts verified; IPC, CrPC, Evidence Act loaded with validity dates
- [ ] Hybrid retrieval, temporal and jurisdiction filters; boundary tests
- [ ] Understanding step, context-aware follow-ups, clarification
- [ ] Evidence gate, generator, citation validator with all branches tested, section-not-found
- [ ] Session and message endpoints with SSE; chat UI, citation cards, feedback
- [ ] Input and output safety, urgency lists, disclaimers
- [ ] SerpApi service, budget, cache, logs (`0008`); 3 real test queries; reranker decision (D-12)

**Exit:** M2. Demos 1 and 5 in English; first recall@5 recorded.

## Gate 3 – P0 supporting capabilities (Week 3)

- [ ] Migrations `0009`, `0010`
- [ ] Document attach in chat, consent, private storage, deletion
- [ ] Extraction with positions; clause segmentation; synthetic document set
- [ ] Findings with quotation and page; evidence check drops unmatched findings
- [ ] PDF.js viewer with jump and highlight; document Q&A separating document from law
- [ ] No unsupported "illegal" or "unenforceable" output; hidden-instruction PDF test
- [ ] Amendments for demo Acts; curated judgments and reviewed links; official concordance source
- [ ] Search, compare with deterministic diff, related, citation verification
- [ ] Chat `suggested_actions` reach documents and research
- [ ] Isolation, deletion, retention worker (D-10)

**Exit, the P0 gate:** M3. Demos 1, 2, 3 and 5 pass.

## Gate 4 – Quality (Week 4, never skipped)

- [ ] Dataset complete for delivered features, with verified expected results
- [ ] Full evaluation stored with versions and sample sizes
- [ ] Legal reviewer sign-off, or disclosed limitation
- [ ] All deterministic tests pass; red-team set passes
- [ ] `pip-audit`, `npm audit`, secret scan
- [ ] axe, keyboard, screen reader, 360/768/1280 px, real Android phone
- [ ] Performance measured; SerpApi estimated versus actual reconciled
- [ ] User sessions completed (D-15)

## Gate 5 – P1, only if the P0 gate passed on time

Stop at any time. An unfinished P1 feature is left out of the demo.

- [ ] Three workflows (D-19): migrations `0012`, `0013`; rule engine, chat matching, checklists; **legal sign-off recorded**
- [ ] Hindi and Telugu, subject to time, API availability and language-quality validation: glossary, protected-token translation, UI strings, safety keywords, native review, per-language evaluation; enable only if they pass (D-25)
- [ ] Legal Aid Navigator: `0011`; five States (D-11); helplines (L8, L10); NALSA and Tele-Law links verified
- [ ] Basic companion (time-boxed): matters, documents, timeline, user-confirmed reminders, privilege notice (D-20, D-21)
- [ ] Privacy Centre, export, Admin Dashboard and Source Management basics

## Gate 6 – Demo readiness

- [ ] Chatbot shown first; each demo result checked against official text or the document
- [ ] VidhiVerse AI name, tagline, category and non-affiliation notice visible; preliminary availability result known (D-17)
- [ ] No unverified statements about Nyaya Setu; any comparison backed by a recorded test (D-14)
- [ ] Organiser answers reflected in the pitch (D-18, D-22); multilingual priority revisited if the briefing requires it (D-25)
- [ ] Corpus snapshot restored on a second machine
- [ ] Fallback LLM tested; hotspot ready; backup video recorded
- [ ] Slides use measured figures only
- [ ] Three consecutive clean rehearsals; no secrets visible

## Gate 7 – Before any public release

- [ ] Professional trademark, domain and brand clearance for VidhiVerse AI (D-17)
- [ ] Legal assessment: DPDP, children, IT Act, Advocates Act, source rights, liability, workflow risk (D-08, D-09)
- [ ] Application-level protection for notes and documents; privilege position reviewed (D-21)
- [ ] PyMuPDF licence decision (R-12)
- [ ] Workflow review and expiry process staffed
- [ ] Re-verify all free-tier limits; write the deployment decision
- [ ] Execute [future deployment gates](../infrastructure/24-deployment-guide-future.md#7-go-live-gates)
