# 04 – User Personas and Journeys

> **[ASSUMPTION]** Illustrative planning personas, not research findings. Validate with real users ([D-15](../review/decision-register.md)).

## 1. Personas

| Persona | Situation | Language and device | Starts in chat, then uses | Design implication |
|---|---|---|---|---|
| **Rohit**, tenant, Lucknow | Rental agreement and a deposit dispute | Hindi, Romanized typing, phone | F-DOC, F-CASE | Evidence viewer works on mobile |
| **Lakshmi**, garment worker, Hyderabad | Wages delayed; cannot afford a lawyer | Telugu if delivered, low-cost Android | F-PLAN, F-AID | Light pages |
| **Neha**, law student, Delhi | Mapping IPC to BNS and finding judgments | English, laptop | F-RES | Comparison, citations |
| **Imran**, shop owner, Pune | Customer demands a refund; supplier contract | English and Hindi | F-DOC, F-PLAN | Duties as well as rights |
| **Meera**, paralegal at an NGO | Helps others prepare papers | English, Telugu | F-RES, F-PLAN | Print-friendly checklists |
| **Asha**, homemaker, rural Andhra Pradesh | Experiencing domestic violence; shared phone | Telugu | Safety, F-AID | Helplines first; quick exit; no matter required |
| **Admin**, project team | Maintains corpus and credits | English | F-ADMIN | Verification workflow |

All journeys **start in the chatbot**. Other screens open from it, and return to it. Journeys using P1 features apply only if those are delivered.

## 1a. Journey: conversation (primary)

```mermaid
flowchart TD
    A[Opens the site: chat is ready, no sign-up] --> B[Asks a legal question in plain words]
    B --> C{State, date or facts needed?}
    C -- Yes --> D[Chatbot asks]
    D --> E
    C -- No --> E[Source-backed answer with citations and official links]
    E --> F[Follow-up question in context]
    F --> E
    E --> G{Suggested action}
    G --> H[Attach a document]
    G --> I[Compare or open a source]
    G --> J[Reviewed workflow, if available]
    G --> K[Legal aid, if available]
```

## 2. Journey: document understanding (Rohit)

```mermaid
sequenceDiagram
    actor R as Rohit
    participant UI as Document Explainer
    participant API as Backend
    participant W as Worker
    R->>UI: In chat, says the landlord sent an agreement
    UI-->>R: Offers to read it, after registration and consent
    R->>UI: Attaches rental agreement
    UI->>API: POST /documents/upload
    API->>W: Queue document_process
    UI->>API: GET /documents/{id} until ready
    R->>UI: Explain this document
    UI->>API: POST /documents/{id}/analyze
    UI->>API: GET /documents/{id}/clauses
    UI->>API: GET /documents/{id}/findings
    R->>UI: Taps a deposit finding
    UI->>API: GET /documents/{id}/file
    UI-->>R: Page opens with the passage highlighted
    R->>UI: Can they keep my deposit?
    UI->>API: POST /documents/{id}/ask
    API-->>UI: Your document says, with evidence. The law says, with citations.
    R->>UI: Deletes document
```

## 3. Journey: research (Neha)

```mermaid
flowchart LR
    A[Asks the chatbot about cheating under IPC 420] --> B[Section page with status: repealed, applies to earlier events]
    B --> C[Compare with BNS successor]
    C --> D[Word-level differences and mapping source]
    D --> E[Linked judgments with relation]
    E --> F[Paste a citation from her notes]
    F --> G{Verify}
    G -- verified --> H[Official link]
    G -- not_found --> I[Not in our library: check before relying on it]
    H --> J[Explain in plain language with citations]
```

## 4. Journey: guided assistance (Lakshmi, P1)

```mermaid
journey
    title Lakshmi prepares for an unpaid wages complaint
    section Describe
      Explains the problem to the chatbot: 4: Lakshmi
      Accepts the reviewed unpaid wages workflow: 5: Lakshmi
    section Answer
      Gives State, employer type and dates: 4: Lakshmi
    section Prepare
      Sees documents to collect: 5: Lakshmi
      Sees relevant authority and official links: 4: Lakshmi
      Sees possible next steps: 5: Lakshmi
    section Get help
      Opens Legal Aid Navigator: 5: Lakshmi
```

## 5. Journey: matter companion (Rohit, optional P1)

```mermaid
flowchart TD
    A[Findings in rental agreement] --> B[Create matter: Deposit dispute]
    B --> C[Attach the agreement]
    A --> D{Promote a deadline finding?}
    D -- Reviews date and confirms --> E[Deadline with reminder]
    D -- Not sure --> F[Stays a finding only]
    B --> G[Add events and private notes]
    E --> H[In-app reminder or calendar file]
    G --> I[Timeline ready to show an advocate or legal aid clinic]
```

## 6. Journey: urgent safety (Asha)

```mermaid
flowchart TD
    A[Message describes violence or immediate danger] --> B[Input safety: urgency = immediate_safety]
    B --> C[answer_status = urgent_referral]
    C --> D[Verified helplines shown first]
    D --> E[Short, calm safety guidance]
    E --> F{User wants more?}
    F -- Yes --> G[Protections, legal aid and official services]
    F -- No --> H[Quick exit and delete controls]
```

The safety path overrides any workflow. Helplines come from verified `legal_aid_resources` records and do not depend on the LLM. If none is verified, the screen says to contact local emergency services and does not invent a number.

## 7. Journey: invented section or citation

```mermaid
flowchart LR
    Q[BNS Section 999] --> L[Exact lookup]
    L --> N{Found?}
    N -- No --> R[Could not find it in the verified library]
    R --> S[Offers topic search and links the Act]
```

## 8. Accessibility commitments

- Everyday language, with each legal term explained once.
- At least 16 px text on mobile; Telugu and Devanagari fonts tested.
- A single visible next action on each screen.
- Quick exit on sensitive flows ([13](../technical/13-frontend-architecture.md)).
