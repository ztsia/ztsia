"use client"

import { useRef } from "react"
import { gsap, useGSAP, SCENE } from "@/lib/gsap"
import { worldTrigger, type WorldName } from "@/components/world"
import { cn } from "@/lib/utils"

export type Chapter = { title: string; body: string }
export type Fact = { value: number; label: string }

export type SceneContext = {
  /** Timeline position where chapter i starts; chapters are one unit long */
  at: (i: number) => number
  /** Scoped selector into the stage */
  q: (selector: string) => HTMLElement[]
  stage: HTMLElement
  mobile: boolean
}

/**
 * A project told by scrolling. The screen pins; each chapter's caption comes
 * up beside a stage the project animates on the same timeline, then the
 * project's real numbers count up, and the pin lets go onto its playground.
 *
 * With reduced motion (or no JS) the same chapters render as a plain list and
 * the stage is skipped; the playground below carries the visuals.
 */
export function SceneShell({
  id,
  world,
  index,
  title,
  chapters,
  facts,
  factsNote,
  stage,
  animate,
  children,
}: {
  id: string
  world: WorldName
  index: string
  title: string
  chapters: Chapter[]
  facts: Fact[]
  factsNote?: string
  stage: React.ReactNode
  animate: (tl: gsap.core.Timeline, ctx: SceneContext) => void
  children: React.ReactNode
}) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = root.current!
      const mm = gsap.matchMedia()
      mm.add(SCENE, (c) => {
        const mobile = Boolean(c.conditions?.mobile)
        const pin = section.querySelector<HTMLElement>("[data-pin]")!
        const stageEl = section.querySelector<HTMLElement>("[data-stage]")!
        const n = chapters.length
        const total = n + 1.2

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${window.innerHeight * total * (mobile ? 0.75 : 0.9)}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })

        // Captions hand over at each chapter boundary (one set per layout)
        gsap.utils.toArray<HTMLElement>("[data-caps]", section).forEach((set) => {
          gsap.utils.toArray<HTMLElement>("[data-cap]", set).forEach((cap, i) => {
            if (i > 0) tl.fromTo(cap, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" }, i)
            tl.to(cap, { autoAlpha: 0, y: -40, duration: 0.2, ease: "power2.in" }, i === n - 1 ? n : i + 0.78)
          })
        })
        tl.fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, duration: total }, 0)

        animate(tl, {
          at: (i) => i,
          q: (s) => gsap.utils.toArray<HTMLElement>(s, stageEl),
          stage: stageEl,
          mobile,
        })

        // Finale: the stage steps back and the numbers count up
        tl.to(stageEl, { autoAlpha: 0, scale: 0.94, duration: 0.3, ease: "power2.in" }, n)
        tl.fromTo("[data-facts]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, n + 0.05)
        gsap.utils.toArray<HTMLElement>("[data-fact]", section).forEach((el, i) => {
          const value = Number(el.dataset.fact)
          const num = el.querySelector<HTMLElement>("[data-fact-num]")!
          const counter = { v: 0 }
          tl.fromTo(el, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: "power3.out" }, n + 0.1 + i * 0.12)
          tl.fromTo(
            counter,
            { v: 0 },
            {
              v: value,
              duration: 0.55,
              ease: "power2.out",
              onUpdate: () => {
                num.textContent = String(Math.round(counter.v))
              },
            },
            n + 0.1 + i * 0.12
          )
        })
        tl.to({}, { duration: 0.15 })
        return () => {
          gsap.utils.toArray<HTMLElement>("[data-fact-num]", section).forEach((el) => {
            el.textContent = (el.parentElement as HTMLElement).dataset.fact ?? ""
          })
        }
      })
      const w = worldTrigger(section, world)
      return () => {
        mm.revert()
        w.kill()
      }
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      id={id}
      data-world={world}
      data-chapter={title}
      aria-label={title}
      className="world-paint font-world relative"
    >
      {/* Scroll-told version */}
      <div data-pin className="scene-only relative h-[100svh] overflow-hidden">
        <div className="mx-auto flex h-full max-w-[1400px] flex-col px-4 pb-14 pt-20 sm:px-6 md:grid md:grid-cols-12 md:gap-x-10 md:px-10 md:pb-10 md:pt-24">
          <div className="relative flex flex-col md:col-span-5 md:h-full">
            <div>
              <p className="tabular text-sm text-w-soft">{index}</p>
              <h2 className="mt-2 text-[clamp(2rem,4.6vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                {title}
              </h2>
            </div>
            <div data-caps className="relative hidden flex-1 md:block">
              <Captions chapters={chapters} />
            </div>
            <Progress n={chapters.length} className="hidden md:flex" />
          </div>

          <div data-stage className="relative min-h-0 flex-1 md:col-span-7 md:h-full">
            {stage}
          </div>

          <div data-caps className="relative h-[30svh] shrink-0 md:hidden">
            <Captions chapters={chapters} />
          </div>
          <Progress n={chapters.length} className="md:hidden" />
        </div>

        <div data-facts className="invisible absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-10">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} data-fact={f.value} className="border-t border-w-rule pt-5">
                  <dt className="sr-only">{f.label}</dt>
                  <dd
                    data-fact-num
                    className="tabular text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-w-accent"
                  >
                    {f.value}
                  </dd>
                  <dd className="mt-3 max-w-[22ch] text-[15px] leading-snug text-w-soft">{f.label}</dd>
                </div>
              ))}
            </dl>
            {factsNote && <p className="mt-10 max-w-[60ch] text-sm text-w-soft">{factsNote}</p>}
          </div>
        </div>
      </div>

      {/* Static version: reduced motion or no JS */}
      <div className="scene-static mx-auto max-w-[1400px] px-4 pb-8 pt-24 sm:px-6 md:px-10">
        <p className="tabular text-sm text-w-soft">{index}</p>
        <h2 className="mt-2 text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{title}</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2">
          {chapters.map((c, i) => (
            <li key={c.title} className="border-t border-w-rule pt-4">
              <p className="tabular text-sm text-w-soft">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">{c.title}</h3>
              <p className="mt-2 max-w-[52ch] text-w-soft">{c.body}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="tabular text-5xl font-semibold tracking-[-0.04em] text-w-accent">{f.value}</dd>
              <dd className="mt-2 text-sm text-w-soft">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {children}
    </section>
  )
}

function Captions({ chapters }: { chapters: Chapter[] }) {
  return (
    <>
      {chapters.map((c, i) => (
        <div
          key={c.title}
          data-cap
          className={cn("absolute inset-x-0 bottom-0 md:bottom-10", i > 0 && "invisible")}
        >
          <p className="tabular text-sm text-w-soft">
            {String(i + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-[clamp(1.6rem,2.8vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            {c.title}
          </h3>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-w-soft md:text-[17px]">{c.body}</p>
        </div>
      ))}
    </>
  )
}

function Progress({ n, className }: { n: number; className?: string }) {
  return (
    <div aria-hidden className={cn("relative mt-3 flex h-px w-full bg-w-rule", className)}>
      <span data-progress className="absolute inset-0 origin-left bg-w-fg" />
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="absolute -top-1 h-2 w-px bg-w-fg/40" style={{ left: `${(i / (n + 1.2)) * 100}%` }} />
      ))}
    </div>
  )
}
