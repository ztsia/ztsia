# Portfolio redesign: handoff

State as of 12 Oct 2026 (round 2). Branch `claude/trusting-lamport-9qc5q6`, PR ztsia/ztsia#4 (open, Vercel preview builds from it).

## What the owner wants

- The portfolio is the first thing most people see of Sia, so it should **impress and surprise**, at the level of current AI-built motion sites. The Zetix landing page (zetix.vercel.app) is the floor, not the ceiling.
- **GSAP + Lenis**, not Motion. Don't mix the two.
- Branding must be about Sia, **not tied to one project** (no Zetix figures in the hero, no "on the night" copy) and **not about music** (an earlier "violin strings" concept was dropped; Concertmaster stays as one timeline line).
- **Each project gets its own look when scrolled to.** The site's own look is "Index": paper and ink only, Archivo variable width. Chosen from three concepts (Index, Systems, Poster); the concept board is at https://claude.ai/artifact/9k1pMRhpKzQMsuvXo6ySAW.
- Liked the Poster lens interaction, but worried hidden text goes unread, so everything under the lens is also listed in plain text (Stack section).
- The AI Academic Assistant and outdoor event UIs were not great visually, and the AI Academic Assistant had several themes (the walkthrough happens to use the claymorphism one). So those worlds are art-directed from what the project does, not copied from its UI.

## Round 2: scroll choreography (12 Oct 2026)

The owner's verdict on round 1 was "more alive, but just colours and some interaction; where are GSAP and Lenis?". Round 2 rebuilt the home page as one scroll-driven sequence. Real material came from the project repos (`ztsia/zetix`, `fyp-web-frontend`, `fyp-ai-service`, `outdoor-game-manager-app`).

