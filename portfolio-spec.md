# Portfolio Website — Complete Technical Specification
> **Owner:** Sia Zhong Tai (ztsia)
> **Handover Document for:** Claude Code
> **Status:** Ready to build — ship fast, apply by next week
> **Last Updated:** 1 May 2026

---

## 1. Project Overview

A personal developer portfolio for a Full-Stack AI Engineer graduating June 2026. The portfolio must:
- Load in under 2 seconds and work perfectly on mobile
- Communicate architectural sophistication, not just project lists
- Get a technical recruiter to click "View Case Study" within 30 seconds
- Be live on Vercel with a custom domain (or `ztsia.vercel.app` at minimum)

**Tone:** Technical, confident, minimal. Not flashy. The work is impressive — the design should get out of the way and let it speak.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 15 (App Router) | Owner already knows this stack |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS v4 | |
| UI Components | shadcn/ui | Owner already uses this |
| Theme | next-themes | Dark/light toggle |
| Theme Preset | Tweakcn — **Vercel theme** | Deep navy-black bg, indigo-violet `rgb(129, 140, 248)` accent |
| Animations | Framer Motion | Subtle scroll reveals only, no gimmicks |
| Icons | Lucide React | |
| Deployment | Vercel | Free tier, auto-deploy from GitHub |
| Font | Inter (body) + JetBrains Mono (code) | From Vercel theme preset |

---

## 3. Design System

### Theme
- **Dark/light toggle** — top right of navbar, persisted via `next-themes` + localStorage
- **Default:** Dark mode
- **Accent colour:** Single accent from Tweakcn preset (Violet preferred — reads as AI/technical)
- **No colour overload** — neutral backgrounds, one accent, that's it
- **No progress bars on skills** — they're meaningless and look junior

### Typography
- Avoid Inter, Roboto, Arial — too generic
- Geist or a distinctive alternative from the Tweakcn preset
- Mono font for tech stack tags and code-adjacent elements

### Motion Rules
- Scroll-triggered fade-up on section entry — subtle, not dramatic
- Hover states on project cards — slight lift (`translateY(-2px)`) + border glow in accent colour
- No autoplay animations on the main scroll page
- No parallax — adds complexity, rarely adds value

### Layout
- Max width: `max-w-5xl mx-auto` — not full-width, not too narrow
- Single column on mobile, constrained centered on desktop
- Generous whitespace — content needs room to breathe
- Sticky navbar — always visible

---

## 4. Site Structure

### Routing
```
/ (main page — single scroll)
/projects/ai-academic-assistant (FYP detail page)
```

No other routes. Camp PWA has no detail page — card only on main page.

### Main Page Sections (in scroll order)
1. Navbar
2. Hero
3. About
4. Projects
5. Skills
6. Contact / Footer

---

## 5. Component Specifications

### 5.1 Navbar
```
[ztsia]                    About  Projects  Skills  Contact  [🌙]
```
- Fixed/sticky top
- Left: name as home anchor (`#hero`)
- Right: anchor links (smooth scroll) + dark/light toggle
- On mobile: hamburger menu collapses links
- Subtle border-bottom on scroll (not visible at top)
- Backdrop blur background: `bg-background/80 backdrop-blur-sm`

---

### 5.2 Hero Section
**Above the fold. First thing they see. Must answer: who is this and why should I keep reading.**

Layout:
```
[Small badge: "Available July 2026 · Open to Remote"]

Sia Zhong Tai

Full-Stack AI Engineer
Building LangGraph agents, RAG pipelines,
and the infrastructure behind them.

[View My Work ↓]  [Download Resume]

─────────────────────────────────

[Python] [TypeScript] [LangGraph] [Supabase] [Next.js] [FastAPI]
(tech stack icon row — logos only, no labels)
```

Notes:
- Badge at top: small pill component, accent colour border
- Name: large, confident, not oversized
- Tagline: 2 lines max, describes what you BUILD not who you ARE
- Two CTAs: "View My Work" scrolls to Projects, "Download Resume" links to PDF
- Tech stack row: SVG icons only, no text labels, subtle opacity
- No photo — optional for SG applications, skip for cleanliness

---

### 5.3 About Section
**3-4 lines. Positioning statement, not biography.**

