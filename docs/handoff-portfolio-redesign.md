# Portfolio redesign: handoff

State as of 12 Oct 2026. Branch `claude/trusting-lamport-9qc5q6`, PR ztsia/ztsia#4 (open, Vercel preview builds from it).

## What the owner wants

- The portfolio is the first thing most people see of Sia, so it should **impress and surprise**, at the level of current AI-built motion sites. The Zetix landing page (zetix.vercel.app) is the floor, not the ceiling.
- **GSAP + Lenis**, not Motion. Don't mix the two.
- Branding must be about Sia, **not tied to one project** (no Zetix figures in the hero, no "on the night" copy) and **not about music** (an earlier "violin strings" concept was dropped; Concertmaster stays as one timeline line).
- **Each project gets its own look when scrolled to.** The site's own look is "Index": paper and ink only, Archivo variable width. Chosen from three concepts (Index, Systems, Poster); the concept board is at https://claude.ai/artifact/9k1pMRhpKzQMsuvXo6ySAW.
- Liked the Poster lens interaction, but worried hidden text goes unread, so everything under the lens is also listed in plain text (Stack section).
- The AI Academic Assistant and outdoor event UIs were not great visually, and the AI Academic Assistant had several themes (the walkthrough happens to use the claymorphism one). So those worlds are art-directed from what the project does, not copied from its UI.

## Owner's verdict on the current version (drives the next session)

> More alive than before, but still a bit lame. It's just changing colours per project and adding some interaction. Where is the scrolling choreography? Where are GSAP and Lenis?

That's fair. GSAP currently only does small, local things (listed below). There is no pinning, no scrubbed scene change, no transition between sections, and the world colour change is a plain CSS transition on toggle. **Next session: brainstorm and build real scroll choreography.** The owner wants to brainstorm first, so propose options before building.

## What exists now

| Area | File | What it does |
|---|---|---|
| Tokens | `app/globals.css` | Index shell tokens; `--w-*` world tokens; `html[data-world="zetix" \| "study" \| "field"]` palettes; `html[data-world]` also remaps shadcn tokens so dialogs and cards follow the world |
| Fonts | `app/layout.tsx` | Archivo (wdth axis) for the shell; Sora / Geist / Bricolage Grotesque for worlds (`preload: false`); JetBrains Mono for code |
| GSAP registry | `lib/gsap.ts` | Registers ScrollTrigger, SplitText, Draggable, Flip, useGSAP; `MOTION_OK` media query for `gsap.matchMedia` |
| Smooth scroll | `components/smooth-scroll.tsx` | `ReactLenis root`, driven by `gsap.ticker`; `ScrollTriggerSync` child calls `useLenis(ScrollTrigger.update)` |
| Hero | `components/hero.tsx` | Chars rise and stretch (`--wdth` 62 to 86) on load; ringed lens sweeps once, then follows the cursor (tap on touch); letters near the lens widen to 125. Name: one line on md+, three on mobile |
| World switch | `components/world.tsx` | Section that sets `data-world` on `<html>` via a ScrollTrigger toggle (top 55% to bottom 45%) |
| Work | `components/work.tsx` | "Selected work" heading, then three `Project` panels: SplitText title reveal once, `[data-rise]` fades, demo rise |
| Demos | `components/demos/*.tsx` | `scanner-demo` (Draggable ticket onto phone, duplicate refused, offline then sync), `scheduler-demo` (Flip blocks into week grid, labelled illustration), `territory-demo` (capture zones, Flip leaderboard, two-teams race) |
| About | `components/about.tsx` | SplitText word-fill scrubbed on scroll, then timeline |
| Stack | `components/skills.tsx` | Plain grouped lists (from README) |
| Contact | `components/contact.tsx` | Inverted block, large email, copy button |
| Nav | `components/navbar.tsx` | Hides on scroll down; links use `lenis.scrollTo` on the home page |
| Case study | `app/projects/ai-academic-assistant/page.tsx` | Whole page in the `study` world via `components/world-page.tsx`; diagram recoloured, emoji removed |

Copy is factual and sourced from README.md and the previous site: Zetix 400 / 334 / 51 / 6; AI Academic Assistant 6 agents, 19 RLS tables, 3 asyncio loops, 4 repos; outdoor event 60 participants, 6 managers, 3 role tiers. Don't invent figures.

## Brainstorm starting points (not decided)

- **Hero to Work transition:** the lens grows to fill the screen and becomes the first project's world (scrubbed), or the name scales and pins while "Selected work" slides under it.
- **Pinned project scenes:** pin each project and let scroll drive its story, instead of a static panel with a side demo. Examples:
  - Zetix: one guest goes from sign-up form, to ticket email, to door scan.
  - AI Academic Assistant: scroll runs the scheduler, then quizzes appear.
  - Outdoor event: scroll replays captures on the map with the leaderboard moving.
  Keep the demos playable at the end of each scene.
- **Scrubbed world transitions:** clip-path or circle wipes between worlds, tied to scroll progress, rather than a CSS colour fade.
- **Stack:** horizontal pan or a velocity-reactive marquee (one marquee per page at most).
- **Case study:** Flip or page transition from the project panel into the page.
- **Constraints:** honour `prefers-reduced-motion`, add mobile fallbacks via `gsap.matchMedia`, and see `.claude/skills/design-taste-frontend` sections 5.A and 5.B for sticky-stack and horizontal-pan skeletons.

## Gotchas learned the hard way

1. **Lenis + React:** `ReactLenis` creates its instance in an effect and exposes it on a later render. Read `lenisRef.current?.lenis` inside the ticker callback each frame. Capturing it once at mount left Lenis undriven, which blocked wheel, touchpad and nav scrolling.
2. **Test scrolling with real input** (`page.mouse.wheel`, clicking nav links). `window.scrollTo` bypasses Lenis and hides bugs like the one above.
3. **Don't run `next build` while `next dev` is running.** They share `.next`, and dev then serves stale CSS. If styles look old, stop dev, `rm -rf .next`, restart.
4. **Draggable:** `pointerX/Y` are page coordinates (use `pointerEvent.clientX/Y` against `getBoundingClientRect`). `isDragging` is already false in `onRelease`, so handle drops in `onDragEnd`. Draggable swallows the click after a drag, so a programmatic `.click()` won't reach React.
5. **SplitText with lazily loaded fonts:** `autoSplit` re-splits when the font arrives. Return a standalone tween from `onSplit`, not one added to a shared timeline, or the title stays hidden.
6. **React compiler lint** (eslint-config-next 16) flags `Math.random()` in handlers, `contextSafe` wrappers, and ref writes during render. Keep handlers plain and update refs in effects.
7. **Theme inside worlds:** worlds are fixed light or dark whatever the site theme is. Mermaid picks `neutral` when `data-world` is set.

## How to verify

- `npx tsc --noEmit`, `npm run lint` (2 known errors, both in unused shadcn files: `components/ui/carousel.tsx`, `hooks/use-mobile.ts`), `npx next build`.
- Playwright is installed globally (`$(npm root -g)/playwright`, Chromium at `/opt/pw-browsers`). For section shots, scroll in steps so ScrollTriggers fire in order, wait about 1.8s for world transitions, and check 1440px light and dark plus 390px.

## Open items

- Outdoor event demo access codes are placeholders (`GREEN_SECRET` etc.) in `components/work.tsx`.
- The case-study page is only restyled, not redesigned.
- `.claude/skills/` holds frontend-design, design-taste-frontend, redesign-existing-projects and the official gsap-* skills (see `SOURCES.md`).
