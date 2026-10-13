"use client"

import { gsap } from "@/lib/gsap"
import { SceneShell, type SceneContext } from "@/components/scenes/scene-shell"
import { cn } from "@/lib/utils"

const CHAPTERS = [
  {
    title: "Lecture notes become a knowledge graph.",
    body: "The ingestion agent pulls slides and PDFs from the university LMS, splits them into chunks by meaning, and links the concepts into a graph.",
  },
  {
    title: "A solver fits the week.",
    body: "The scheduler agent turns classes, deadlines and preferences into constraints for an OR-Tools CP-SAT model, then pauses for the student to approve before anything is saved.",
  },
  {
    title: "Quizzes chase what you're forgetting.",
    body: "The RAG agent writes questions for the weakest concepts with a three-phase chain of thought, checks them against strict rules, and FSRS schedules each review.",
  },
  {
    title: "One app, sixteen themes.",
    body: "Sixteen built-in themes and an editor for your own, across web and mobile. The walkthrough happens to be recorded in Claymorphism.",
  },
]

const FACTS = [
  { value: 6, label: "LangGraph agents" },
  { value: 19, label: "tables, all behind row-level security" },
  { value: 3, label: "asyncio background loops, no Celery" },
  { value: 4, label: "repositories: web, mobile, backend, AI service" },
]