Content:
```
Final year Software Engineering student at UTAR, graduating June 2026.
I spent my internship shipping a LangGraph multi-agent system at a 
Malaysian AI startup. My FYP is a full-stack AI academic platform — 
6 LangGraph agents, a CP-SAT scheduling engine, FSRS spaced repetition, 
and a 19-table Supabase backend across 4 repositories.

I'm drawn to roles where AI is the product, not a feature.

When I'm not building, I lead 100+ person concert operations as 
Concertmaster of Galaxy Chamber Orchestra.
```

Notes:
- No headers, just clean prose
- Last line adds personality — use it, it's a conversation starter
- Link "Galaxy Chamber Orchestra" if they have a website

---

### 5.4 Projects Section

#### Project Card Anatomy
Each card contains:
- Project title
- One-line description
- Tech stack tags (chip components, mono font)
- 2-3 line summary (hook, not full description)
- Static thumbnail/screenshot
- Small ▶ play icon overlay on thumbnail (click = modal with video)
- CTA buttons

#### Card 1 — AI Academic Assistant (FYP)
```
AI Academic Assistant
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A full-stack AI academic platform with 6 LangGraph agents —
adaptive quizzing via FSRS, CP-SAT constraint scheduling,
and a semantic knowledge graph pipeline.

[Next.js] [FastAPI] [LangGraph] [Supabase] [OR-Tools] [Python]

[▶ Watch Demo]  [View Case Study →]
```

Notes:
- "View Case Study →" links to `/projects/ai-academic-assistant`
- Thumbnail: screenshot of the web frontend dashboard
- Video modal: 90-second full demo (YouTube unlisted embed)
- No "GitHub" button on this card — private repos, link inside case study page instead

#### Card 2 — Real-Time Outdoor Event System
```
Real-Time Outdoor Event System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Real-time PWA deployed live for a 60-participant outdoor event.
Server-authoritative game engine with Firestore transactions
and 3-tier RBAC — used by 6 team managers on event day.

[React 19] [Firebase] [Tailwind CSS] [PWA] [Firestore]

[▶ Watch Demo]  [GitHub]  [Live Demo]
```

Notes:
- Thumbnail: screenshot of territory map / HQ dashboard
- Video modal: 60-second demo
- Both GitHub and Live Demo buttons visible (repo is public)
- "Live Demo" button opens a modal popup BEFORE redirecting, displaying role access codes:
  ```
  Manager code: [code]
  HQ code: [code]
  Admin code: [code]
  
  [Open Live Demo →]
  ```
  User sees credentials first, then clicks through to the live URL. Zero friction.

#### Cards Layout
- Desktop: 2 cards side by side
- Mobile: stacked single column
- Cards have subtle border, hover lift + accent glow

---

### 5.5 Skills Section
**Not a wall of logos. Two clean rows.**

```
Core Stack
[Python] [TypeScript] [Next.js] [React] [FastAPI] [Node.js] [Vue.js]

AI & Infrastructure  
[LangGraph] [Supabase] [Docker] [OR-Tools] [GitHub Actions]
```

Notes:
- SVG logos with labels this time (unlike hero which is logos-only)
- No progress bars — ever
- No soft skills
- No PHP, Laravel, n8n — keep off portfolio, dilutes AI/Full-Stack positioning
- No Google Gemini — it's an API call, not a skill
- No pgvector — FYP uses structured semantic chunking, not vector embeddings. Listing pgvector misrepresents the architecture.

---

### 5.6 Contact / Footer
```
Available July 2026
Open to full-stack AI engineering roles — remote-friendly preferred.

[leosia929@gmail.com]  [LinkedIn]  [GitHub]

Built by Sia Zhong Tai · 2026
```

Notes:
- No contact form — adds complexity, email link is sufficient
- Three links only: email, LinkedIn, GitHub
- Clean, minimal footer — no clutter

---

## 6. FYP Detail Page `/projects/ai-academic-assistant`

This is the technical case study. Target audience: technical interviewers and engineering leads.

### Page Structure (scroll order)

