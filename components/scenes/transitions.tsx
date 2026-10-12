"use client"

import { useRef } from "react"
import { gsap, useGSAP, SCENE } from "@/lib/gsap"
import type { WorldName } from "@/components/world"
import { cn } from "@/lib/utils"

/**
 * A pinned screen between two worlds. It starts in `from`, and scrolling
 * builds `to` over it in that project's own idiom; the next section then
 * starts on `to`'s ground, so the hand-over has no seam. With reduced motion
 * it collapses to nothing.
 */
function Passage({
  from,
  className,
  children,
  build,
  length = 1.1,
}: {
  from: WorldName | "paper"
  className?: string
  children: React.ReactNode
  build: (tl: gsap.core.Timeline, q: (s: string) => HTMLElement[]) => void
  length?: number
}) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const mm = gsap.matchMedia()
      mm.add(SCENE, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${window.innerHeight * length}`,
            pin: true,
            scrub: 0.6,
          },
        })
        build(tl, (s) => gsap.utils.toArray<HTMLElement>(s, el))
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div
      ref={root}
      aria-hidden
      {...(from === "paper" ? {} : { "data-world": from })}
      className={cn("scene-only world-paint relative h-[100svh] overflow-hidden", className)}
    >
      {children}
    </div>
  )
}

function Card({ index, title, sub, className }: { index: string; title: string; sub: string; className?: string }) {
  return (
    <div data-card className={cn("font-world absolute inset-0 grid place-items-center px-4 text-center", className)}>
      <div>
        <p data-card-bit className="tabular text-sm text-w-soft">
          {index}
        </p>
        <p
          data-card-bit
          className="mx-auto mt-3 max-w-[14ch] text-[clamp(3rem,9vw,9rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-w-accent"
        >
          {title}
        </p>
        <p data-card-bit className="mt-6 text-lg text-w-soft">
          {sub}
        </p>
      </div>
    </div>
  )
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/** Zetix to the AI Academic Assistant: a month of calendar fills in, day by day */
export function CalendarPassage() {
  return (
    <Passage
      from="zetix"
      build={(tl, q) => {
        tl.fromTo(
          q("[data-cell]"),
          { scale: 0 },
          { scale: 1, duration: 0.55, ease: "power3.out", stagger: { grid: [5, 7], from: 0, amount: 0.45 } },
          0
        )
          .fromTo(q("[data-day]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, stagger: 0.01 }, 0.25)
          .to(q("[data-cell]"), { borderColor: "rgba(201,212,232,0)", duration: 0.25 }, 0.85)
          .to(q("[data-day]"), { autoAlpha: 0, duration: 0.2 }, 0.85)
          .fromTo(q("[data-card-bit]"), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06, ease: "expo.out" }, 0.95)
          .to({}, { duration: 0.2 })
      }}
    >
      <div data-world="study" className="absolute inset-0 grid grid-cols-7 grid-rows-5">
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 2
          return (
            <div key={i} data-cell className="origin-top-left border-b border-r border-[#c9d4e8] bg-w-bg p-2 text-w-soft md:p-3">
              <span data-day className="tabular text-[11px] md:text-sm">
                {i < 7 && <span className="mr-1.5 hidden md:inline">{DAYS[i]}</span>}
                {day > 0 && day <= 30 ? day : ""}
              </span>
            </div>
          )
        })}
        <div data-world="study" className="contents">
          <Card index="02 / 03" title="AI Academic Assistant" sub="Six agents and a solver, planning a student's week" />
        </div>
      </div>
    </Passage>
  )
}

// Tiles of the screen, in %, like plots on a site map
const PLOTS = [
  [0, 0, 22, 38], [22, 0, 30, 20], [22, 20, 30, 18], [52, 0, 18, 38], [70, 0, 30, 24], [70, 24, 30, 14],
  [0, 38, 14, 32], [14, 38, 26, 32], [40, 38, 22, 16], [40, 54, 22, 16], [62, 38, 38, 32],
  [0, 70, 34, 30], [34, 70, 20, 30], [54, 70, 24, 30], [78, 70, 22, 30],
]
const TEAM_COLORS = ["#1f9a55", "#2e67dc", "#8248d8", "#d93a31"]
// A fixed shuffle, so the captures land in the same order every time
const ORDER = [6, 2, 11, 9, 0, 13, 4, 7, 14, 1, 10, 3, 12, 5, 8]

/** The AI Academic Assistant to the outdoor event: the screen is captured, plot by plot */
export function CapturePassage() {
  return (
    <Passage
      from="study"
      length={1.2}
      build={(tl, q) => {
        const plots = q("[data-plot]")
        tl.fromTo(plots, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, stagger: 0.01 }, 0)
        ORDER.forEach((p, i) => {
          const t = 0.15 + i * 0.05
          tl.fromTo(plots[p], { backgroundColor: "rgba(255,216,74,0)" }, { backgroundColor: TEAM_COLORS[i % 4], duration: 0.04 }, t)
            .to(plots[p], { backgroundColor: "#ffd84a", duration: 0.12 }, t + 0.08)
        })
        tl.to(plots, { borderColor: "rgba(23,21,12,0)", duration: 0.2 }, 1.0)
          .fromTo(q("[data-card-bit]"), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06, ease: "expo.out" }, 1.0)
          .to({}, { duration: 0.2 })
      }}
    >
      <div className="absolute inset-0">
        {PLOTS.map(([x, y, w, h], i) => (
          <div
            key={i}
            data-plot
            className="absolute border-[1.5px] border-[#17150c]"
            style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
          />
        ))}
      </div>
      <div data-world="field" className="contents">
        <Card index="03 / 03" title="Real-time outdoor event system" sub="Sixty players, one live map" className="[&_p]:text-w-fg" />
      </div>
    </Passage>
  )
}

/** The outdoor event back to the paper shell: sheets slide in from alternate sides */
export function PaperPassage() {
  return (
    <Passage
      from="field"
      length={0.8}
      build={(tl, q) => {
        tl.fromTo(
          q("[data-sheet]"),
          { xPercent: (i) => (i % 2 ? 101 : -101) },
          { xPercent: 0, duration: 0.6, ease: "power3.inOut", stagger: 0.07 },
          0
        ).to({}, { duration: 0.15 })
      }}
    >
      <div className="absolute inset-0 grid grid-rows-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} data-sheet className="-my-px bg-[var(--paper)]" />
        ))}
      </div>
    </Passage>
  )
}
