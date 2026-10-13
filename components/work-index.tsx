"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useJump } from "@/components/jump"
import { gsap, useGSAP, SCENE, MOTION_OK } from "@/lib/gsap"
import { worldTrigger } from "@/components/world"
import { cn } from "@/lib/utils"
import { PROJECTS, folioOf, numberOf, projectCount } from "@/lib/projects"

const FIRST = PROJECTS[0]

/**
 * The table of contents, set on the ink the hero dives into. Scrolling on
 * opens the first entry: its row becomes a window onto that project's world
 * and grows until it is the whole screen. Rows come from lib/projects.ts.
 */
export function WorkIndex() {
  const root = useRef<HTMLElement>(null)
  const jump = useJump()
  const [hover, setHover] = useState<number | null>(null)

  useGSAP(
    () => {
      const section = root.current!
      // The inner wrapper pins, so the section (and its world) spans the pin
      const pinEl = section.querySelector<HTMLElement>("[data-pin]")!
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", section)
      const first = rows[0]
      const mm = gsap.matchMedia()

      mm.add(SCENE, () => {
        // The rows rise out of the ink as the section scrolls up under the dive
        gsap.from("[data-row-inner]", {
          yPercent: 110,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 95%", end: "top 15%", scrub: 0.5 },
        })
        gsap.from("[data-row-rule]", {
          scaleX: 0,
          transformOrigin: "left center",
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 90%", end: "top 20%", scrub: 0.5 },
        })

        // The first row's box as a clip-path; `shut` collapses it onto the row's foot
        const inset = (shut = false) => {
          const w = pinEl.offsetWidth
          const h = pinEl.offsetHeight
          const top = first.offsetTop
          const left = first.offsetLeft
          const bottom = h - top - first.offsetHeight
          return `inset(${shut ? top + first.offsetHeight : top}px ${w - left - first.offsetWidth}px ${bottom}px ${left}px)`
        }

        gsap.set("[data-open]", { visibility: "visible" })
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: pinEl,
              start: "top top",
              end: "+=130%",
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .to("[data-index-head]", { y: -60, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
          .to(rows.slice(1), { y: 60, autoAlpha: 0, duration: 0.3, stagger: 0.05, ease: "power2.in" }, 0)
          .fromTo("[data-open]", { clipPath: () => inset(true) }, { clipPath: () => inset(), duration: 0.12, ease: "power2.out" }, 0)
          .to("[data-open]", { clipPath: "inset(0px 0px 0px 0px)", duration: 0.6, ease: "expo.inOut" }, 0.14)
          .to("[data-ghost-title]", { autoAlpha: 0, yPercent: -30, duration: 0.2, ease: "power2.in" }, 0.38)
          .fromTo(
            "[data-open-title]",
            { yPercent: 70, scale: 0.6 },
            { yPercent: 0, scale: 1, duration: 0.55, ease: "expo.out" },
            0.3
          )
          .fromTo("[data-open-meta]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.6)
          .to({}, { duration: 0.15 })
      })

      const world = worldTrigger(section, "ink")
      return () => {
        mm.revert()
        world.kill()
      }
    },
    { scope: root }
  )

  // A preview of each project trails the cursor across the list
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`(pointer: fine) and ${MOTION_OK}`, () => {
        const section = root.current!
        const pinEl = section.querySelector<HTMLElement>("[data-pin]")!
        const peek = section.querySelector<HTMLElement>("[data-peek]")!
        const toX = gsap.quickTo(peek, "x", { duration: 0.6, ease: "power3" })
        const toY = gsap.quickTo(peek, "y", { duration: 0.6, ease: "power3" })
        const move = (e: PointerEvent) => {
          const b = pinEl.getBoundingClientRect()
          toX(e.clientX - b.left)
          toY(e.clientY - b.top)
        }
        section.addEventListener("pointermove", move)
        return () => section.removeEventListener("pointermove", move)
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  function open(e: React.MouseEvent, id: string) {
    if (jump(`#${id}`)) e.preventDefault()
  }

  return (
    <section
      ref={root}
      id="work"
      data-world="ink"
      data-chapter="Index"
      aria-label="Selected work"
      className="world-paint relative scroll-mt-0"
    >
      <div data-pin className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <IndexList onHover={setHover} onOpen={open} />

      {/* Cursor preview (fine pointers only) */}
      <div
        data-peek
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 hidden w-[min(26vw,360px)] -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(pointer:fine)]:block",
          hover === null ? "scale-75 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <div className="relative aspect-video overflow-hidden rounded-[2px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
          {PROJECTS.map((p, i) => (
            <Image
              key={p.id}
              src={p.thumb}
              alt=""
              fill
              sizes="360px"
              className={cn("object-cover transition-opacity duration-300", hover === i ? "opacity-100" : "opacity-0")}
            />
          ))}
        </div>
      </div>

      {/* The first row's window, which grows into that project's world */}
      <div
        data-open
        data-world={FIRST.world}
        aria-hidden
        className="world-paint invisible absolute inset-0 z-30 grid place-items-center overflow-hidden"
      >
        <div className="absolute inset-0 flex flex-col">
          <IndexList ghost />
        </div>
        <div className="relative text-center">
          <p data-open-meta className="font-world text-sm text-w-soft">{folioOf(FIRST.id)}</p>
          <p
            data-open-title
            className="font-world text-[clamp(5rem,24vw,22rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-w-accent"
          >
            {FIRST.title}
          </p>
          <p data-open-meta className="font-world mt-6 text-lg text-w-soft">{FIRST.tagline}</p>
        </div>
      </div>
      </div>
    </section>
  )
}

/**
 * The list itself. The ghost copy sits inside the opening window with the
 * same layout, so the first title stays put as the window takes over the row.
 */
function IndexList({
  ghost,
  onHover,
  onOpen,
}: {
  ghost?: boolean
  onHover?: (i: number | null) => void
  onOpen?: (e: React.MouseEvent, id: string) => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-4 py-24 sm:px-6 md:px-10">
      <div
        {...(ghost ? {} : { "data-index-head": "" })}
        className={cn("flex flex-wrap items-end justify-between gap-x-10 gap-y-3 pb-6", ghost && "invisible")}
      >
        <h2 className="font-wide text-[clamp(1.1rem,1.6vw,1.4rem)] font-bold [--wdth:125]">Selected work</h2>
        <p className="max-w-[44ch] text-[15px] text-w-soft">
          {projectCount()}. Each one opens into its own world, and ends with a small demo you can play with.
        </p>
      </div>

      <ol onPointerLeave={() => onHover?.(null)}>
        {PROJECTS.map((p, i) => (
          <li
            key={p.id}
            {...(ghost ? {} : { "data-row": "" })}
            className={cn("group relative", ghost && i > 0 && "invisible")}
            onPointerEnter={() => onHover?.(i)}
          >
            {!ghost && (
              <>
                <span data-row-rule aria-hidden className="absolute inset-x-0 top-0 h-px bg-w-rule" />
                {/* Hover fills the row with the project's own ground */}
                <span
                  aria-hidden
                  data-world={p.world}
                  className="absolute inset-0 origin-bottom scale-y-0 bg-w-bg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />
              </>
            )}
            <a
              href={`#${p.id}`}
              onClick={(e) => onOpen?.(e, p.id)}
              tabIndex={ghost ? -1 : undefined}
              {...(ghost ? { "data-ghost-title": "" } : { "data-world": p.world })}
              className={cn(
                "relative block overflow-clip transition-colors duration-500",
                // Takes the project's tokens for its hover colour; at rest it
                // stays the index's paper-on-ink
                ghost ? "text-w-accent" : "text-[var(--paper)] group-hover:text-w-accent"
              )}
            >
              <span
                {...(ghost ? {} : { "data-row-inner": "" })}
                className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-4 sm:grid-cols-[3.5rem_1fr_auto] md:py-5"
              >
                <span className="tabular text-sm opacity-60">{numberOf(i)}</span>
                <span
                  className="font-wide text-[clamp(2.1rem,6.2vw,6.2rem)] font-extrabold leading-[0.92] tracking-[-0.03em] [--wdth:108] transition-[font-variation-settings] duration-700 group-hover:[--wdth:122]"
                >
                  {p.title}
                </span>
                <span className="col-start-2 mt-2 text-sm leading-snug opacity-70 sm:col-start-3 sm:mt-0 sm:text-right">
                  {p.kind}
                  <br className="hidden sm:block" />
                  <span className="sm:hidden">. </span>
                  {p.meta}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
      <span aria-hidden className="h-px bg-w-rule" />
    </div>
  )
}