```
← Back to Portfolio

─── HERO ───────────────────────────────────────────

AI Academic Assistant
Final Year Project · UTAR · 2025–2026

A full-stack AI academic platform built across 4 repositories —
cross-platform frontends, a production Supabase backend, and a 
Python AI microservice with 6 specialized LangGraph agents for 
adaptive learning, autonomous scheduling, and semantic knowledge processing.

[Next.js] [React Native] [FastAPI] [LangGraph] [Supabase] 
[OR-Tools] [Python] [TypeScript] [Gemini API]

[GitHub: fyp-ai-service ↗]  [Live Frontend ↗]  [Request Demo →]

─── DEMO VIDEO ─────────────────────────────────────

[90-second demo video embed — YouTube unlisted, user-initiated play]

─── SYSTEM OVERVIEW ─────────────────────────────────

[Master Mermaid architecture diagram — from master_architecture.md]

The platform operates across 4 tiers:
- Client Tier: Next.js web + React Native (Expo) mobile
- BaaS Tier: Supabase (PostgreSQL, Auth, Edge Functions, Realtime)
- AI Service Tier: FastAPI + 6 LangGraph agents
- External: Google Gemini API + Mock LMS

Security model: Frontends never call the AI service directly.
All AI requests traverse Supabase Edge Functions with Bearer token 
authentication — the AI service URL is never exposed to the client.

─── THE AGENTS ──────────────────────────────────────

[Tab: Scheduler] [Tab: RAG] [Tab: Ingestion] [Tab: Analytics] [Tab: Cron] [Tab: Parser]

Tab order is fixed — most impressive first, not implementation order.

Each tab renders:
  AGENT NAME — one sentence description
  
  [Mermaid flow diagram for this agent]
  
  Key Engineering Decisions:
  
  Decision title
  Why this approach, and specifically why NOT the alternative.
  (2-3 sentences, "why not" framing)
  
  Decision title  
  ...

─── INFRASTRUCTURE HIGHLIGHTS ───────────────────────

3 cards in a row (stack on mobile):

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 🔒 Security         │  │ 🧠 Adaptive Learning │  │ ⚙️ Background Infra  │
│                     │  │                     │  │                     │
│ RLS on all 19 tables│  │ FSRS + BKT-weighted │  │ 3 asyncio loops —   │
│ Edge Function gateway│  │ EMA mastery scoring │  │ no Celery, no Cloud │
│ Signed URL storage  │  │ FSRS review scheduling│  │ Scheduler, zero     │
│ Bearer auth gateway │  │ per concept         │  │ external dependencies│
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

─── REQUEST DEMO ────────────────────────────────────

The AI service runs a persistent asyncio background scheduler 
and cannot be hosted on serverless platforms.

[Schedule a Demo Session →]
→ mailto:leosia929@gmail.com?subject=FYP Demo Request — AI Academic Assistant&body=Hi Zhong Tai,%0A%0AI'd like to schedule a live demo of your AI Academic Assistant FYP.%0A%0AName:%0ACompany/Role:%0APreferred time:%0A%0AThanks

I'll spin up a session — Parser Agent, RAG quiz generation, 
and CP-SAT scheduling available to demo live.

─── FOOTER ──────────────────────────────────────────

← Back to Portfolio
```

---

### Agent Tab Content Specifications

#### Tab 1: Scheduler (Lead with this)
- **One line:** ReAct orchestrator agent using Google OR-Tools CP-SAT solver to fit tasks into calendar slots under hard and soft constraints, with automatic missed-session rescheduling.
- **Mermaid:** scheduler_graph_manual.md diagram
- **Key decisions:**
  - *Why CP-SAT over greedy?* Greedy fails when constraints interact. CP-SAT evaluates the full constraint space globally.
  - *Why ReAct pattern?* Dynamic tool selection allows the agent to choose between full scheduling, fast scheduling, and reschedule tools based on trigger context.
  - *Why daily cron for missed-session detection?* Missed sessions are identified by the daily background cron at 06:00 AM per-user local time — scanning for work sessions where end_time has passed but status is still scheduled. This keeps rescheduling logic centralised in one system rather than distributed across DB triggers.

#### Tab 2: RAG
- **One line:** Generates adaptive quizzes and topic summaries using a 3-Phase Chain-of-Thought approach, grounded by semantic learning chunks and calibrated to per-concept mastery scores.
- **Mermaid:** rag_graph_architecture.md diagram
- **Key decisions:**
  - *Why 3-Phase CoT?* Single-shot generation produces structurally inconsistent quizzes. CoT forces capacity analysis → outline → generation sequentially, dramatically improving schema adherence.
  - *Why BKT-weighted EMA over simple correct/incorrect?* Hint usage and uncertainty flags reveal partial knowledge. Raw binary scoring over-rewards lucky guesses.
  - *Why FSRS over SM-2?* FSRS models memory stability and forgetting curves more accurately than SM-2's interval-only approach.

