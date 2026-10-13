"use client"

import { useRef } from "react"
import { useLenis } from "lenis/react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"

const GROUPS = [
  {
    name: "AI and agents",
    items: ["LangGraph", "LLM integration", "RAG pipelines", "Prompt engineering", "n8n"],
  },
  {
    name: "Backend",
    items: ["Kotlin", "Spring Boot", "Java", "Python", "FastAPI", "Supabase", "PostgreSQL", "Node.js", "REST APIs"],
  },
  {
    name: "Frontend",
    items: ["TypeScript", "Next.js", "React Native (Expo)", "Tailwind CSS", "shadcn/ui"],
  },
  {
    name: "DevOps",
    items: ["Docker", "GitHub Actions", "CI/CD", "Vercel", "Firebase"],
  },
]

const ROWS = [
  [...GROUPS[0].items, ...GROUPS[1].items.slice(0, 4)],
  [...GROUPS[1].items.slice(4), ...GROUPS[2].items, ...GROUPS[3].items],
]

/**
 * The stack as two bands of type that drift on their own and answer the
 * scroll: faster with speed, reversing with direction, and stretching wider
 * on Archivo's width axis the harder you scroll. The plain lists below say
 * the same thing for reading.
 */
export function Skills() {
  const root = useRef<HTMLElement>(null)
  const velocity = useRef(0)

  useLenis(({ velocity: v }) => {
    velocity.current = v
  })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const bands = gsap.utils.toArray<HTMLElement>("[data-band]", root.current)
        const pos = bands.map(() => 0)
        let dir = 1
        let smooth = 0
        let wdth = 100
        let visible = false
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
        io.observe(root.current!)

        const tick = (_: number, dt: number) => {
          if (!visible) return
          const v = velocity.current
          if (Math.abs(v) > 0.4) dir = Math.sign(v)
          smooth += (v - smooth) * 0.08
          const speed = (0.012 + Math.min(Math.abs(smooth), 60) * 0.006) * dir * (dt / 16.7)
          bands.forEach((b, i) => {
            pos[i] = gsap.utils.wrap(-50, 0, pos[i] - speed * (i % 2 ? -1 : 1))
            b.style.transform = `translate3d(${pos[i]}%,0,0)`
          })
          const target = 100 + Math.min(Math.abs(smooth) * 0.9, 25)
          if (Math.abs(target - wdth) > 0.2) {
            wdth += (target - wdth) * 0.15
            root.current!.style.setProperty("--band-wdth", wdth.toFixed(1))
          }
        }
        gsap.ticker.add(tick)
        return () => {
          gsap.ticker.remove(tick)
          io.disconnect()
        }
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section ref={root} id="stack" data-chapter="Stack" className="overflow-hidden pb-28 md:pb-40">
      <h2 className="sr-only">Stack</h2>
      <div aria-hidden className="grid gap-1 border-y-2 border-w-fg py-4 md:py-6">
        {ROWS.map((row, i) => (
          <div key={i} className="flex overflow-hidden whitespace-nowrap">
            <div data-band className="flex shrink-0 will-change-transform">
              {[0, 1].map((copy) => (
                <span
                  key={copy}
                  className="flex shrink-0 items-center font-extrabold leading-[1.02] tracking-[-0.03em] text-[clamp(3rem,8.5vw,8.5rem)]"
                  style={{ fontVariationSettings: '"wdth" var(--band-wdth, 100)' }}
                >
                  {row.map((item) => (
                    <span key={item} className="flex items-center">
                      <span className="px-[0.18em]">{item}</span>
                      <span className="mx-[0.12em] inline-block size-[0.18em] rounded-full bg-current" />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-[1400px] gap-x-10 gap-y-10 px-4 sm:grid-cols-2 sm:px-6 md:px-10 lg:grid-cols-4">
        {GROUPS.map((g) => (
          <div key={g.name}>
            <h3 className="text-sm text-w-soft">{g.name}</h3>
            <ul className="mt-3 grid gap-1 text-xl font-medium tracking-[-0.01em]">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
