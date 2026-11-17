# 30 – Known Limitations and Risks

Likelihood and impact: High, Medium, Low. Scores are judgement calls.

## 1. Risk register

| ID | Risk | L | I | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | **Residual confusion with government legal services (L1):** users may assume a link to the government's Nyaya Setu chatbot or other public services. Reduced by moving to VidhiVerse AI. | Low | High | Non-affiliation notice, no government branding, referrals described as referrals ([D-14](../review/decision-register.md)) | TBD |
| R-02 | A wrong legal answer harms someone | Medium | High | Evidence gate, validation, disclaimers, legal review, feedback loop. Residual risk remains. | TBD |
| R-03 | Corpus verification takes longer than planned | High | High | Start with demo Acts; cut order | Data lead |
| R-04 | No qualified legal reviewer | Medium | High | Appoint now; otherwise disclose | TBD |
| R-05 | Citation validation passes a real but irrelevant source | Medium | High | Human evaluation, optional entailment check | AI engineer |
| R-06 | Stale law: amendments are missed | Medium | High | Verification dates, 180-day flags, update checks. MVP has no continuous monitoring. | Data lead |
| R-07 | Telugu or Hindi translation changes the meaning, including workflow text | Medium | High | Token checks, glossary, native review, original text displayed | TBD |
| R-08 | Free LLM limit changes, or data terms are unsuitable | High | Medium | Provider abstraction, fallback, data policy | AI engineer |
| R-09 | BHASHINI access is delayed or unsuitable | Medium | Low | LLM translation; browser voice | TBD |
| R-10 | Browser voice is unavailable for Telugu | Medium | Low | Text remains primary | Frontend |
| R-11 | Source website terms restrict the intended use | Medium | Medium | Manual acquisition, review ([D-08](../review/decision-register.md)) | TBD |
| R-12 | **PyMuPDF AGPL obligations at SaaS stage** | Medium | Medium | Local MVP use; before SaaS, buy a licence or replace it | Tech lead |
| R-13 | Sensitive data in local demo database or logs | Low | High | Synthetic data, no-content logs | Tech lead |
| R-14 | Uploaded document prompt injection | Medium | Medium | No tools, delimiters, validators, tests | AI engineer |
| R-15 | Parser errors misattribute text to wrong section | Medium | High | Count checks, QA report, human review | Data lead |
| R-16 | Local LLM is too slow or weak in Telugu | High | Medium | Evaluate early; use API for demo | AI engineer |
| R-17 | Demo failure through network or quota | Medium | High | Fallbacks, video, rehearsal | Presenter |
| R-18 | SerpApi credits wasted, or expire | Low | Low | Cache, buckets, no chat use; check expiry (D-05) | Tech lead |
| R-19 | Minors use the service without suitable handling | Medium | Medium | Legal review ([D-09](../review/decision-register.md)) | TBD |
| R-20 | Target metrics are not reached | Medium | Medium | Report honestly; prioritize critical set | AI engineer |
| R-21 | **Closed:** Docker was not available on the development machine (L13) | — | — | Moot: database moved to a single SQLite file, no Docker needed ([19](../infrastructure/19-docker-configuration.md)) | Tech lead |
| R-23 | **VidhiVerse AI may not be available (L15):** a conflicting trademark, domain or existing brand could force another rename. "Vidhi" and "-verse" are common elements. | Medium | Medium | Registry and domain checks with professional input ([D-17](../review/decision-register.md)); name stays in configuration; no brand spending or ™/® use until cleared | TBD |
| R-24 | **Supporting capabilities overshadow the chatbot, or organisers limit them under PS-02** | Medium | High | Chatbot built and demoed first; organiser question ([D-18](../review/decision-register.md)); capabilities removable | Team lead |
| R-25 | **Unverified or disparaging statements about government services** | Medium | High | Differentiation rules; no claims without direct testing ([D-14](../review/decision-register.md)); "we focus on" wording | Presenter |
| R-26 | **Wrong or outdated workflow step** causes a missed remedy | Medium | High | Human review, review date, expiry, sources, escalation prompts ([D-19](../review/decision-register.md)) | Legal reviewer |
| R-27 | **Deadline wrongly extracted, or reminder missed** | Medium | High | Stated dates only; user confirmation; no guarantee; advise checking with the authority | AI engineer |
| R-28 | **Matter data is highly sensitive and not privileged:** exposure or compelled disclosure | Low | High | Isolation, minimal LLM use, notice, deletion ([D-21](../review/decision-register.md)) | Tech lead |
| R-29 | **Scope exceeds capacity:** P0 and P1 together exceed four weeks for a typical team | High | High | P0 gate before P1; [capacity check](29-development-roadmap.md#capacity-check); cut order | Team lead |
| R-30 | Clause segmentation fails on unusual formats, or evidence misses text in poor scans | Medium | Medium | Fallbacks, warnings, dropped findings | AI engineer |
| R-31 | Curated judgment links wrongly describe a case's relation | Medium | High | Human review; `mentions` used when in doubt; no treatment claims | Data lead |
| R-22 | Free hosting limits break the future deployment | Medium | Low | Addressed in [24](../infrastructure/24-deployment-guide-future.md); no action now | TBD |

## 2. Product limitations (state these openly)

1. General information only; not legal advice or representation. It does not replace lawyers or government legal services.
2. The library is incomplete. Absence of a result does not mean no law exists.
3. State laws cover only selected States at first.
4. Case law is a small curated set, and does not track later treatment.
5. Amendments are updated by humans and may lag.
6. English is the committed language. Hindi and Telugu are subject to time, API availability and language-quality validation, and translations can contain errors; the official text prevails.
7. Voice is not in the MVP.
8. OCR can misread documents, especially in poor scans or Indic scripts.
9. Transitional law is complex, and answers crossing old and new law are necessarily cautious.
10. Accuracy targets are targets until measured.
11. Legal review scope will be stated once known.
12. Local Phase 1 is not a hardened system; do not use real sensitive documents.
13. Evidence shows where a finding came from, not that its interpretation is right.
14. Workflows, if delivered, cover only a few situations and may not match individual circumstances.
15. Reminders, if delivered, reflect dates users confirm, and do not guarantee any deadline is right.
16. Comparison shows wording differences, not legal effect.
17. Links to government services are not integrations, and those services may change.

## 3. Assumptions to confirm

| # | Assumption | Confirmed by |
|---|---|---|
| A1 | Team capacity supports four weeks at this scope | Roadmap review |
| A2 | Hackathon permits external APIs and a local demo | Rules |
| A3 | Corpus size about 10,000–20,000 chunks | Week 1 measurement |
| A4 | e5-small handles Telugu retrieval sufficiently | Week 2 recall test |
| A5 | Official files can be obtained manually in usable quality | Week 1 |
| A6 | 16 GB machine is sufficient | Week 1 |
| A7 | Each SerpApi engine consumes one credit | Test queries |
| A8 | The official concordance tables exist in usable form | Week 2 research |
| A9 | PS-02 permits supporting capabilities | D-18 answer |
| A10 | A legal reviewer can review three workflows within the schedule, if pursued | Week 2 |
| A11 | Clause segmentation works on common Indian agreement formats | Week 1 test set |
