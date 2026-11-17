# Decision Register

Decisions this documentation **could not make alone**. Each has a recommendation, so work can proceed once someone accepts or changes it. "Blocks" says what waits on it.

## Blocking: resolve before or in Week 1

| ID | Decision | Why it matters | Recommendation | Owner | Blocks | Needed by |
|---|---|---|---|---|---|---|
| D-01 | **LLM provider for demo and development** | Quality, latency, Telugu, privacy. Free tiers may train on content (L9), which blocks real-document use. | Shortlist now. Run the [bake-off](../technical/09-rag-architecture.md#9-llm-evaluation) early in Week 2. Develop with whichever key is available using public corpus only. Budget a small amount for a no-train API if Demo 2 can't run locally. | AI engineer | Chat quality, document analysis, Demo 2 | Week 2, day 2 |
| D-03 | **Hackathon rules, date, judging criteria, team size** | Roadmap assumes four weeks and 3–4 people. Rules may limit external APIs or require specific deliverables. | Obtain the rules and update [26](../hackathon/26-hackathon-strategy.md) and [29](../hackathon/29-development-roadmap.md). | Team lead | Scope | Now |
| D-04 | **Qualified legal reviewer** | The brief requires review for high-impact answers. Nothing in this package has had it. | Approach a practising advocate or law faculty member with a bounded task: critical test set and demo answers, roughly 8–12 hours. | Team lead | Legal sign-off, regulatory items | Week 1 |
| D-18 | **Organiser confirmation of PS-02 scope.** PS-02 remains the primary problem statement. Ask: "Does PS-02 permit additional supporting capabilities such as legal document explanation, citation-backed legal research and guided legal workflows, provided that the conversational legal chatbot remains the primary solution?" | If no or limited, the chatbot still stands alone and supporting capabilities are left out of the submission. | Send now and record the answer verbatim. Continue with the chatbot regardless. | Team lead | Supporting capabilities in the submission, not the chatbot | Now |
| D-22 | **Other organiser confirmations.** Rules could affect build and demo choices. | Unknown until asked: whether external LLM and search APIs are allowed; a local-only live demo versus hosted requirement; submission format and code access; whether pre-existing or third-party components are allowed; evaluation criteria, and any language requirement (D-25). | Ask together with D-18. | Team lead | Demo and submission | Now |
| D-05 | **SerpApi account terms** | Whether 2,250 credits expire, or are monthly, changes the usage plan. | Check the account page before the first query. | Tech lead | SerpApi use | Week 1 |
| D-07 | **Corpus scope sign-off** | The brief's "other important laws" is open-ended, and verification is the top schedule risk. | Accept the [Tier plan](../technical/10-legal-data-ingestion.md#2-corpus-plan), including added Acts. Choose demo States: Telangana first. | Data lead with reviewer | Ingestion | Week 1 |
| D-08 | **Source terms and copyright review** | The brief requires following access terms. Terms for India Code, e-SCR and others were not reviewed here. Whether legal PDFs can be committed to Git depends on this. | Manual downloads; keep originals out of Git until reviewed; record findings in `licence_note`. | Data lead with reviewer | Corpus distribution | Week 1 |
| D-13 | **Development hardware and Docker** | Docker was not found on the PATH checked (L13). RAM and GPU unknown. | **Closed 2026-11-17:** moved the database to a single SQLite file (`sqlite-vec` + FTS5), so Docker is no longer needed at all ([19](../infrastructure/19-docker-configuration.md)). RAM/GPU for the embedding model and any local LLM still need recording. | Tech lead | All setup | Before Week 1 |

## Important: resolve during the build

| ID | Decision | Recommendation | Owner | Needed by |
|---|---|---|---|---|
| D-25 | **Multilingual priority (provisional).** English P0; Hindi and Telugu P1; additional languages P2. The seven person-day estimate is not in the committed scope. | Keep as set. **Revisit only when the organisers publish the requirements**, and do not change it before then. | Team lead | On the official hackathon briefing |
| D-17 | **Trademark, domain and brand availability of VidhiVerse AI** (L15, R-23). **Open: do not treat the name as legally available.** | Before the demo: search the Indian trademark registry (relevant classes, including 9, 42 and 45, to be confirmed by counsel), check domains, app stores and social handles, and search for phonetic variants. Before public release: get a professional clearance opinion. Do not buy brand assets or use ™/® until then. Keep a backup name, as a rename is configuration only. | Team lead with counsel | Preliminary before demo; clearance before public release |
| D-06 | **BHASHINI** | Time-box to 1 day in Week 3. Use only with official documentation and accepted terms. LLM translation remains the default. | AI engineer | Week 3 |
| D-09 | **Children's use and age position** | DPDP has specific child-data duties. Interim position: no age gate for general information, no document upload, minimal data. Get a legal opinion before release. | Legal reviewer | Before public release |
| D-10 | **Retention periods** | Accept the [proposed defaults](../technical/17-ai-safety-and-security.md#retention) for MVP; review for launch. | Team lead | Week 3 |
| D-11 | **Legal aid coverage** | Five States for MVP, verified by hand. Expansion later. | Data lead | Week 3 |
| D-12 | **Reranker** | Off by default. Enable only if recall gains justify CPU cost. | AI engineer | Week 2 |
| D-14 | **Statements about Nyaya Setu** (L16) | Default: make no comparison. Say "we focus on". Only verified direct testing, with a recorded date, questions and results, can support any claim about a gap. Optional test. | Presenter | Before the pitch is final |
| D-19 | **Three workflow topics and reviewer sign-off (P1).** Wrong procedure can cost someone a remedy. | Consumer complaint, rental deposit or eviction (Telangana first), unpaid wages. Start review in Week 2. No template ships without recorded legal review. | Legal reviewer with data lead | Week 2, to keep the option open |
| D-20 | **Reminder delivery (optional companion)** | In-app and `.ics` for MVP, needing no email or SMS service. Revisit after user feedback, since people may not reopen the app. | Tech lead | Week 3 |
| D-21 | **Matter data protection (if companion or documents are built)** | Notes and documents are sensitive and not privileged. Show a notice; never send notes to an LLM without explicit action; use synthetic data locally; add application-level encryption and take legal advice before release. | Tech lead with reviewer | Notice in Week 4; rest before public release |
| D-15 | **User validation** | Five short sessions with non-lawyers, in Week 3 or 4. | Team lead | Week 3 |
| D-16 | **Repository visibility and licence** | Private until the name, source terms and PyMuPDF AGPL position are understood. Choose a licence before opening. | Team lead | Week 1 |

## Closed by the team

| ID | Decision | Outcome |
|---|---|---|
| D-02 | Replace the earlier working name | **Closed:** VidhiVerse AI is the working product name. Availability remains open under D-17. |
| D-23 | Final product positioning | **Closed:** conversational legal information assistant under PS-02, chatbot primary, other capabilities supporting. The earlier Legal Intelligence Platform positioning is withdrawn. |
| D-24 | Hackathon priorities | **Closed:** P0, P1 and P2 as listed in the [canonical reference](../00-canonical-reference.md#3-feature-ids). |

## Decisions already made in this package

These can be changed through normal review, but no one needs to act unless they disagree.

| Decision | Choice | Where |
|---|---|---|
| Generate in English, then translate | Accepted pending evaluation | [15](../technical/15-multilingual-architecture.md) |
| Validated text only is streamed | Accepted | [12](../technical/12-api-specification.md) |
| Guest access with real user row | Accepted | [14](../technical/14-backend-architecture.md) |
| `ai-engine/` moved to `backend/app/ai/` | Accepted | [14](../technical/14-backend-architecture.md) |
| Eighteen tables and forty-six endpoints added | Accepted | [11](../technical/11-database-schema.md), [12](../technical/12-api-specification.md) |
| SerpApi admin-only; chat fallback off | Accepted | [16](../technical/16-serpapi-integration.md) |
| Backend and frontend native; database is a SQLite file (superseded: was "only data in Docker") | Accepted | [19](../infrastructure/19-docker-configuration.md) |
| Manual ingestion from official sites | Accepted | [10](../technical/10-legal-data-ingestion.md) |
| Existing schema and endpoints kept; P1 parts are built only if those features are | Accepted | [11](../technical/11-database-schema.md), [12](../technical/12-api-specification.md) |
| Architecture is multilingual-ready from Week 1 | Set by the team | [15](../technical/15-multilingual-architecture.md) |
| Workflows are human-authored; LLM cannot add steps | Accepted | [07](../product/07-feature-specifications.md) |
| Government services linked, not recreated or integrated | Accepted | [07](../product/07-feature-specifications.md) |
| Voice moved to P2 | Set by the team | [15](../technical/15-multilingual-architecture.md) |
