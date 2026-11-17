# 02 – Problem Statement

## 1. PS-02 is our primary problem statement

**PS-02 – Access to Justice: Legal Information Chatbot**

> Create a chatbot that provides legal information to the public, helping individuals understand their rights and responsibilities. Expected outcome: a responsive, conversational chatbot that accurately answers legal queries.

**Primary objective:** build a responsive conversational chatbot that accurately answers citizens' legal questions and helps them understand their rights and responsibilities.

Supporting capabilities are additions to that chatbot, not a broader scope. We are confirming with the organisers that PS-02 permits them ([D-18](../review/decision-register.md)).

## 2. The problem in practical terms

A person has a legal question, and often a document or deadline behind it. They need to know: *Do I have a right here? What does the law actually say? What does this paper mean? What can I do next?*

| Barrier | How it shows up | How the chatbot responds | Capability |
|---|---|---|---|
| Terminology | "Cognizable", "decree", "indemnify" | Plain-language answers, keeping the original term | A |
| Discovery | People don't know which law applies | Natural-language questions and retrieval | A, C |
| Trust | Blogs and forwarded messages conflict | Verified citations and official links | A, C |
| Change | New criminal laws in 2024 and Labour Codes in 2025 | Date-aware answers, old and current comparison | C |
| Paperwork | A notice or agreement they can't interpret | Ask about the document, with quotes and page numbers | B |
| What next | No idea of procedure | Legally reviewed workflows through conversation | D |
| Cost | Fear of legal fees | Free legal aid and official services | E |
| Language | Legal text is mainly English and formal Hindi | English first; Hindi and Telugu subject to time, API availability and language-quality validation; architecture ready for more | A |
| Jurisdiction | Tenancy and many procedures vary by State | The assistant asks for State first | A |

> **[ASSUMPTION]** Drawn from the brief and domain reasoning. No primary user research has been done ([D-15](../review/decision-register.md)). In the pitch, use only checked figures from official sources.

## 3. Existing services and alternatives

| Alternative | How we treat it |
|---|---|
| Government Nyaya Setu (Department of Justice) | **An existing government service, and our positioning is respectful and complementary.** We do not claim to replace it, do not claim it lacks features without verified direct testing, and do not repeat unverified claims about its language count, architecture or capabilities ([D-14](../review/decision-register.md)). |
| Tele-Law, NALSA, Legal Services Authorities | Destinations the chatbot directs people to, through official links |
| General-purpose AI assistants | Can present unverified law; citations are not tied to an indexed corpus |
| Search engines and blogs | Quality varies; often stale after recent changes in law |
| Lawyers and legal aid clinics | Essential. We help people prepare and do not replace them. |

## 4. Proposed solution

> VidhiVerse AI is an AI-powered conversational legal assistant that helps Indian citizens understand their legal rights and responsibilities, simplify legal documents, discover relevant laws and judgments, and identify appropriate next steps through reliable, source-backed explanations.

Our differentiation is depth inside the conversation: document explanations, evidence-linked findings, legal research and guided assistance.

## 5. Boundaries

The product does not represent anyone, replace lawyers or government legal services, draft court filings, predict outcomes, invent procedures, or make unsupported claims that a clause is illegal or unenforceable. It provides information, not legal advice.

## 6. What success means

| Level | Measure | Target |
|---|---|---|
| Hackathon | Chatbot demo and P0 capabilities run live on the local stack | All pass |
| Quality | Internal targets in [23](../infrastructure/23-testing-strategy.md) | Targets, not results |
| Impact, later | People who reach a clear next step or legal aid resource | Baseline set after launch |