// The app's built-in themes, from fyp-web-frontend/src/config/theme-config.ts
const THEMES = [
  { name: "Claymorphism", bg: "oklch(0.923 0.003 49)", fg: "oklch(0.280 0.037 260)", card: "oklch(0.970 0.001 106)", primary: "oklch(0.585 0.204 277)", muted: "oklch(0.923 0.003 49)", border: "oklch(0.869 0.004 56)", radius: "1.25rem", font: "sans" },
  { name: "Default", bg: "oklch(1 0 0)", fg: "oklch(0.145 0 0)", card: "oklch(1 0 0)", primary: "oklch(0.205 0 0)", muted: "oklch(0.97 0 0)", border: "oklch(0.922 0 0)", radius: "0.625rem", font: "sans" },
  { name: "Amber", bg: "oklch(1 0 0)", fg: "oklch(0.269 0 0)", card: "oklch(1 0 0)", primary: "oklch(0.769 0.165 70)", muted: "oklch(0.985 0.002 248)", border: "oklch(0.928 0.006 265)", radius: "0.375rem", font: "sans" },
  { name: "Amethyst", bg: "oklch(0.978 0.004 301)", fg: "oklch(0.365 0.033 287)", card: "oklch(1 0 0)", primary: "oklch(0.610 0.077 300)", muted: "oklch(0.891 0.014 300)", border: "oklch(0.845 0.023 300)", radius: "0.5rem", font: "sans" },
  { name: "Bubblegum", bg: "oklch(0.940 0.020 346)", fg: "oklch(0.471 0 0)", card: "oklch(0.950 0.050 87)", primary: "oklch(0.621 0.180 348)", muted: "oklch(0.880 0.050 212)", border: "oklch(0.621 0.180 348)", radius: "0.4rem", font: "sans" },
  { name: "Caffeine", bg: "oklch(0.982 0 0)", fg: "oklch(0.244 0 0)", card: "oklch(0.991 0 0)", primary: "oklch(0.434 0.039 42)", muted: "oklch(0.952 0 0)", border: "oklch(0.882 0 0)", radius: "0.5rem", font: "sans" },
  { name: "Claude", bg: "oklch(0.982 0.005 95)", fg: "oklch(0.344 0.027 96)", card: "oklch(0.982 0.005 95)", primary: "oklch(0.617 0.138 39)", muted: "oklch(0.934 0.015 90)", border: "oklch(0.885 0.007 97)", radius: "0.5rem", font: "sans" },
  { name: "Dark Matter", bg: "oklch(1 0 0)", fg: "oklch(0.210 0.032 265)", card: "oklch(1 0 0)", primary: "oklch(0.672 0.137 49)", muted: "oklch(0.967 0.003 265)", border: "oklch(0.928 0.006 265)", radius: "0.75rem", font: "mono" },
  { name: "Graphite", bg: "oklch(0.955 0 0)", fg: "oklch(0.321 0 0)", card: "oklch(0.970 0 0)", primary: "oklch(0.489 0 0)", muted: "oklch(0.885 0 0)", border: "oklch(0.858 0 0)", radius: "0.35rem", font: "sans" },
  { name: "Modern Minimal", bg: "oklch(1 0 0)", fg: "oklch(0.321 0 0)", card: "oklch(1 0 0)", primary: "oklch(0.623 0.188 260)", muted: "oklch(0.985 0.002 248)", border: "oklch(0.928 0.006 265)", radius: "0.375rem", font: "sans" },
  { name: "Notebook", bg: "oklch(0.982 0 0)", fg: "oklch(0.349 0 0)", card: "oklch(1 0 0)", primary: "oklch(0.489 0 0)", muted: "oklch(0.916 0 0)", border: "oklch(0.554 0.003 17)", radius: "0.625rem", font: "hand" },
  { name: "Pastel Dreams", bg: "oklch(0.969 0.009 315)", fg: "oklch(0.373 0.031 260)", card: "oklch(1 0 0)", primary: "oklch(0.709 0.159 294)", muted: "oklch(0.946 0.033 307)", border: "oklch(0.907 0.053 306)", radius: "1.5rem", font: "sans" },
  { name: "Starry Night", bg: "oklch(0.976 0.005 258)", fg: "oklch(0.256 0.043 268)", card: "oklch(0.934 0.013 252)", primary: "oklch(0.482 0.118 263)", muted: "oklch(0.920 0.008 107)", border: "oklch(0.779 0.016 251)", radius: "0.5rem", font: "serif" },
  { name: "Supabase", bg: "oklch(0.991 0 0)", fg: "oklch(0.205 0 0)", card: "oklch(0.991 0 0)", primary: "oklch(0.835 0.130 161)", muted: "oklch(0.946 0 0)", border: "oklch(0.904 0 0)", radius: "0.5rem", font: "sans" },
  { name: "Vercel", bg: "oklch(0.990 0 0)", fg: "oklch(0 0 0)", card: "oklch(1 0 0)", primary: "oklch(0 0 0)", muted: "oklch(0.970 0 0)", border: "oklch(0.920 0 0)", radius: "0.5rem", font: "sans" },
  { name: "Vintage Paper", bg: "oklch(0.958 0.015 90)", fg: "oklch(0.376 0.023 64)", card: "oklch(0.991 0.010 87)", primary: "oklch(0.618 0.078 66)", muted: "oklch(0.924 0.019 83)", border: "oklch(0.861 0.032 85)", radius: "0.25rem", font: "serif" },
]

const FONTS: Record<string, string> = {
  sans: "var(--font-geist), ui-sans-serif, sans-serif",
  mono: "var(--font-jetbrains-mono), ui-monospace, monospace",
  serif: "ui-serif, Georgia, serif",
  hand: '"Comic Sans MS", "Chalkboard SE", cursive',
}

