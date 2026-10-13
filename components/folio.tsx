"use client"

import { useEffect, useRef, useState } from "react"
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap"
import { useJump } from "@/components/jump"
import { PROJECTS, numberOf } from "@/lib/projects"
import { cn } from "@/lib/utils"

// Every stop on the page, for the jump menu. Projects come from lib/projects.ts
const STOPS = [
  { hash: "#hero", label: "Top" },
  { hash: "#work", label: "Selected work" },
  ...PROJECTS.map((p, i) => ({ hash: `#${p.id}`, label: p.title, n: numberOf(i), demo: `#${p.id}-demo` })),
  { hash: "#about", label: "About" },
  { hash: "#stack", label: "Stack" },
  { hash: "#contact", label: "Contact" },
]

/**
 * A running folio in the bottom corners, like a printed index: which chapter
 * you're in, and how far through the page. Inverts whatever is beneath it.
 * Rendered last on the home page, after the chapters it reads. Its label
 * opens a menu of every section, so nobody has to scroll through it all.
 */
export function Folio() {
  const root = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hereRef = useRef("#hero")
  const [open, setOpen] = useState(false)
  const [here, setHere] = useState("#hero")
  const jump = useJump()

  useEffect(() => {
    if (!open) return
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menuRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setOpen(false)
        if (e instanceof KeyboardEvent) buttonRef.current?.focus()
      }
    }
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", close)
    menuRef.current?.querySelector<HTMLElement>("a")?.focus()
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", close)
    }
  }, [open])

  const go = (e: React.MouseEvent, hash: string) => {
    setOpen(false)
    if (jump(hash)) e.preventDefault()
  }

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
        hereRef.current = `#${sections[i].id}`
        const first = current === -1
        current = i
        if (first || reduce) return set()
        gsap
          .timeline()
          .to(roll, { yPercent: -110, duration: 0.25, ease: "power2.in" })
          .add(set)
          .fromTo(roll, { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" })
      }

      // Chapter markers only; the current one is read off the scroll position
      // each update, so a jump straight past a chapter can't leave it stale
      const triggers = sections.map((s) =>
        ScrollTrigger.create({ trigger: s, start: "top 50%", end: "bottom 50%", refreshPriority: -1 })
      )
      const progress = ScrollTrigger.create({
        start: 0,
        end: "max",
        refreshPriority: -2,
        onUpdate: (self) => {
          pct.textContent = String(Math.round(self.progress * 100)).padStart(3, "0")
          const y = self.scroll()
          let i = 0
          triggers.forEach((t, k) => {
            if (t.start <= y) i = k
          })
          show(i)
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
    <>
      <div
        ref={root}
        className="pointer-events-none invisible fixed inset-x-0 bottom-0 z-40 flex items-end justify-between px-4 pb-4 text-[12px] font-medium text-white mix-blend-difference sm:px-6 md:px-10 md:pb-6 md:text-[13px]"
      >
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="jump-menu"
          onClick={() => {
            setHere(hereRef.current)
            setOpen((o) => !o)
          }}
          className="pointer-events-auto flex items-center gap-3 py-1 text-left"
        >
          <span className="flex items-baseline gap-3 overflow-hidden">
            <span data-folio-roll className="flex items-baseline gap-3">
              <span data-folio-num className="tabular">
                01
              </span>
              <span
                data-folio-name
                className="font-wide max-w-[44vw] truncate font-bold uppercase tracking-[0.06em] [--wdth:118]"
              />
            </span>
          </span>
          <span className="rounded-full border border-current px-2.5 py-0.5 text-[11px] md:text-[12px]">
            {open ? "Close" : "Jump to"}
          </span>
        </button>
        <span aria-hidden className="tabular">
          <span data-folio-pct>000</span>%
        </span>
      </div>

      {open && (
        <nav
          ref={menuRef}
          id="jump-menu"
          aria-label="Jump to a section"
          className="fixed bottom-14 left-4 z-[45] w-[min(23rem,calc(100vw-2rem))] rounded-[2px] border border-[var(--ink)] bg-[var(--paper)] p-2 text-[var(--ink)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] sm:left-6 md:bottom-16 md:left-10"
        >
          <ul className="grid">
            {STOPS.map((s) => (
              <li key={s.hash} className="flex items-center gap-2">
                <a
                  href={s.hash}
                  onClick={(e) => go(e, s.hash)}
                  aria-current={here === s.hash ? "location" : undefined}
                  className={cn(
                    "flex min-w-0 flex-1 items-baseline gap-3 rounded-[2px] px-2.5 py-2 text-[15px] hover:bg-[var(--surface)]",
                    here === s.hash && "font-semibold"
                  )}
                >
                  <span className="tabular w-5 shrink-0 text-xs text-[var(--ink-soft)]">{"n" in s ? s.n : ""}</span>
                  <span className="truncate">{s.label}</span>
                </a>
                {"demo" in s && (
                  <a
                    href={s.demo}
                    onClick={(e) => go(e, s.demo)}
                    className="shrink-0 rounded-full border border-[var(--rule)] px-2.5 py-1 text-xs hover:border-[var(--ink)]"
                  >
                    Demo
                  </a>
                )}
              </li>
            ))}
          </ul>
          <a
            href="/Sia_Zhong_Tai_Resume.pdf"
            download
            className="mt-1 flex items-center justify-between border-t border-[var(--rule)] px-2.5 pb-1 pt-3 text-[15px] font-medium"
          >
            Résumé (PDF) <span aria-hidden>&darr;</span>
          </a>
        </nav>
      )}
    </>
  )
}