| Beat | File | What scroll does |
|---|---|---|
| Hero dive | `components/hero.tsx` | Pins; the name scales into the stem of the T (origin set from the T's offsets when the dive starts) until its ink fills the screen. The lens still works before you scroll |
| Index | `components/work-index.tsx` | Ink table of contents; rows rise in. Hover fills a row in its project's colour, and a thumbnail trails the cursor. Pinned: the other rows leave, row 01 opens from its foot into a window that grows to full screen in Zetix's world (a ghost copy of the list keeps the title in place) |
| Scenes | `components/scenes/scene-shell.tsx` | Shared shell: pins a 100svh stage, one timeline unit per chapter, captions hand over, a progress rule, then the real numbers count up, then the playground (demo, links, walkthrough) scrolls in. Static `.scene-static` copy for reduced motion / no JS |
| Zetix | `components/scenes/zetix-scene.tsx` | Oriana Abernethy (the name on the real ticket screenshot) fills the form; two parties race for the last 5 seats under the lock (the real `claim_seats` `for update of s` SQL); the real ticket page arrives; the door scans, signal drops, offline admit, sync |
| Passages | `components/scenes/transitions.tsx` | Calendar month fills in (into study); the screen is captured plot by plot in team colours (into field); paper sheets slide in from alternate sides (back to the shell) |
| AI Academic Assistant | `components/scenes/study-scene.tsx` | Mock app window: notes chunked into a knowledge graph; tasks drop into the week, then "Approve plan"; quiz on the weakest concept with a forgetting curve; then the window re-skins through all 16 real themes from `theme-config.ts` |
| Outdoor event | `components/scenes/field-scene.tsx` | The real venue map (traced from the app's `map.png`) draws itself; captures replay with a re-sorting leaderboard; the transaction race in slow motion; three role-tier devices |
| Stack | `components/skills.tsx` | Two bands of huge type drifting, speeding up, reversing and widening on the wdth axis with Lenis velocity |
| Contact | `components/contact.tsx` | Rises from under the page; email letters reveal, then widen near the cursor (the hero lens, once more) |
| Folio | `components/folio.tsx` | Fixed bottom corners, blend-difference: chapter number and name (rolls on change) and page percentage |
| Nav | `components/navbar.tsx` | No ground; `mix-blend-difference` so it reads over every world |

Worlds: palettes now apply to any `[data-world]` element, not only `<html>`. Sections paint themselves with `.world-paint`, which is what lets transitions wipe between worlds. `worldTrigger()` in `components/world.tsx` still mirrors the current world onto `<html>` for dialogs. There's a new `ink` world (the shell inverted) for the index.

Assets: `public/scenes/zetix-*.webp`, converted from `zetix/docs/screenshots`.

## Adding a project

`lib/projects.ts` is the one list. Its order is the page order, and everything countable comes from it: the index rows and their numbers, "Three projects", every "02 / 03", the scene titles and anchors, the opening window (always the first project), the passages between neighbours, and the folio.

1. Add an entry to `PROJECTS` in `lib/projects.ts`: `id`, `world`, `title`, index-row text, `tagline` and `thumb`.
2. Add its palette as `[data-world="name"]` in `app/globals.css`, and add the name to `WorldName` in `components/world.tsx`.
3. Write `components/scenes/<name>-scene.tsx`:
   - Render `<SceneShell project="<id>">` with chapters, facts, a stage, and `animate(tl, ctx)`. `animate` adds tweens at `ctx.at(i)`, one timeline unit per chapter.
   - Put mock screens inside `<Fit width height>` (`components/scenes/fit.tsx`). Build them at one design size and they scale to the stage on phones.
4. Add an entry for it in `SHOWCASES` in `components/work.tsx`:
   - `Passage`, which leads into it from the previous project: `CalendarPassage`, `CapturePassage`, or a new one built on `Passage` in `transitions.tsx`.
   - `Scene`, its scene wrapping a `<Playground>` with the demo.

   `SHOWCASES` is typed `Record<ProjectId, …>`, so the build fails if a project has no showcase.

Reordering projects is reordering `PROJECTS`. Passages take their `from` world from the previous project and their card from the incoming one.

## Ideas not done yet

- The case-study page is still only restyled. A Flip or page transition from the study scene into it would fit.
- About is quiet: just the word fill plus the timeline. It could pin and stack the timeline as index cards.
- Scenes are long (about 4.7 viewports each on desktop). Consider a "skip to demo" link in each scene header if visitors find them slow.

## Gotchas learned the hard way

1. **Lenis + React:** `ReactLenis` creates its instance in an effect and exposes it on a later render. Read `lenisRef.current?.lenis` inside the ticker callback each frame. Capturing it once at mount left Lenis undriven, which blocked wheel, touchpad and nav scrolling.
2. **Test scrolling with real input** (`page.mouse.wheel`, clicking nav links). `window.scrollTo` bypasses Lenis and hides bugs like the one above.
3. **Don't run `next build` while `next dev` is running.** They share `.next`, and dev then serves stale CSS. If styles look old, stop dev, `rm -rf .next`, restart.
4. **Draggable:** `pointerX/Y` are page coordinates (use `pointerEvent.clientX/Y` against `getBoundingClientRect`). `isDragging` is already false in `onRelease`, so handle drops in `onDragEnd`. Draggable swallows the click after a drag, so a programmatic `.click()` won't reach React.
5. **SplitText with lazily loaded fonts:** `autoSplit` re-splits when the font arrives. Return a standalone tween from `onSplit`, not one added to a shared timeline, or the title stays hidden.
6. **React compiler lint** (eslint-config-next 16) flags `Math.random()` in handlers, `contextSafe` wrappers, and ref writes during render. Keep handlers plain and update refs in effects.
7. **Theme inside worlds:** worlds are fixed light or dark whatever the site theme is. Mermaid picks `neutral` when `data-world` is set.
8. **`gsap.utils.toArray(selector)` inside `useGSAP` is scoped** to the context's scope. To search the whole page, use `document.querySelectorAll` (see the folio).
9. **A trigger on an element that pins itself ends early**: its `bottom` ignores its own pin. Pin an inner `[data-pin]` wrapper and put world and chapter triggers on the outer section (index, scenes).
10. **World and chapter triggers use `refreshPriority: -1`** so they're computed after every pin, whatever order components mounted in.
11. **Tailwind v4 `scale-*` / `translate-*` use the CSS `scale` / `translate` properties**, which stack with GSAP's `transform`. Don't put them on elements GSAP transforms.
12. **Layout-level components mount before the streamed page.** Anything that reads page sections (the folio) lives in `app/page.tsx`.
13. **Dev only:** `window.ScrollTrigger` is exposed (`lib/gsap.ts`) so Playwright can read pin positions.

## How to verify

- `npx tsc --noEmit`, `npm run lint` (2 known errors, both in unused shadcn files: `components/ui/carousel.tsx`, `hooks/use-mobile.ts`), `npx next build`.
- Tour script approach: open `/`, read `ScrollTrigger.getAll()` pin starts and ends, then `scrollTo` sample positions and wait about 900ms each (scrub is 0.6 to 0.7). Do one pass with `reducedMotion: "reduce"` (expect plain lists, no pins) and one real-wheel pass.
- Playwright is installed globally (`$(npm root -g)/playwright`, Chromium at `/opt/pw-browsers`). For section shots, scroll in steps so ScrollTriggers fire in order, wait about 1.8s for world transitions, and check 1440px light and dark plus 390px.

## Open items

- Outdoor event demo access codes are placeholders (`GREEN_SECRET` etc.) in `components/work.tsx`.
- The case-study page is only restyled, not redesigned.
- `.claude/skills/` holds frontend-design, design-taste-frontend, redesign-existing-projects and the official gsap-* skills (see `SOURCES.md`).