function themeVars(t: (typeof THEMES)[number]) {
  const light = Number(t.primary.match(/oklch\(([\d.]+)/)?.[1] ?? 0) > 0.7
  return {
    "--a-bg": t.bg,
    "--a-fg": t.fg,
    "--a-card": t.card,
    "--a-primary": t.primary,
    "--a-primary-fg": light ? "oklch(0.2 0 0)" : "oklch(0.99 0 0)",
    "--a-muted": t.muted,
    "--a-border": t.border,
    "--a-radius": t.radius,
    "--a-font": FONTS[t.font],
  }
}

const NODES = [
  { id: "se", label: "Structuring element", x: 50, y: 50 },
  { id: "er", label: "Erosion", x: 18, y: 22 },
  { id: "di", label: "Dilation", x: 82, y: 22 },
  { id: "op", label: "Opening", x: 18, y: 80 },
  { id: "cl", label: "Closing", x: 82, y: 80 },
  { id: "nr", label: "Noise removal", x: 50, y: 96 },
]
const EDGES = [
  ["se", "er"], ["se", "di"], ["er", "op"], ["di", "op"], ["er", "cl"], ["di", "cl"], ["op", "nr"], ["cl", "nr"],
]

const CLASSES = [
  { day: 0, start: 2, len: 4, label: "Lecture" },
  { day: 1, start: 0, len: 3, label: "Tutorial" },
  { day: 2, start: 7, len: 4, label: "Lab" },
  { day: 3, start: 2, len: 2, label: "Lecture" },
  { day: 4, start: 8, len: 4, label: "Lecture" },
]
const TASKS = [
  { label: "Review: Morphology", day: 0, start: 0, len: 2, review: true },
  { label: "Read: Image fundamentals", day: 1, start: 6, len: 3 },
  { label: "Review: Matrices", day: 2, start: 1, len: 2, review: true },
  { label: "Assignment draft", day: 3, start: 7, len: 4 },
  { label: "Revise: Topic 2", day: 4, start: 2, len: 3 },
  { label: "Review: Topic 5", day: 0, start: 9, len: 2, review: true },
]
const ROWS = 12
const OPTIONS = ["Dilation", "Erosion", "Opening", "Closing"]

function animate(tl: gsap.core.Timeline, { q, mobile }: SceneContext) {
  const [app] = q("[data-app]")
  const lines = q("[data-line]")

  // 1. Chunk the notes, then grow the graph
  tl.fromTo(app, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.12, ease: "power2.out" }, 0)
    .fromTo(q("[data-chunk-mark]"), { scaleY: 0 }, { scaleY: 1, duration: 0.08, stagger: 0.08 }, 0.08)
    .fromTo(lines, { opacity: 0.35 }, { opacity: 1, duration: 0.04, stagger: 0.02 }, 0.08)
    .fromTo(
      q("[data-chunk]"),
      { x: mobile ? 0 : -120, y: mobile ? -60 : 0, autoAlpha: 0, scale: 0.8 },
      { x: 0, y: 0, autoAlpha: 1, scale: 1, duration: 0.12, stagger: 0.07, ease: "power3.out" },
      0.3
    )
    .to(q("[data-chunk]"), { autoAlpha: 0, scale: 0.6, duration: 0.08, stagger: 0.03 }, 0.55)
    .fromTo(q("[data-edge]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.14, stagger: 0.025 }, 0.58)
    .fromTo(q("[data-node]"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.08, stagger: 0.03, ease: "back.out(2.5)" }, 0.58)
    .to(q("[data-view-ingest]"), { autoAlpha: 0, y: -30, duration: 0.12, ease: "power2.in" }, 0.9)

  // 2. The solver places the week, then waits for a yes
  tl.fromTo(q("[data-view-week]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 1.0)
    .fromTo(q("[data-class]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08, stagger: 0.02 }, 1.06)
    .fromTo(
      q("[data-task]"),
      { y: -260, rotate: (i) => (i % 2 ? 8 : -8), autoAlpha: 0 },
      { y: 0, rotate: 0, autoAlpha: 1, duration: 0.18, stagger: 0.06, ease: "power3.out" },
      1.18
    )
    .fromTo(q("[data-solver]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 1.55)
    .to(q("[data-approve]"), { scale: 0.92, duration: 0.03, yoyo: true, repeat: 1 }, 1.72)
    .to(q("[data-approve-label]"), { yPercent: -50, duration: 0.03 }, 1.74)
    .to(q("[data-view-week]"), { autoAlpha: 0, y: -30, duration: 0.12, ease: "power2.in" }, 1.9)

  // 3. A quiz on the weakest concept, and its forgetting curve
  tl.fromTo(q("[data-view-quiz]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 2.0)
    .fromTo(q("[data-option]"), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.08, stagger: 0.04 }, 2.08)
    .to(q("[data-option-pick]"), { attr: { "data-picked": "true" }, duration: 0.01 }, 2.36)
    .fromTo(q("[data-rationale]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 2.42)
    .fromTo(q("[data-curve]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, 2.3)
    .fromTo(q("[data-review]"), { scale: 0 }, { scale: 1, duration: 0.05, stagger: 0.1, ease: "back.out(3)" }, 2.38)
    .to(q("[data-view-quiz]"), { autoAlpha: 0, y: -30, duration: 0.12, ease: "power2.in" }, 2.88)

  // 4. Back to the week, and through every theme
  tl.to(q("[data-view-week]"), { autoAlpha: 1, y: 0, duration: 0.12 }, 2.98)
  const label = q("[data-theme-name]")[0]
  const count = q("[data-theme-count]")[0]
  const pick = { i: 0 }
  let current = 0
  const apply = (k: number) => {
    if (k === current) return
    current = k
    const vars = themeVars(THEMES[k])
    for (const [key, v] of Object.entries(vars)) app.style.setProperty(key, v)
    label.textContent = THEMES[k].name
    count.textContent = String(k + 1)
  }
  tl.fromTo(q("[data-theme-pill]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 3.04)
    .fromTo(
      pick,
      { i: 0 },
      { i: THEMES.length - 1, duration: 0.78, onUpdate: () => apply(Math.round(pick.i)) },
      3.08
    )
}

function App() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        data-app
        style={{ ...themeVars(THEMES[0]), fontFamily: "var(--a-font)" } as React.CSSProperties}
        className="a-themed relative flex size-full max-w-[44rem] md:aspect-[4/3] md:h-auto md:max-h-full overflow-hidden rounded-[calc(var(--a-radius)*1.2)] border border-[var(--a-border)] bg-[var(--a-bg)] text-[var(--a-fg)] shadow-[0_40px_80px_-40px_rgba(15,26,58,0.45)]"
      >
        <aside className="a-themed hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-[var(--a-border)] bg-[var(--a-card)] py-4 sm:flex">
          <span className="a-themed size-7 rounded-[var(--a-radius)] bg-[var(--a-primary)]" />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cn("a-themed size-6 rounded-[calc(var(--a-radius)*0.6)] bg-[var(--a-muted)]", i === 1 && "outline outline-2 outline-[var(--a-primary)]")} />
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="a-themed flex items-center justify-between border-b border-[var(--a-border)] px-4 py-2.5 text-[12px]">
            <span className="font-semibold">Week 6</span>
            <span data-theme-pill className="a-themed invisible rounded-full bg-[var(--a-muted)] px-2.5 py-0.5">
              Theme: <span data-theme-name>Claymorphism</span>{" "}
              <span className="opacity-60">
                (<span data-theme-count className="tabular">1</span>/16)
              </span>
            </span>
          </header>
          <div className="relative min-h-0 flex-1 p-3 sm:p-4">
            <IngestView />
            <WeekView />
            <QuizView />
          </div>
        </div>
      </div>
    </div>
  )
}

function IngestView() {
  return (
    <div data-view-ingest className="absolute inset-3 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 sm:inset-4">
      <div className="a-themed flex min-h-0 flex-col rounded-[var(--a-radius)] border border-[var(--a-border)] bg-[var(--a-card)] p-3">
        <p className="truncate text-[11px] font-semibold">Week 3: Morphological operations.pdf</p>
        <p className="text-[10px] opacity-60">Synced from the LMS</p>
        <div className="mt-3 grid flex-1 content-start gap-1.5">
          {[0, 1, 2].map((c) => (
            <div key={c} className="relative grid gap-1.5 pl-2.5">
              <span data-chunk-mark className="a-themed absolute inset-y-0 left-0 w-[3px] origin-top rounded-full bg-[var(--a-primary)]" />
              {[92, 78, 85].map((w, i) => (
                <span key={i} data-line className="a-themed h-[6px] rounded-full bg-[var(--a-muted)] ring-1 ring-inset ring-[var(--a-border)]" style={{ width: `${w - c * 6 - i * 4}%` }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="relative min-h-0">
        <div className="absolute inset-0 grid content-center gap-2">
          {["Chunk 1: erosion and dilation", "Chunk 2: opening and closing", "Chunk 3: structuring elements"].map((c) => (
            <span key={c} data-chunk className="a-themed invisible rounded-[var(--a-radius)] bg-[var(--a-primary)] px-3 py-2 text-[11px] font-medium text-[var(--a-primary-fg)]">
              {c}
            </span>
          ))}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-[8%] size-[84%] overflow-visible" aria-hidden>
          {EDGES.map(([a, b]) => {
            const A = NODES.find((n) => n.id === a)!
            const B = NODES.find((n) => n.id === b)!
            return (
              <line
                key={a + b}
                data-edge
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
                vectorEffect="non-scaling-stroke"
                className="a-themed stroke-[var(--a-fg)] opacity-40"
                strokeWidth={1.25}
              />
            )
          })}
        </svg>
        {NODES.map((n) => (
          <span
            key={n.id}
            data-node
            style={{ left: `${8 + n.x * 0.84}%`, top: `${8 + n.y * 0.84}%` }}
            className={cn(
              "a-themed invisible absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--a-border)] px-2 py-0.5 text-[10px] font-medium",
              n.id === "se" ? "bg-[var(--a-primary)] text-[var(--a-primary-fg)]" : "bg-[var(--a-card)]"
            )}
          >
            {n.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function WeekView() {
  return (
    <div data-view-week className="invisible absolute inset-3 flex flex-col sm:inset-4">
      <div
        className="a-themed grid min-h-0 flex-1 grid-cols-[1.6rem_repeat(5,minmax(0,1fr))] gap-x-1 rounded-[var(--a-radius)] border border-[var(--a-border)] bg-[var(--a-card)] p-2"
        style={{ gridTemplateRows: `1.2rem repeat(${ROWS}, minmax(0,1fr))` }}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
          <span key={d} style={{ gridColumn: i + 2, gridRow: 1 }} className="text-center text-[10px] font-medium opacity-60">
            {d}
          </span>
        ))}
        {Array.from({ length: ROWS / 2 }, (_, h) => (
          <span key={h} style={{ gridColumn: 1, gridRow: `${h * 2 + 2} / span 2` }} className="a-themed border-t border-[var(--a-border)] text-[9px] tabular opacity-60">
            {9 + h}
          </span>
        ))}
        {CLASSES.map((c, i) => (
          <span
            key={i}
            data-class
            style={{ gridColumn: c.day + 2, gridRow: `${c.start + 2} / span ${c.len}` }}
            className="a-themed m-px rounded-[calc(var(--a-radius)*0.6)] bg-[var(--a-muted)] px-1.5 py-0.5 text-[9px] font-medium opacity-80 ring-1 ring-inset ring-[var(--a-border)] sm:text-[10px]"
          >
            {c.label}
          </span>
        ))}
        {TASKS.map((t, i) => (
          <span
            key={i}
            data-task
            style={{ gridColumn: t.day + 2, gridRow: `${t.start + 2} / span ${t.len}` }}
            className={cn(
              "a-themed m-px overflow-hidden rounded-[calc(var(--a-radius)*0.6)] px-1.5 py-0.5 text-[9px] font-medium leading-tight sm:text-[10px]",
              t.review
                ? "border border-dashed border-[var(--a-primary)] bg-[var(--a-card)] text-[var(--a-fg)]"
                : "bg-[var(--a-primary)] text-[var(--a-primary-fg)]"
            )}
          >
            <span className="line-clamp-2">{t.label}</span>
          </span>
        ))}
      </div>
      <div data-solver className="invisible mt-2 flex items-center justify-between gap-2 text-[11px]">
        <span className="truncate opacity-70">CP-SAT: 6 of 6 placed, no overlaps</span>
        <span
          data-approve
          className="a-themed relative h-[1.9em] shrink-0 overflow-hidden rounded-[var(--a-radius)] bg-[var(--a-primary)] px-3 font-semibold text-[var(--a-primary-fg)]"
        >
          <span data-approve-label className="flex flex-col leading-[1.9em]">
            <span>Approve plan</span>
            <span>Saved</span>
          </span>
        </span>
      </div>
    </div>
  )
}

function QuizView() {
  return (
    <div data-view-quiz className="invisible absolute inset-3 grid content-start gap-3 sm:inset-4 sm:content-stretch sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="a-themed flex min-h-0 flex-col rounded-[var(--a-radius)] border border-[var(--a-border)] bg-[var(--a-card)] p-3">
        <p className="text-[10px] uppercase tracking-[0.1em] opacity-60">Weakest concept: Opening</p>
        <p className="mt-1.5 text-[12px] font-semibold leading-snug sm:text-[13px]">
          Which operation removes small bright specks while keeping larger shapes?
        </p>
        <div className="mt-3 grid gap-1.5">
          {OPTIONS.map((o) => (
            <span
              key={o}
              data-option
              {...(o === "Opening" ? { "data-option-pick": "", "data-picked": "false" } : {})}
              className="a-themed group rounded-[calc(var(--a-radius)*0.7)] border border-[var(--a-border)] px-2.5 py-1.5 text-[11px] data-[picked=true]:border-[#16a34a] data-[picked=true]:bg-[#16a34a] data-[picked=true]:text-white"
            >
              {o}
            </span>
          ))}
        </div>
        <p data-rationale className="invisible mt-2 text-[10px] leading-snug opacity-70">
          Erosion removes the specks, then dilation restores what survived.
        </p>
      </div>
      <div className="a-themed hidden min-h-0 flex-col rounded-[var(--a-radius)] border border-[var(--a-border)] bg-[var(--a-card)] p-3 sm:flex">
        <p className="text-[10px] uppercase tracking-[0.1em] opacity-60">Recall over time</p>
        <svg viewBox="0 0 200 120" className="mt-2 w-full flex-1 overflow-visible" aria-hidden>
          <line x1="0" y1="110" x2="200" y2="110" className="a-themed stroke-[var(--a-border)]" />
          <path
            data-curve
            d="M0 10 C 20 50, 30 70, 48 78 L48 12 C 72 40, 88 56, 104 62 L104 14 C 136 30, 160 42, 196 48"
            fill="none"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            strokeWidth={2.5}
            className="a-themed stroke-[var(--a-primary)]"
          />
          {[48, 104].map((x) => (
            <circle key={x} data-review cx={x} cy={12} r={4.5} className="a-themed origin-center fill-[var(--a-primary)] [transform-box:fill-box]" />
          ))}
        </svg>
        <p className="text-[10px] leading-snug opacity-70">Each review resets the curve, and the gaps grow.</p>
      </div>
    </div>
  )
}

export function StudyScene({ children }: { children: React.ReactNode }) {
  return (
    <SceneShell
      id="assistant"
      world="study"
      index="02 / 03"
      title="AI Academic Assistant"
      chapters={CHAPTERS}
      facts={FACTS}
      factsNote="Final year project, UTAR. The scenes above are illustrations of how each agent works."
      stage={<App />}
      animate={animate}
    >
      {children}
    </SceneShell>
  )
}