#### Tab 3: Ingestion
- **One line:** Async LMS sync pipeline with SHA-256 content deduplication, LLM-powered semantic chunking with difficulty tiers, and DAG knowledge graph extraction.
- **Mermaid:** ingestion_graph_manual.md diagram
- **Key decisions:**
  - *Why SHA-256 file hashing over filename dedup?* Filenames change. Content doesn't. Hash-based dedup prevents reprocessing identical lecture slides uploaded under new names.
  - *Why networkx DAG for knowledge graphs?* Relationship primitives (includes, requires, contrasts with) need cycle detection. networkx validates the DAG structure before persistence, preventing corrupted graphs.
  - *Why semantic chunking over fixed-size chunking?* Fixed-size chunks split mid-concept, destroying retrieval quality. LLM-driven semantic chunking respects concept boundaries and assigns difficulty tiers used by the FSRS scheduler downstream.

#### Tab 4: Analytics
- **One line:** Fan-out/fan-in parallel agent computing productivity metrics, learning progress, and behavior profiles — persisted as structured snapshots with AI-generated narratives.
- **Mermaid:** analytics_graph_architecture.md diagram
- **Key decisions:**
  - *Why fan-out/fan-in parallel pattern?* Time management, learning, and behavior metrics are independent. Sequential execution triples latency for no reason.
  - *Why strict narrative prompt rules (no "amazing", no "leverage")?* LLMs default to sycophantic language. Explicit banned word lists enforce a clinical, data-driven tone that students actually trust.

#### Tab 5: Daily Cron (Planner)
- **One line:** Three independent asyncio loops running natively in FastAPI lifespan — 60s notification dispatcher, hourly LMS sync, and a per-user 06:00 AM daily planner.
- **Mermaid:** daily_cron_architecture.md diagram
- **Key decisions:**
  - *Why native asyncio over Celery/Cloud Scheduler?* External schedulers add infrastructure overhead and cold-start latency. Native asyncio loops share the FastAPI process and database connection pool with zero additional services.
  - *Why per-user 06:00 AM local time?* A global cron at 06:00 UTC would fire at 2PM for Malaysian users. Timezone-aware per-user triggering is the only correct design for an academic planner.

#### Tab 6: Parser
- **One line:** Multimodal pipeline converting unstructured text and files into typed Task, Event, or Routine JSON objects via sequential extract → correct → classify → parse nodes.
- **Mermaid:** parser_graph_architecture.md diagram
- **Key decisions:**
  - *Why split classification from parsing?* A single prompt doing both classification and extraction produces confused outputs when the type is ambiguous. Separation allows the classification node to run at temperature 0.0 (deterministic) while parsing runs with slightly higher temperature for field extraction flexibility.
  - *Why Vision model for timetable/routine parsing?* EasyOCR collapses spatial layout — a timetable's column/row structure carries meaning that raw OCR text destroys. Passing raw image bytes to Gemini's vision model preserves the spatial context the parser needs.

---

## 7. Video Implementation

### Recording
- Tool: Loom (fast) or OBS (no branding)
- Upload: YouTube unlisted
- FYP demo: 90 seconds max
- Camp PWA demo: 60 seconds max

### Embedding
```jsx
// YouTube embed component — use for both detail page and modals
export function VideoEmbed({ 
  videoId, 
  autoplay = false 
}: { 
  videoId: string
  autoplay?: boolean 
}) {
  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}${
          autoplay ? '?autoplay=1&mute=1&loop=1&playlist=' + videoId : ''
        }`}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  )
}
```

### Usage
- **Main page project cards:** Static thumbnail with ▶ overlay → click opens Dialog/Modal with VideoEmbed (autoplay=false)
- **FYP detail page hero:** VideoEmbed directly on page (autoplay=false, let user press play)
- Do NOT autoplay on main scroll page — distracting

---

## 8. Mermaid Rendering

Owner has already built a hybrid Markdown + Mermaid renderer in the FYP web frontend. Copy that component directly into the portfolio.

If rebuilding from scratch:
```bash
npm install react-markdown remark-gfm
npm install mermaid
```

Render Mermaid blocks by detecting ` ```mermaid ` fences and replacing with a client-side Mermaid component. Mark the component with `"use client"` — Mermaid requires browser APIs.

