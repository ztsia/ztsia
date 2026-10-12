# Sia Zhong Tai — Software Engineer

Backend services in Kotlin and Spring Boot. LangGraph agents, RAG pipelines, and the
infrastructure behind them.

**Software Engineer @ Mode Fair**

---

## Stack

**AI & Agents** — LangGraph · LLM Integration · RAG Pipelines · Prompt Engineering · n8n

**Backend** — Kotlin · Spring Boot · Java · Python · FastAPI · Supabase · PostgreSQL · Node.js · REST APIs

**Frontend** — TypeScript · Next.js · React Native (Expo) · Tailwind CSS · shadcn/ui

**DevOps** — Docker · GitHub Actions · CI/CD · Vercel · Firebase

---

## Featured Projects

### [Zetix](https://github.com/ztsia/zetix) — [live demo](https://zetix.vercel.app) · [walkthrough](https://youtu.be/tYE9JxSCns0)
Next.js · PostgreSQL · Supabase · Drizzle · Playwright

Ticketing for free concerts with unreserved seating — registration, seat allocation, tickets by email, and a door scanner. Built to replace a manual door check, where ushers searched a spreadsheet for each guest's name while the queue grew, and to keep audience data off free third-party platforms. v1 took about two weeks and ran a real chamber orchestra concert in September 2026: 400 tickets issued, 334 guests admitted by 7 ushers. Seats are claimed by one row-locked Postgres function, so a show cannot be oversold, and its concurrency tests run in CI against a real Postgres, never a mock. Every send is idempotent, and the scanner admits guests from an offline roster — at the concert, one usher's phone lost connection at doors-open and kept admitting, syncing the scans when it reconnected. Spec-driven, with a QA gate on every module: before its PR opens, an independent QA agent writes acceptance criteria from the spec and walks the user flows in a real browser, happy and sad paths. Close to 100 Playwright end-to-end specs.

### [AI Academic Assistant](https://ztsia.vercel.app/projects/ai-academic-assistant)
6 LangGraph agents · CP-SAT scheduling · FSRS spaced repetition · Semantic chunking · FastAPI · Supabase · Next.js · React Native

Adaptive learning platform with an autonomous ReAct scheduler, LLM-driven quiz generation using 3-Phase Chain-of-Thought, and a DAG knowledge graph pipeline. The background infrastructure runs 3 asyncio cron loops managing FCM push notifications, FSRS quiz planning, and missed session rescheduling — all within FastAPI lifespan.

### [Real-Time Outdoor Event System](https://github.com/ztsia/outdoor-game-manager-app)
React 19 · Firebase Firestore · Tailwind CSS v4 · PWA · Vite

Server-authoritative PWA deployed live across a 60-participant outdoor event. Atomic territory capture via Firestore Transactions, real-time leaderboard, and a 3-tier RBAC system — used by 6 team managers on event day. Live demo available — contact for access codes.

---

## Previously

**Software Engineering Intern @ GenTech AI** *(Oct 2025 – Jan 2026)*
Built a stateful multi-agent system (LangGraph + FastAPI) for project-board orchestration, shipped to staging and piloted across 3 boards. Built a JSON-driven low-code form engine (React/TypeScript) for Malaysian Tax Form C, covering 10+ form types.

---

## Elsewhere

[Portfolio](https://ztsia.vercel.app) · [LinkedIn](https://linkedin.com/in/ztsia) · leosia929@gmail.com
