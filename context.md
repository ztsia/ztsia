# ztsia-portfolio — Codebase Context

> **Last updated:** 2026-05-01 (rev 3)
> **Purpose:** Onboarding document for agents. Describes the current state of the portfolio codebase — what's built, what's pending, and key architectural decisions already made.

---

## 1. Project Overview

Personal portfolio for Sia Zhong Tai (ztsia) — Full-Stack AI Engineer, graduating June 2026.

**Current state:** Scaffolded and themed. Next.js 16.2.4 + React 19.2.4. All shadcn/ui components installed. Tweakcn `clean-slate` theme applied via `npx shadcn add`. No page components built yet.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2.4 (App Router) | Scaffolded with latest — spec said 15 |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS v4 | |
| UI Components | shadcn/ui (46 components) | All installed in `components/ui/` |
| Theme | next-themes | Dark default, light toggle |
| Theme Preset | Tweakcn — clean-slate | Deep navy-black bg, indigo-violet accent, oklch |
| Animations | Framer Motion | Scroll reveals only |
| Icons | Lucide React | |
| Fonts | Inter (sans) + JetBrains Mono (mono) | Set via CSS vars in globals.css |
| Deployment | Vercel | `ztsia.vercel.app` |

---

## 3. Theme — ENFORCED RULE

**Every component and page must use semantic Tailwind tokens only. No exceptions.**

The Tweakcn theme exposes CSS variables mapped to Tailwind utility classes. All styling must go through these — never hardcode colours, never use arbitrary values for colour.

### Correct
```tsx
className="bg-background text-foreground"
className="bg-card text-card-foreground border-border"
className="text-primary bg-primary/10"
className="text-muted-foreground"
```

### Forbidden
```tsx
className="bg-white text-black"          // hardcoded colour
className="bg-[#1e1e2e]"                 // arbitrary hex
className="text-indigo-400"              // Tailwind palette colour (not semantic)
style={{ color: 'rgb(129, 140, 248)' }}  // inline style colour
```

### Key semantic tokens
| Token | Usage |
|-------|-------|
| `bg-background` | Page background |
| `bg-card` | Card surfaces |
| `bg-muted` | Subtle fills, tag backgrounds |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary / subdued text |
| `text-primary` | Accent colour (indigo-violet) |
| `bg-primary` | Accent fills |
| `border-border` | All borders |
| `ring-ring` | Focus rings |
| `font-mono` | Code, tech stack tags |

---

## 4. Routes

```
/                                    ← single scroll page (not yet built)
/projects/ai-academic-assistant      ← FYP case study (not yet built)
```

---

## 5. Project Structure

```
ztsia_portfolio/
├── app/
│   ├── globals.css          ← Tailwind v4 + Tweakcn CSS vars (applied ✅)
│   ├── layout.tsx
│   ├── page.tsx
│   └── favicon.ico
├── components/
│   └── ui/                  ← all 46 shadcn components installed
├── lib/
│   └── utils.ts
├── hooks/
│   └── use-mobile.ts
├── public/
├── components.json
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 6. Implementation Status

| Section | Status | Notes |
|---------|--------|-------|
| Scaffold + shadcn install | ✅ Done | Next.js 16, all 46 shadcn components, next-themes, framer-motion |
| Tweakcn CSS | ✅ Done | `clean-slate` theme applied, oklch, dark + light vars in globals.css |
| Navbar | ⏳ Pending | |
| Hero | ⏳ Pending | |
| About | ⏳ Pending | |
| Projects (2 cards) | ⏳ Pending | No video yet — placeholder thumbnails |
| Skills | ⏳ Pending | |
| Contact / Footer | ⏳ Pending | |
| FYP Detail Page | ⏳ Pending | Agent tabs + Mermaid renderer |
| Framer Motion animations | ⏳ Pending | After core sections done |
| Video embeds | ⏳ Pending | YouTube unlisted — not yet recorded |
| Vercel deployment | ⏳ Pending | |

---

## 7. Key Decisions (Final — Do Not Revisit)

- Single scroll main page + one detail page only
- Dark/light toggle via next-themes, dark default
- Tweakcn clean-slate preset — violet/indigo accent
- No contact form — email link only
- No photo
- No skill progress bars
- YouTube unlisted for video embeds
- Agent tab order: Scheduler → RAG → Ingestion → Analytics → Cron → Parser
- Camp PWA has no detail page
- `fyp-supabase-backend` stays private
- Project name: "AI Academic Assistant"
- **All colours via semantic tokens only — no hardcoded values anywhere**

---

## 8. Content Assets Status

| Asset | Status |
|-------|--------|
| Resume PDF | ✅ Ready |
| Mermaid diagrams (6 agents) | ✅ Ready |
| Agent tab content | ✅ Ready (in portfolio-spec.md) |
| FYP demo video (90s) | ⏳ Not yet recorded |
| Camp PWA demo video (60s) | ⏳ Not yet recorded |
| FYP frontend screenshot | ⏳ Not yet captured |
| Camp PWA screenshot | ⏳ Not yet captured |
| OG image (1200×630) | ⏳ Not yet created |