---

## 9. Demo Access & Credentials

**Never put credentials in any README or public repo.**

**Camp PWA:** Credentials are shown in a modal popup triggered by the "Live Demo" button on the project card. No email required — zero friction access.
- The modal displays all 3 role codes (Manager, HQ, Admin) before redirecting to the live URL
- Credentials are safe to expose publicly — the system contains no real user data

**FYP AI Service:** The AI service cannot be hosted on serverless platforms (persistent asyncio loops). Demo is by appointment via email.

"Request a Live Demo" button on the FYP detail page uses a pre-filled `mailto:` link — one click opens the user's mail client with subject and body pre-written. They just hit send.

```
mailto:leosia929@gmail.com
  ?subject=FYP Demo Request — AI Academic Assistant
  &body=Hi Zhong Tai,%0A%0AI'd like to schedule a live demo of your AI Academic Assistant FYP.%0A%0AName:%0ACompany/Role:%0APreferred time:%0A%0AThanks
```

Button label: **"Schedule a Demo Session →"**

Do NOT use a plain `mailto:leosia929@gmail.com` bare link — always use the pre-filled version so the recruiter doesn't have to write anything.

---

## 10. GitHub Repos — Public/Private Decisions

| Repo | Status | Action |
|------|--------|--------|
| `fyp-ai-service` | Private → **Make Public** | Priority 1. Audit for hardcoded keys first. |
| `fyp-web-frontend` | Private → **Make Public** | Priority 2. |
| `fyp-supabase-backend` | Private → **Keep Private** | Contains live project ID. Reference as "available on request." |
| `fyp-mobile-frontend` | Private → **Optional** | Lower priority. |
| Camp PWA | Private → **Already Public** | Done. README exists and is sufficient. |

**Before making any repo public:**
- Confirm `.env` is in `.gitignore`
- Only `.env.example` exists in repo (no real keys)
- No hardcoded API keys or Supabase URLs in source files

---

## 11. Deployment

```bash
# Deploy to Vercel
vercel --prod

# Or connect GitHub repo to Vercel dashboard for auto-deploy
```

Target URL: `ztsia.vercel.app` (or custom domain if purchased)

Add to Vercel env vars — none needed for portfolio (no API calls from portfolio itself, all AI calls are "request demo" via email).

---

