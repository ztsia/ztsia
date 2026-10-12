"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { Flip, gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const SLOTS = 16 // 9:00 to 17:00 in 30-minute rows

// Fixed classes the scheduler has to work around
const CLASSES = [
  { day: 0, start: 2, len: 4, label: "Lecture" },
  { day: 1, start: 0, len: 3, label: "Tutorial" },
  { day: 2, start: 8, len: 4, label: "Lab" },
  { day: 3, start: 2, len: 2, label: "Lecture" },
  { day: 4, start: 10, len: 4, label: "Lecture" },
]

// Study blocks and FSRS reviews, with the slots this run places them in
const TASKS = [
  { id: "t1", label: "Review: Morphology", kind: "review", day: 0, start: 0, len: 1 },
  { id: "t2", label: "Read: Digital Image Fundamentals", kind: "study", day: 1, start: 8, len: 3 },
  { id: "t3", label: "Review: Matrix Operations", kind: "review", day: 2, start: 1, len: 1 },
  { id: "t4", label: "Assignment draft", kind: "study", day: 3, start: 10, len: 4 },
  { id: "t5", label: "Revise: Topic 2", kind: "study", day: 4, start: 2, len: 2 },
  { id: "t6", label: "Review: Topic 5", kind: "review", day: 0, start: 12, len: 1 },
] as const

function Block({ task, placed }: { task: (typeof TASKS)[number]; placed: boolean }) {
  return (
    <div
      data-flip-id={task.id}
      style={placed ? { gridColumn: task.day + 2, gridRow: `${task.start + 2} / span ${task.len}` } : undefined}
      className={cn(
        "z-10 min-w-0 overflow-hidden rounded-md px-2 py-0.5 text-[11px] font-medium leading-tight",
        task.kind === "study" ? "bg-w-accent text-w-accent-fg" : "bg-[#c9d5ff] text-[#16246e]",
        placed ? "m-px" : "inline-flex items-center"
      )}
    >
      <span className={cn(placed && task.len === 1 ? "line-clamp-1" : "line-clamp-2")}>{task.label}</span>
    </div>
  )
}

export function SchedulerDemo() {
  const gridRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const [placed, setPlaced] = useState(false)

  const run = (next: boolean) => {
    const root = gridRef.current?.parentElement
    if (root) flipState.current = Flip.getState(root.querySelectorAll("[data-flip-id]"))
    setPlaced(next)
  }

  useLayoutEffect(() => {
    const state = flipState.current
    if (!state) return
    flipState.current = null
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const targets = gridRef.current?.parentElement?.querySelectorAll("[data-flip-id]")
    const tl = Flip.from(state, {
      duration: reduce ? 0 : 0.9,
      ease: "expo.inOut",
      stagger: reduce ? 0 : 0.09,
      absolute: true,
      targets,
    })
    return () => {
      tl.kill()
      if (targets) gsap.set(targets, { clearProps: "transform,opacity,position,top,left,width,height" })
    }
  }, [placed])

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-h-9 flex-1 flex-wrap gap-1.5" aria-label="Unscheduled tasks">
          {!placed && TASKS.map((t) => <Block key={t.id} task={t} placed={false} />)}
          {placed && <span className="self-center text-sm text-w-soft">6 of 6 placed. No overlaps.</span>}
        </div>
        <button
          type="button"
          onClick={() => run(!placed)}
          className="inline-flex h-9 items-center rounded-lg bg-w-accent px-4 text-sm font-medium text-w-accent-fg transition-transform active:scale-[0.98]"
        >
          {placed ? "Clear the week" : "Run scheduler"}
        </button>
      </div>

      <div
        ref={gridRef}
        role="img"
        aria-label={
          placed
            ? "Week view: six study blocks and reviews placed in free slots around five fixed classes"
            : "Week view with five fixed classes and empty time around them"
        }
        className="grid grid-cols-[2.25rem_repeat(5,minmax(0,1fr))] grid-rows-[1.5rem_repeat(16,1.4rem)] rounded-[8px] border border-w-rule bg-w-panel p-2"
      >
        {DAYS.map((d, i) => (
          <div key={d} style={{ gridColumn: i + 2, gridRow: 1 }} className="text-center text-xs font-medium text-w-soft">
            {d}
          </div>
        ))}
        {Array.from({ length: SLOTS / 2 }, (_, h) => (
          <div
            key={h}
            style={{ gridColumn: 1, gridRow: `${h * 2 + 2} / span 2` }}
            className="border-t border-w-rule pr-1 pt-0.5 text-right text-[10px] tabular text-w-soft"
          >
            {9 + h}
          </div>
        ))}
        {Array.from({ length: SLOTS / 2 }, (_, h) => (
          <div
            key={`line-${h}`}
            aria-hidden
            style={{ gridColumn: "2 / -1", gridRow: `${h * 2 + 2} / span 2` }}
            className="border-t border-w-rule"
          />
        ))}
        {CLASSES.map((c, i) => (
          <div
            key={i}
            style={{ gridColumn: c.day + 2, gridRow: `${c.start + 2} / span ${c.len}` }}
            className="z-10 m-px rounded-md bg-[repeating-linear-gradient(135deg,#dfe5f1_0_6px,#d3dbeb_6px_12px)] px-2 py-1 text-[11px] font-medium text-[#3d4866]"
          >
            {c.label}
          </div>
        ))}
        {placed && TASKS.map((t) => <Block key={t.id} task={t} placed />)}
      </div>

      <p className="text-xs text-w-soft">
        Illustration of the scheduling agent: a CP-SAT model places study blocks and spaced-repetition
        reviews in free time around fixed classes.
      </p>
    </div>
  )
}
