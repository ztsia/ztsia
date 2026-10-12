"use client"

import { useRef } from "react"
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap"

const TIMELINE = [
  {
    when: "Now",
    role: "Software Engineer, Mode Fair",
    note: "Backend services in Kotlin and Spring Boot, within an AI-native engineering workflow.",
  },
  {
    when: "Oct 2025 to Jan 2026",
    role: "Software Engineering Intern, GenTech AI",
    note: "Built a stateful multi-agent system with LangGraph and FastAPI for project-board orchestration, shipped to staging and piloted on 3 boards. Built a JSON-driven form engine in React and TypeScript for Malaysian Tax Form C, covering 10+ form types.",
  },
  {
    when: "2026",
    role: "B. Software Engineering, UTAR",
    note: "Final year project: the AI Academic Assistant above.",
  },
  {
    when: "Alongside",
    role: "Concertmaster, Galaxy Chamber Orchestra",
    note: "Lead concert operations for events with 100+ performers.",
  },
]

export function About() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Words fill in as the paragraph scrolls through the viewport
        SplitText.create("[data-fill]", {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: { trigger: "[data-fill]", start: "top 78%", end: "bottom 42%", scrub: true },
              }
            )
          },
        })
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <section ref={ref} id="about" data-chapter="About" className="mx-auto max-w-[1400px] px-4 py-28 sm:px-6 md:px-10 md:py-40">
      <h2 className="sr-only">About</h2>
      <p
        data-fill
        className="max-w-[24ch] text-[clamp(2rem,4.6vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
      >
        I build backend services, AI agents, and the infrastructure behind them. I&rsquo;m drawn to
        roles where AI is the product, not a feature.
      </p>

      <ol className="mt-20 grid gap-x-12 md:mt-28 md:grid-cols-2">
        {TIMELINE.map((t) => (
          <li key={t.role} className="grid gap-1 border-t border-w-rule py-6 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <span className="text-sm text-w-soft">{t.when}</span>
            <div>
              <h3 className="text-lg font-semibold leading-snug">{t.role}</h3>
              <p className="mt-1.5 max-w-[56ch] text-[15px] leading-relaxed text-w-soft">{t.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