## 12. SEO & Meta

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Sia Zhong Tai — Full-Stack AI Engineer',
  description: 'Full-Stack AI Engineer. Building LangGraph agents, RAG pipelines, and the infrastructure behind them. Available July 2026.',
  openGraph: {
    title: 'Sia Zhong Tai — Full-Stack AI Engineer',
    description: 'Portfolio of Sia Zhong Tai — FYP: AI Academic Assistant with 6 LangGraph agents, CP-SAT scheduling, FSRS spaced repetition.',
    url: 'https://ztsia.vercel.app',
    images: ['/og-image.png'], // Add a 1200x630 screenshot
  },
}
```

---

## 13. Build Priority Order

**Do these in order. Do not skip ahead.**

1. Scaffold Next.js project with Tailwind + shadcn + next-themes
2. Apply Tweakcn theme preset (Violet or Blue — pick one)
3. Build Navbar + Hero + Contact (structural shell)
4. Build Projects section with both cards (no video yet — placeholder thumbnails)
5. Build Skills section
6. Deploy to Vercel — get a live URL even if incomplete
7. Build FYP detail page — System Overview + Agent Tabs
8. Add Mermaid renderer to agent tabs
9. Record videos — embed via YouTube
10. Add video modals to project cards on main page
11. Polish animations (Framer Motion scroll reveals)
12. Final review — mobile responsiveness check

**Stop at step 6 if needed and start applying.** A live but incomplete portfolio is better than a perfect portfolio that isn't live yet.

---

## 14. Content Assets Needed

| Asset | Status | Notes |
|-------|--------|-------|
| Resume PDF | ✅ Ready | Export from resume.md |
| FYP demo video | ⏳ Record | 90 seconds, YouTube unlisted |
| Camp PWA demo video | ⏳ Record | 60 seconds, YouTube unlisted |
| FYP frontend screenshot | ⏳ Capture | For project card thumbnail |
| Camp PWA screenshot | ⏳ Capture | For project card thumbnail |
| OG image (1200x630) | ⏳ Create | Simple text + dark bg is fine |
| Mermaid diagrams | ✅ Ready | All 6 agent .md files ready |
| Agent descriptions | ✅ Ready | All content in this spec |

---

## 15. Key Decisions Summary (Do Not Revisit)

These decisions are final. Do not re-debate them during build:

- ✅ Single scroll main page + one detail page (`/projects/ai-academic-assistant`)
- ✅ Dark/light toggle via next-themes
- ✅ Tweakcn preset — Violet or Blue (pick before scaffolding)
- ✅ No contact form — email link only
- ✅ No photo
- ✅ No skill progress bars
- ✅ No contributing section on any README
- ✅ No test credentials in any README — portfolio detail page only
- ✅ YouTube unlisted for video embeds
- ✅ Agent tab order: Scheduler → RAG → Ingestion → Analytics → Cron → Parser
- ✅ Camp PWA has no detail page
- ✅ `fyp-supabase-backend` stays private
- ✅ Project name: "AI Academic Assistant" — no brand name

---

## 16. Corrections Log
> **For Claude Code:** Apply all items below to the already-built codebase. Each correction is self-contained with exact location and what to change.

---

### Correction 1 — Remove `pgvector` from Skills Section
**Location:** Section 5.5 Skills, AI & Infrastructure row  
**Original:** `[LangGraph] [Supabase] [pgvector] [Google Gemini] [Docker] [OR-Tools]`  
**Corrected:** `[LangGraph] [Supabase] [Docker] [OR-Tools] [Google Gemini] [GitHub Actions]`  
**Reason:** The FYP uses structured semantic chunking, not vector embeddings or pgvector. Listing pgvector misrepresents the architecture and invites questions that contradict the resume and case study. `GitHub Actions` added as a replacement — it's accurate and ATS-searchable.

---

### Correction 2 — Remove `pgvector` and `FSRS` from FYP Detail Page Hero Tags
**Location:** Section 6, FYP Detail Page Hero, tech stack chip row  
**Original:** `[Next.js] [React Native] [FastAPI] [LangGraph] [Supabase] [OR-Tools] [FSRS] [Python] [TypeScript] [pgvector]`  
**Corrected:** `[Next.js] [React Native] [FastAPI] [LangGraph] [Supabase] [OR-Tools] [Python] [TypeScript] [Gemini API]`  
**Reason:** `pgvector` — same as Correction 1, not used. `FSRS` — this is an algorithm implemented in code, not a library or tool; listing it as a tech tag misrepresents what it is. Replaced both with `Gemini API` which is accurate and meaningful to a technical reader.

---

### Correction 3 — Rename Card 2 Project Title
**Location:** Section 5.4, Card 2 title  
**Original:** `AI-Powered Outdoor Event System`  
**Corrected:** `Real-Time Outdoor Event System`  
**Reason:** There is no AI in the Camp PWA. The original name was used on the resume for positioning, but on the portfolio where technical readers will click through to the GitHub repo and see the code, the "AI-Powered" label is inaccurate and will damage credibility. The engineering is strong enough without the label.

---

### Correction 4 — Add Access Code Note to Camp PWA Card
**Location:** Section 5.4, Card 2 Notes  
**Add:** "Live Demo button should include a tooltip or note: 'Contact for access codes' — do not send users to the live demo URL without warning them credentials are required."  
**Reason:** A recruiter clicking Live Demo and hitting a login wall with no context is a dead end that creates friction and a bad first impression.

---

### Correction 5 — Fix Scheduler Tab: DB Webhooks → Daily Cron
**Location:** Section 6, Agent Tab Content, Tab 1: Scheduler, third key decision  
**Original:** `*Why DB webhooks for conflict detection?* Missed sessions are detected at the data layer, not polled — zero latency between event and reschedule trigger.`  
**Corrected:** `*Why daily cron for missed-session detection?* Missed sessions are identified by the daily background cron at 06:00 AM per-user local time — scanning for work sessions where end_time has passed but status is still scheduled. This keeps rescheduling logic centralised in one system rather than distributed across DB triggers.`  
**Reason:** The architecture docs confirm missed-session rescheduling is triggered by the Daily Cron's Job D, not DB webhooks. This was an error in the original spec that contradicts the actual implementation. The resume has already been corrected to reflect this.

---

### Correction 6 — Fix Demo Video Autoplay Note
**Location:** Section 6, FYP Detail Page, DEMO VIDEO block  
**Original:** `[90-second demo video embed — YouTube unlisted, autoplay muted]`  
**Corrected:** `[90-second demo video embed — YouTube unlisted, user-initiated play]`  
**Reason:** Section 7 (Video Implementation) explicitly states "autoplay=false, let user press play" for the detail page. The autoplay note in the page structure block contradicted this. Autoplay on a case study page is intrusive and inconsistent with the rest of the spec.

---

### Correction 7 — Fix Security Highlight Card Copy
**Location:** Section 6, Infrastructure Highlights, Security card  
**Original:** `60s signed URLs` and `DENY ALL default`  
**Corrected:** `Signed URL storage` and `Bearer auth gateway`  
**Reason:** "60s signed URLs" is an implementation detail that implies a specific timeout which may not be accurate. "DENY ALL default" is Supabase RLS terminology that reads as jargon without context. The corrected copy is cleaner and more accurate to what the card is communicating.

---

### Correction 8 — Camp PWA Live Demo: Replace "Contact for codes" with In-Page Modal
**Location:** Section 5.4 Card 2 Notes + Section 9 Demo Access & Credentials  
**Original:** "Contact for access codes" note on the Live Demo button  
**Corrected:** "Live Demo" button triggers a modal popup displaying all 3 role access codes (Manager, HQ, Admin) before redirecting to the live URL. No email required.  
**Implementation:**
```
Modal content:
  Manager code: [code]
  HQ code: [code]
  Admin code: [code]
  [Open Live Demo →]
