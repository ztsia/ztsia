"use client"

import { useRef } from "react"
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap"

/**
 * A running folio in the bottom corners, like a printed index: which chapter
 * you're in, and how far through the page. Inverts whatever is beneath it.
 * Rendered last on the home page, after the chapters it reads.
 */
export function Folio() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const num = el.querySelector<HTMLElement>("[data-folio-num]")!
      const name = el.querySelector<HTMLElement>("[data-folio-name]")!
      const roll = el.querySelector<HTMLElement>("[data-folio-roll]")!
      const pct = el.querySelector<HTMLElement>("[data-folio-pct]")!
      // Not gsap.utils.toArray: inside this context it would only search the folio
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"))
      const reduce = window.matchMedia(MOTION_OK).matches === false
      let current = -1

      if (!sections.length) return
      const show = (i: number) => {
        if (i === current || !sections[i]) return
        const set = () => {
          num.textContent = String(i + 1).padStart(2, "0")
          name.textContent = sections[i].dataset.chapter ?? ""
        }
        const first = current === -1
        current = i
        if (first || reduce) return set()
        gsap
          .timeline()
          .to(roll, { yPercent: -110, duration: 0.25, ease: "power2.in" })
          .add(set)
          .fromTo(roll, { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" })
      }

      const triggers = sections.map((s, i) =>
        ScrollTrigger.create({
          trigger: s,
          start: "top 50%",
          end: "bottom 50%",
          refreshPriority: -1,
          onToggle: (self) => self.isActive && show(i),
        })
      )
      const progress = ScrollTrigger.create({
        start: 0,
        end: "max",
        refreshPriority: -1,
        onUpdate: (self) => {
          pct.textContent = String(Math.round(self.progress * 100)).padStart(3, "0")
        },
      })
      show(0)
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: reduce ? 0 : 2.6 })
      return () => {
        triggers.forEach((t) => t.kill())
        progress.kill()
      }
    },
    { scope: root }
  )

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none invisible fixed inset-x-0 bottom-0 z-40 flex items-end justify-between px-4 pb-4 text-[12px] font-medium text-white mix-blend-difference sm:px-6 md:px-10 md:pb-6 md:text-[13px]"
    >
      <span className="flex items-baseline gap-3 overflow-hidden">
        <span data-folio-roll className="flex items-baseline gap-3">
          <span data-folio-num className="tabular">
            01
          </span>
          <span data-folio-name className="font-wide max-w-[58vw] truncate font-bold uppercase tracking-[0.06em] [--wdth:118]" />
        </span>
      </span>
      <span className="tabular">
        <span data-folio-pct>000</span>%
      </span>
    </div>
  )
}
