# 13 – Frontend Architecture

React, TypeScript, Vite, Material UI, Redux Toolkit, RTK Query. Dev URL: `http://localhost:5173`. Pages and routes are defined in the [canonical reference](../00-canonical-reference.md#7-frontend-pages-and-routes).

## 1. Structure

```text
frontend/src/
  app/         # router, providers, theme
  store/       # store, authSlice, uiSlice, chatStreamSlice
  services/    # RTK Query apis (authApi, chatApi, legalApi, documentsApi, workflowsApi, mattersApi, languageApi, legalAidApi, adminApi), sseClient
  pages/       # one folder per page
  components/  # documents/, research/, planner/, matters/, chat/, citations/, common/
  layouts/     # PublicLayout, ChatLayout, AdminLayout
  hooks/       # useSpeechRecognition, useSpeechSynthesis, useChatStream, useQuickExit
  i18n/        # en.json, hi.json, te.json (react-i18next)
  utils/
```

## 2. State

| State | Where | Note |
|---|---|---|
| Server data | RTK Query cache | Tag invalidation on writes |
| Access token | Redux memory only | Never `localStorage`; restored through refresh cookie |
| Streaming answer | `chatStreamSlice` | Buffer, stage, citations |
| UI language | Redux plus `localStorage` | Harmless convenience |
| Draft question | Component state | Not persisted, because it may be sensitive |

**Streaming:** `EventSource` cannot POST or send auth headers. Use `fetch` with `ReadableStream` in `sseClient.ts`, or a small maintained library. `AbortController` provides the stop button. The `done` event replaces the buffer with the final object.

## 3. Design system

| Token | Value | Use |
|---|---|---|
| `primary.main` | `#102744` Navy | Header, primary buttons |
| `primary.dark` | `#0B1B35` Deep Navy | Footer, hover |
| `secondary.main` | `#C6A15B` Gold | Decorative accents, on navy or as borders |
| `background.default` | `#F8F7F3` Ivory | Page |
| `background.paper` | `#FFFFFF` | Cards |
| `text.primary` | `#252B35` | Body |

**Contrast:** gold on white or ivory is too low for small text (NFR-A1), and must not be used for body text or the only state indicator. Run an automated check before freezing the palette.

**Type:** Noto Sans for Latin, Noto Sans Devanagari, Noto Sans Telugu, self-hosted. Line height 1.6 for Telugu and Devanagari. Base 16 px, spacing on an 8 px grid, card radius 12 px, one soft shadow level. Avoid italics for Indic scripts.

**Chat is the default page and first navigation item.** Order: Chat, Documents, Research, then Guidance, Legal Aid and Matters where delivered. Supporting views open as a panel beside the chat on desktop, and a sheet on mobile, and return to the conversation.

## 4. Chat layout

### Desktop (≥ 900 px)
```text
┌───────────────┬────────────────────────────────────────┐
│ + New chat    │  Header: Language ▾  State ▾  Quick exit│
│ Conversations │ ─────────────────────────────────────── │
│  Consumer...  │  User bubble                            │
│  Tenant...    │  Answer card                            │
│               │   Short answer                          │
│ Legal aid →   │   What the law says [C1]                │
│               │   Possible next steps                   │
│               │   Citation cards · Related provisions   │
│               │   👍 👎   🔊   Disclaimer                │
│               │ ─────────────────────────────────────── │
│               │  [ 🎤  Ask your question…          ➤ ] │
└───────────────┴────────────────────────────────────────┘
```

### Mobile (< 600 px)
Top bar with menu, language, quick exit. Sidebar becomes a drawer. Citation cards become a horizontal list that opens a bottom sheet. The composer sticks to the bottom and respects the on-screen keyboard. Starter questions are shown as vertically stacked chips when the chat is empty.

## 5. Components

| Component | Key behaviour |
|---|---|
| `MessageComposer` | 2,000-char limit, send and stop; document attach |
| `SuggestedActions` | Renders `suggested_actions` from the API |
| `AnswerCard` | Renders `sections` and turns `[[C1]]` into accessible links |
| `StatusStepper` | Stage labels with `aria-live="polite"` |
| `CitationCard` | Canonical fields; repealed status in amber with text, not colour alone |
| `ClarificationPrompt` | Question plus State quick-picks, with "Answer generally" |
| `SafetyBanner` | Helplines first, click-to-call |
| `QuickExitButton` | Immediately replaces the page with a neutral one and clears in-memory chat state |
| `LanguageSelector` | Native names |
| `FeedbackControls` | Thumbs, reason menu |
| `DisclaimerFooter` | Uses disclaimer from the API |
| `PdfEvidenceViewer` | PDF.js; jumps to a page and highlights by quote; falls back to showing the quote with page number |
| `ClauseList`, `FindingCard` | Original text next to explanation; a finding always links to evidence |
| `ProvisionCompare` | Word-level diff with mapping source and caution; stacks on mobile |
| `CitationVerifier` | Paste a citation; shows status and official link |
| `RelatedAuthorities` | Judgments with relation and paragraph |
| `WorkflowWizard`, `ChecklistPanel` | Questions one at a time; printable checklist; review date and sources |
| `OfficialServiceLink` | Labelled "Official government service"; opens externally; no implied affiliation |
| `MatterTimeline`, `DeadlineConfirmDialog`, `ReminderBadge`, `NotesPanel` | Date must be confirmed; shows no-guarantee and no-privilege notices |

Never render model output as raw HTML. Use a safe Markdown subset with sanitization.

## 6. Page specifications

| Page | Desktop | Mobile | Data | Empty and error states |
|---|---|---|---|---|
| Landing | Hero, language pick, demo questions, trust strip, non-affiliation notice | Single column, CTA above the fold | Static | n/a |
| Chat (primary) | §4, with attach button and suggested action chips | §4 | `chatApi` | LLM unavailable shows legal aid links |
| Research | Search, filters at left, results; section page has tabs: Text, Versions and compare, Amendments, Judgments, Sources; citation verifier | Filters in a sheet; tabs scroll | `legalApi` | Coverage notice |
| Document Explainer | Split view: PDF evidence at right; tabs at left for Summary, Clauses, Obligations, Deadlines, Penalties, Terms, Concerns, Ask | Tabs; evidence opens in a full-screen sheet | `documentsApi` with 3 s polling | Failed OCR message, consent gate |
| Guided Assistance (P1) | Opened from chat; situation box and topic cards; wizard; checklist with authorities | One question per screen | `workflowsApi` | "No reviewed plan yet" links to Legal Aid |
| Matter Companion (P1, optional) | Matter list; detail with Timeline, Documents, Deadlines, Notes | Same tabs | `mattersApi` | Explains value and privacy on first use |
| Legal Aid | Eligibility, finder, helplines, official services | Helplines first | `legalAidApi` | "Not yet verified for your State" with NALSA link |
| History | Table with search | List | `chatApi` | Toggle explanation |
| Language Settings | Language, Romanized hints, voice | Same | `/languages`, preferences | |
| Profile | Details, preferences | Same | `/users/me` | |
| Privacy Centre | Plain-language notice, providers, export, delete | Same | `/users/me/export`, `DELETE /users/me` | Double confirmation |
| Feedback | Simple form | Same | `POST /feedback` | |
| Admin Dashboard | Cards, charts | Readable, desktop-focused | `adminApi` | |
| Source Management | Sources table, discovery queue | Desktop-focused | `adminApi` | |

## 7. Internationalization

All UI strings live in `i18n/*.json`. Brand values come from `VITE_APP_NAME`, `VITE_APP_TAGLINE`, `VITE_APP_CATEGORY` and `VITE_APP_DESCRIPTION`. The language selector shows only enabled languages from `GET /languages`. Hindi and Telugu strings (P1) need native-speaker review, including the disclaimer. Dates use `Intl` with the locale. Answer text uses `lang` attributes for correct screen-reader voices.

### Brand copy (proposed, English source strings)

| Location | Copy |
|---|---|
| Header, browser title | VidhiVerse AI |
| Landing headline | Understand Law. Access Justice. |
| Landing subheading | AI-powered conversational legal information assistant for India. |
| Landing body | VidhiVerse AI is an AI-powered conversational legal assistant that helps Indian citizens understand their legal rights and responsibilities, simplify legal documents, discover relevant laws and judgments, and identify appropriate next steps through reliable, source-backed explanations. |
| Landing supporting line | Ask in your language. Understand your rights. Find the law. Know your next step. |
| Landing action | Primary: a chat box, "Ask your legal question". Secondary: attach a document. |
| Landing footer, Privacy Centre | `NON_AFFILIATION_V1` from the [canonical reference](../00-canonical-reference.md#2-product-identity) |
| Each answer | `DISCLAIMER_V1` |

Do not add a logo, ™ or ® to these strings: availability is unverified (D-17). Hindi and Telugu versions need native-speaker review.

## 8. Performance

Route-level lazy loading; icons imported individually; subset fonts per script; no large chart library on public pages. Target NFR-P7.

## 9. Testing

Vitest and React Testing Library for components; Playwright for the demo paths at 360, 768 and 1280 px; axe for accessibility checks ([23](../infrastructure/23-testing-strategy.md)).