```
**Reason:** Requiring users to email for credentials creates friction that causes drop-off. Camp PWA contains no real user data — credentials are safe to expose publicly. Zero friction = more recruiters actually try the demo.

---

### Correction 9 — FYP Demo Button: Pre-filled mailto link + Updated Button Label
**Location:** Section 6 FYP Detail Page Request Demo block + Section 9 Demo Access & Credentials  
**Original:** `[Request a Live Demo] → mailto:leosia929@gmail.com` (bare link, no pre-fill)  
**Corrected:** Button label changed to "Schedule a Demo Session →". Link uses pre-filled mailto:

```
mailto:leosia929@gmail.com
  ?subject=FYP Demo Request — AI Academic Assistant
  &body=Hi Zhong Tai,%0A%0AI'd like to schedule a live demo of your AI Academic Assistant FYP.%0A%0AName:%0ACompany/Role:%0APreferred time:%0A%0AThanks
```

**Reason:** A bare mailto link dumps the recruiter into a blank compose window — they have to write the subject, figure out what to say, and decide what info to include. Pre-filling removes all of that. One click, one send. The structured body (Name / Company / Preferred time) also means you get actionable info in the first email instead of a back-and-forth. Always use the pre-filled version.

---

### Correction 10 — Skills Section: Remove Google Gemini, Add Vue.js to Core Stack
**Location:** Section 5.5 Skills Section  
**Original Core Stack:** `[Python] [TypeScript] [Next.js] [React] [FastAPI] [Node.js]`  
**Original AI & Infrastructure:** `[LangGraph] [Supabase] [Docker] [OR-Tools] [Google Gemini] [GitHub Actions]`  
**Corrected Core Stack:** `[Python] [TypeScript] [Next.js] [React] [FastAPI] [Node.js] [Vue.js]`  
**Corrected AI & Infrastructure:** `[LangGraph] [Supabase] [Docker] [OR-Tools] [GitHub Actions]`  
**Reason:** Google Gemini is an API call, not a skill — same reasoning as removing it from the resume. Listing an API as a skill misrepresents what it is and invites questions about model training and fine-tuning that don't apply. Vue.js is an honest addition — used in real internship/project work and already present on the resume frontend row.