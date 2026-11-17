# 26 – Hackathon Strategy

## 1. Core message

> **PS-02 asks for a conversational chatbot that accurately answers legal questions. VidhiVerse AI is that chatbot, with sources you can check, documents you can ask about, research behind each answer and clear next steps.**

The chatbot comes first in the build, the demo and the pitch. The audience is "AI for Lawyers", so legal credibility beats feature count.

## 2. Priorities

| Priority | Item | Why |
|---|---|---|
| **P0** | Conversational legal chatbot | PS-02's stated outcome |
| **P0** | Knowledge base, RAG, citation validation | Accuracy |
| **P0** | Legal document explainer | Main differentiating depth |
| **P0** | Citation-backed legal research | Strengthens each answer; speaks to lawyers |
| **P0** | Safety and disclaimers | Non-negotiable |
| P1 | Three reviewed workflows | Next steps, if reviewed in time |
| P1 | Hindi and Telugu | Access, subject to time, API availability and language-quality validation; provisional (D-25) |
| P1 | Legal Aid Navigator | Strong impact at modest cost |
| P1 | Basic case companion | Optional and time-boxed |
| P2 | Voice, more languages, advanced case management, collaboration, SaaS | Future roadmap |

## 3. PS-02 fit

We are not extending PS-02 into a broader platform. The question for the organisers ([D-18](../review/decision-register.md)) is:

> "Does PS-02 permit additional supporting capabilities such as legal document explanation, citation-backed legal research and guided legal workflows, provided that the conversational legal chatbot remains the primary solution?"

**If the answer is no or limited:** the chatbot, knowledge base, RAG, validation and safety still stand on their own. Supporting capabilities can be removed from the submission without architecture changes.

## 4. Likely judging themes **[ASSUMPTION]**

Replace this table with the official criteria when available ([D-03](../review/decision-register.md)).

| Theme | Our evidence |
|---|---|
| Problem fit | A responsive chatbot on citizens' rights and responsibilities |
| Accuracy | Citation validator, evidence checks, measured results |
| Innovation | Evidence-linked document answers, date-aware law, reviewed workflows |
| Usability | Mobile, plain language, no sign-up to chat |
| Responsible AI | Five safety layers, privacy controls, human review |
| Feasibility | Runs locally, clear future path |

## 5. Positioning alongside government services

Respectful and complementary. Truthful answer:

- "VidhiVerse AI is independently developed and is not affiliated with the Government of India. The Department of Justice operates Nyaya Setu, and we do not replace it. We link to government services such as NALSA and Tele-Law where appropriate."
- "Our focus is the depth of document explanations, evidence-linked findings, legal research and guided assistance."
- **Never** claim that Nyaya Setu lacks a feature without verified direct testing, and never repeat unverified claims about its language count, RAG architecture or capabilities ([D-14](../review/decision-register.md)).
- Say "we focus on", not "they can't".

## 6. Team roles (to fill)

| Role | Owns | Person |
|---|---|---|
| Tech lead, backend | API, database, auth, documents | TBD |
| AI engineer | RAG, validation, evidence, evaluation | TBD |
| Data lead | Corpus, amendments, judgment links | TBD |
| Frontend | Chat, evidence viewer, research views | TBD |
| Legal reviewer | Datasets, demo, workflows | TBD |
| Presenter | Pitch, script | TBD |

Team size is unknown. See the [capacity check](29-development-roadmap.md#capacity-check).

## 7. Demo-day risk controls

| Risk | Control |
|---|---|
| Internet failure | Hotspot; recorded video; Ollama if viable |
| LLM rate limit | Second key or provider; analysed copy of the demo document, disclosed if used |
| Slow analysis | Analyse in advance, plus one small live upload |
| Unexpected question | Let the system decline if it must |
| Machine failure | Second prepared machine with restored snapshot |

No real personal documents. No unrehearsed data changes.

## 8. Honesty rules for the pitch

- No claims of compliance, partnership, government approval, or name availability.
- No target metric presented as a result.
- Coverage limits and legal review status stated openly.
- No claim to replace lawyers, Nyaya Setu or other government services.
- Do not show a P1 feature as finished unless it is.
