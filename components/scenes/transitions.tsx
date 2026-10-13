"use client"

import { useRef } from "react"
import { gsap, useGSAP, SCENE } from "@/lib/gsap"
import type { WorldName } from "@/components/world"
import { folioOf, projectOf, type ProjectId } from "@/lib/projects"
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

/** The project's title card, drawn in its world over the finished passage */
function Card({ to }: { to: ProjectId }) {
  const { world, title, tagline } = projectOf(to)
  return (
    <div data-card data-world={world} className="font-world absolute inset-0 grid place-items-center px-4 text-center">
      <div>
        <p data-card-bit className="tabular text-sm text-w-soft">
          {folioOf(to)}
        </p>
        <p
          data-card-bit
          className="mx-auto mt-3 max-w-[14ch] text-[clamp(3rem,9vw,9rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-w-accent"
        >
          {title}
        </p>
        <p data-card-bit className="mt-6 text-lg text-w-soft">
          {tagline}
        </p>
      </div>
    </div>
  )
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type Between = { from: WorldName; to: ProjectId }

/** Into a project about time: a month of calendar fills in, day by day */
export function CalendarPassage({ from, to }: Between) {
  return (
    <Passage
      from={from}
      build={(tl, q) => {
        tl.fromTo(
          q("[data-cell]"),
          { scale: 0 },
          { scale: 1, duration: 0.55, ease: "power3.out", stagger: { grid: [5, 7], from: 0, amount: 0.45 } },
          0
        )
          .fromTo(q("[data-day]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, stagger: 0.01 }, 0.25)
          .to(q("[data-cell]"), { borderColor: "transparent", duration: 0.25 }, 0.85)
          .to(q("[data-day]"), { autoAlpha: 0, duration: 0.2 }, 0.85)
          .fromTo(q("[data-card-bit]"), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06, ease: "expo.out" }, 0.95)
          .to({}, { duration: 0.2 })
      }}
    >
      <div data-world={projectOf(to).world} className="absolute inset-0 grid grid-cols-7 grid-rows-5">
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 2
          return (
            <div key={i} data-cell className="origin-top-left border-b border-r border-w-rule bg-w-bg p-2 text-w-soft md:p-3">
              <span data-day className="tabular text-[11px] md:text-sm">
                {i < 7 && <span className="mr-1.5 hidden md:inline">{DAYS[i]}</span>}
                {day > 0 && day <= 30 ? day : ""}
              </span>
            </div>
          )
        })}
        <Card to={to} />
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

/** Into a project about territory: the screen is captured, plot by plot */
export function CapturePassage({ from, to }: Between) {
  return (
    <Passage
      from={from}
      length={1.2}
      build={(tl, q) => {
        const plots = q("[data-plot]")
        // Plots settle on the incoming world's ground
        const ground = getComputedStyle(q("[data-plots]")[0]).getPropertyValue("--w-bg").trim()
        tl.fromTo(plots, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, stagger: 0.01 }, 0)
        ORDER.forEach((p, i) => {
          const t = 0.15 + i * 0.05
          tl.fromTo(plots[p], { backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: TEAM_COLORS[i % 4], duration: 0.04 }, t)
            .to(plots[p], { backgroundColor: ground, duration: 0.12 }, t + 0.08)
        })
        tl.to(plots, { borderColor: "transparent", duration: 0.2 }, 1.0)
          .fromTo(q("[data-card-bit]"), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06, ease: "expo.out" }, 1.0)
          .to({}, { duration: 0.2 })
      }}
    >
      <div data-plots data-world={projectOf(to).world} className="absolute inset-0">
        {PLOTS.map(([x, y, w, h], i) => (
          <div
            key={i}
            data-plot
            className="absolute border-[1.5px] border-w-fg"
            style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
          />
        ))}
      </div>
      <Card to={to} />
    </Passage>
  )
}

/** The last project back to the paper shell: sheets slide in from alternate sides */
export function PaperPassage({ from }: { from: WorldName }) {
  return (
    <Passage
      from={from}
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
