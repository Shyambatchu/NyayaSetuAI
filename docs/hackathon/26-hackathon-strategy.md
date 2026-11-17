# 26 – Hackathon Strategy

**Timeline reality, confirmed 2026-11-17 ([D-03](../review/decision-register.md)):** code freeze is 2026-12-01 09:18 IST,
~13 days away, built solo. This is the real constraint now, tighter than the original
"four weeks, 3–4 people" planning assumption — §1 and §2 below describe the full product
vision; the scope actually in the submission is the compressed list in
[29](29-development-roadmap.md), which is just the chatbot core.

## 1. Core message

> **PS-02 asks for a conversational chatbot that accurately answers legal questions. VidhiVerse AI is that chatbot, with sources you can check.**

The chatbot comes first in the build, the demo and the pitch. The audience is "AI for Lawyers", so legal credibility beats feature count. ("Documents you can ask about, research behind each answer" was the full-team vision for this message — cut from the 13-day solo submission; see §2.)

## 2. Priorities

| Priority | Item | Why | In the 13-day solo submission? |
|---|---|---|---|
| **P0** | Conversational legal chatbot | PS-02's stated outcome | **Yes — this is the whole submission** |
| **P0** | Knowledge base, RAG, citation validation | Accuracy | **Yes** |
| **P0** | Safety and disclaimers | Non-negotiable | **Yes** |
| P0 (full plan) | Legal document explainer | Main differentiating depth | No — cut, see [29](29-development-roadmap.md) |
| P0 (full plan) | Citation-backed legal research | Strengthens each answer; speaks to lawyers | No — cut |
| P1 | Three reviewed workflows | Next steps, if reviewed in time | No — cut (also D-04) |
| P1 | Hindi and Telugu | Access, subject to time, API availability and language-quality validation; provisional (D-25) | No — cut |
| P1 | Legal Aid Navigator | Strong impact at modest cost | No — cut |
| P1 | Basic case companion | Optional and time-boxed | No — cut |
| P2 | Voice, more languages, advanced case management, collaboration, SaaS | Future roadmap | No |

## 3. PS-02 fit

We are not extending PS-02 into a broader platform. The question for the organisers ([D-18](../review/decision-register.md)) is:

> "Does PS-02 permit additional supporting capabilities such as legal document explanation, citation-backed legal research and guided legal workflows, provided that the conversational legal chatbot remains the primary solution?"

**If the answer is no or limited:** the chatbot, knowledge base, RAG, validation and safety still stand on their own. Supporting capabilities can be removed from the submission without architecture changes.

## 4. Actual judging criteria (HackIndia "AI for Lawyers Hackathon", confirmed [D-03](../review/decision-register.md))

| Weight | Theme | Our evidence |
|---:|---|---|
| 40% | Technical Implementation | Hybrid retrieval (semantic + keyword), citation validator that checks every quote against the source text, temporal "law as of" filtering, safety/disclaimer layers |
| 30% | Innovation | Evidence-linked, citation-validated answers rather than an unverified LLM response — the differentiator is trust, not feature count |
| 20% | User Experience | Plain-language answers, streamed responses, mobile-first, no sign-up required to chat |
| 10% | Impact | Free access to legal information for people who can't afford a lawyer for a first question |

Weights are the organisers' and may change at their discretion. Given this split, **Technical Implementation and Innovation together are 70% of the score** — the citation-validated retrieval pipeline is what to protect first if time runs short, ahead of UI polish.

**Submission requirements (from the team page):** a GitHub repository, a **deployed demo link**, and a short project description, submitted from the team page before code freeze. This is not a local-only demo — see the deployment note in [29 §0](29-development-roadmap.md).

## 5. Positioning alongside government services

Respectful and complementary. Truthful answer:

- "VidhiVerse AI is independently developed and is not affiliated with the Government of India. The Department of Justice operates Nyaya Setu, and we do not replace it. We link to government services such as NALSA and Tele-Law where appropriate."
- "Our focus is the depth of document explanations, evidence-linked findings, legal research and guided assistance."
- **Never** claim that Nyaya Setu lacks a feature without verified direct testing, and never repeat unverified claims about its language count, RAG architecture or capabilities ([D-14](../review/decision-register.md)).
- Say "we focus on", not "they can't".

## 6. Team roles

**Closed 2026-11-17 (D-03): solo, no teammates joined.** One person covers backend, AI/retrieval, data/corpus, frontend and presentation — which is exactly why §2's scope is cut to the chatbot core only. If a teammate joins, the first thing to hand off is the cut P0 items (document explainer, research), not a new feature.

| Role | Owns | Person |
|---|---|---|
| Everything | API, database, RAG, corpus, frontend, pitch | Solo developer |

See the [capacity check](29-development-roadmap.md#capacity-check) for why this forces the cut.

## 7. Demo-day risk controls

| Risk | Control |
|---|---|
| Internet failure | Mobile hotspot as backup; have a short screen recording of a working run as fallback |
| LLM rate limit | `LLM_FALLBACK_PROVIDER` (Groq) configured as a second key/provider ([D-01](../review/decision-register.md)) |
| Deployed demo asleep (Render free tier spins down) | Open the demo link and send one warm-up message a few minutes before presenting |
| Unexpected question | Let the system decline if it must — `insufficient_sources`, not a guess |
| Machine/host failure | Keep the GitHub repo and a local copy runnable as a fallback demo |

No real personal documents. No unrehearsed data changes.

No real personal documents. No unrehearsed data changes.

## 8. Honesty rules for the pitch

- No claims of compliance, partnership, government approval, or name availability.
- No target metric presented as a result.
- Coverage limits and legal review status stated openly.
- No claim to replace lawyers, Nyaya Setu or other government services.
- Do not show a P1 feature as finished unless it is.
