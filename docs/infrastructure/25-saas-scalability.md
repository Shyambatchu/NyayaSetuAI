# 25 – SaaS Scalability

Future-phase. Nothing here is in the hackathon MVP. All content **[PROPOSED]**.

## 1. Plans

| Plan | Audience | Possible features | Principle |
|---|---|---|---|
| Citizen Free | Public | Chat, research, legal aid, safety, documents within fair limits | **Essential legal information and safety never move behind payment** |
| Citizen Plus | Frequent users | More documents and matters, longer retention, email or SMS reminders | Convenience only |
| Professional Research | Lawyers, students, NGOs | Citator, exports, deep research, client matters | Needs a much larger corpus and legal review |
| Institutional | Legal aid clinics, universities, NGOs | Team spaces, analytics without personal content | |
| Enterprise | Larger bodies | SSO, private deployment | Later |

Prices and willingness to pay are unknown. Validate before building F-BILL.

## 2. Unit economics to measure

| Driver | Measure |
|---|---|
| LLM tokens per answer | From `chat_messages` |
| Translation overhead | English versus Telugu cost |
| Storage per active user | Files and chunks |
| Support and review | Hours for legal review per Act |

A free public product needs grants, partnerships or paid tiers to cover LLM costs. Use the measured data to create a sustainability model. Do not assume public partnership.

## 3. Scaling stages

| Stage | Load (illustrative) | Changes |
|---|---|---|
| Local MVP | Single user | Current design |
| Pilot | 100 people a day | Hosted, paid small instance, separate worker |
| Growth | 10,000 people a day | Multiple API instances, shared rate limiter, queue, read replica, answer cache |
| Large | Millions of chunks | Partitioned search or a dedicated vector store behind the retrieval interface |

Trigger each change only with metrics.

## 4. Technical readiness built in now

| Decision today | Benefit later |
|---|---|
| Stateless API, JWT | Horizontal scale |
| `SKIP LOCKED` jobs | Separate workers |
| Provider interfaces | LLM, storage, language swaps |
| `user_id` everywhere | RLS, organization extension |
| Versioned corpus | Reproducible answers, audit |
| Configured brand | Rename, white label |

## 5. Likely additions

| Addition | When |
|---|---|
| `organizations`, `memberships` | Institutional |
| `subscriptions`, `usage_counters` | F-BILL |
| Answer cache for common questions by language, law date, corpus version | LLM cost becomes significant |
| Dedicated legal content team tooling | Corpus beyond a few hundred Acts |
| Citator and subsequent treatment | Professional plan |
| Advanced case management (F-CASE-X), lawyer collaboration (F-COLLAB) | After validation |
| Official service integrations | Only with official documentation and permission |
| WhatsApp, IVR | Rural reach, subject to terms |
| Official hosting region in India | Depending on data assessment |

## 6. Organizational needs

Scaling is limited more by trustworthy content than by compute. A SaaS product needs a legal editor, an update process for new notifications, an incident process for incorrect information, and compliance ownership.

## 7. Institutional integrations (F-INST)

Possible partners include law schools, NGOs and legal aid clinics. Any partnership with a public body needs a formal agreement. Do not imply one exists.
