"use client"

import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"

const NAME = ["Sia", "Zhong", "Tai"]

// What the lens reveals. The same list appears as plain text in the Stack
// section, so nothing here is only readable through the lens.
const LENS_WORDS =
  "Kotlin Spring Boot LangGraph RAG pipelines FastAPI PostgreSQL Supabase Python Java TypeScript Next.js React Native Docker GitHub Actions LLM agents Prompt engineering n8n REST APIs CI/CD "

const REST_WDTH = 86
const MAX_WDTH = 125
const LENS_R = 118

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const hero = root.current!
        const lensLayer = lensRef.current!
        const ring = ringRef.current!
        const chars = gsap.utils.toArray<HTMLElement>("[data-char]", hero)
        const lens = { x: 0, y: 0, r: 0 }
        let centers: { x: number; y: number }[] = []
        let live = false
        let diving = false

        const measure = () => {
          const box = hero.getBoundingClientRect()
          centers = chars.map((c) => {
            const r = c.getBoundingClientRect()
            return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }
          })
        }

        // The lens widens the letters it passes over, like a magnifier
        const render = () => {
          lensLayer.style.clipPath = `circle(${lens.r}px at ${lens.x}px ${lens.y}px)`
          const d = Math.max(0, lens.r * 2 + 14)
          ring.style.transform = `translate(${lens.x - d / 2}px, ${lens.y - d / 2}px)`
          ring.style.width = ring.style.height = `${d}px`
          ring.style.opacity = lens.r > 2 ? "1" : "0"
          if (!live || diving) return
          const reach = Math.max(lens.r * 2.1, 1)
          chars.forEach((c, i) => {
            const p = centers[i]
            if (!p) return
            const d = Math.hypot(p.x - lens.x, (p.y - lens.y) * 0.6)
            const k = Math.max(0, 1 - d / reach)
            c.style.setProperty("--wdth", String(REST_WDTH + (MAX_WDTH - REST_WDTH) * k * k))
          })
        }
        gsap.ticker.add(render)

        gsap.set("[data-intro]", { autoAlpha: 1 })
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } })
        tl.from(chars, { yPercent: 108, duration: 1.2, stagger: 0.04 })
          .fromTo(chars, { "--wdth": 62 }, { "--wdth": REST_WDTH, duration: 1.6, stagger: 0.04 }, 0)
          .from("[data-hero-sub] > *", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.55)
          .from("[data-hero-rule]", { scaleX: 0, transformOrigin: "left center", duration: 1.4 }, 0.4)
          // One sweep so everyone sees the lens once, phones included
          .add(() => {
            measure()
            live = true
            const first = centers[0]
            const last = centers[centers.length - 1]
            if (!first || !last) return
            lens.x = first.x - 80
            lens.y = first.y
          }, 1.1)
          .to(lens, { r: LENS_R * 0.9, duration: 0.5, ease: "power3.out" }, 1.15)
          .to(lens, { x: () => (centers[centers.length - 1]?.x ?? 0) + 60, duration: 1.9, ease: "power2.inOut" }, 1.15)
          .to(lens, { r: 0, duration: 0.45, ease: "power3.in" }, 2.75)

        const toX = gsap.quickTo(lens, "x", { duration: 0.55, ease: "power3" })
        const toY = gsap.quickTo(lens, "y", { duration: 0.55, ease: "power3" })
        const local = (e: PointerEvent) => {
          const box = hero.getBoundingClientRect()
          return { x: e.clientX - box.left, y: e.clientY - box.top }
        }
        const onMove = (e: PointerEvent) => {
          if (e.pointerType === "touch" || tl.isActive() || diving) return
          const p = local(e)
          toX(p.x)
          toY(p.y)
          gsap.to(lens, { r: LENS_R, duration: 0.5, ease: "power3.out", overwrite: "auto" })
        }
        const onLeave = () => gsap.to(lens, { r: 0, duration: 0.4, ease: "power3.in", overwrite: "auto" })
        // Touch: tap to drop the lens there for a moment
        const onDown = (e: PointerEvent) => {
          if (e.pointerType !== "touch" || tl.isActive() || diving) return
          const p = local(e)
          gsap.set(lens, { x: p.x, y: p.y })
          gsap.timeline()
            .to(lens, { r: LENS_R * 0.8, duration: 0.4, ease: "power3.out" })
            .to(lens, { r: 0, duration: 0.4, ease: "power3.in" }, "+=1.4")
        }

        // Scrolling pins the hero and dives into the stem of the T until its
        // ink fills the screen; the work index below starts on that same ink.
        const name = nameRef.current!
        const stem = chars[NAME[0].length + NAME[1].length]
        // offsetLeft/Top ignore transforms, so this holds mid-dive too
        const aim = () => {
          const x = stem.offsetLeft + stem.offsetWidth * 0.5
          const y = stem.offsetTop + stem.offsetHeight * 0.6
          gsap.set(name, { transformOrigin: `${x}px ${y}px` })
        }
        const dive = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.5}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              measure()
              if (self.progress > 0) aim()
            },
            onUpdate: (self) => {
              const now = self.progress > 0.002
              if (now && !diving) {
                // Settle the letters the lens had widened, then aim at the stem
                gsap.killTweensOf(lens)
                lens.r = 0
                gsap.set(chars, { "--wdth": REST_WDTH })
                aim()
              }
              if (!now && diving) measure()
              diving = now
            },
          },
        })
        dive
          .to("[data-hero-out]", { yPercent: 40, autoAlpha: 0, duration: 0.25, ease: "power2.in" }, 0)
          .to(name, { scale: 1.12, duration: 0.2, ease: "power1.out" }, 0)
          .to(name, { scale: () => Math.max(window.innerWidth, window.innerHeight) / stem.offsetWidth * 9, duration: 0.8, ease: "expo.in" }, 0.2)
          .to("[data-hero-ink]", { autoAlpha: 1, duration: 0.08 }, 0.92)

        hero.addEventListener("pointermove", onMove)
        hero.addEventListener("pointerleave", onLeave)
        hero.addEventListener("pointerdown", onDown)
        window.addEventListener("resize", measure)
        document.fonts?.ready.then(measure)

        return () => {
          gsap.ticker.remove(render)
          dive.scrollTrigger?.kill()
          hero.removeEventListener("pointermove", onMove)
          hero.removeEventListener("pointerleave", onLeave)
          hero.removeEventListener("pointerdown", onDown)
          window.removeEventListener("resize", measure)
        }
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section
      id="hero"
      data-chapter="Sia Zhong Tai"
      ref={root}
      className="relative isolate scroll-mt-0 overflow-hidden"
    >
      <div
        ref={lensRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden bg-w-fg px-4 pt-24 text-w-bg sm:px-6 md:px-10"
        style={{ clipPath: "circle(0px at 50% 50%)" }}
      >
        <p className="font-wide text-[clamp(1.5rem,2.7vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.01em] [--wdth:104] [word-spacing:0.12em]">
          {LENS_WORDS.repeat(10)}
        </p>
      </div>

      <div data-hero-ink aria-hidden className="invisible absolute inset-0 z-30 bg-w-fg opacity-0" />

      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 rounded-full border-[1.5px] border-w-fg opacity-0"
      />
      <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-4 pb-20 pt-28 sm:px-6 md:px-10 md:pb-20">
      <h1
        ref={nameRef}
        data-intro
        aria-label="Sia Zhong Tai"
        className="relative -mb-[0.16em] flex flex-col gap-x-[0.18em] text-[min(25vw,9rem)] font-extrabold leading-[0.84] tracking-[-0.03em] sm:text-[min(19vw,11rem)] md:flex-row md:flex-nowrap md:whitespace-nowrap md:text-[min(13.2vw,16.5rem)]"
      >
        {NAME.map((word) => (
          <span key={word} aria-hidden className="inline-flex shrink-0 overflow-clip pb-[0.16em]">
            {word.split("").map((ch, i) => (
              <span
                key={i}
                data-char
                className="inline-block"
                style={{ fontVariationSettings: '"wdth" var(--wdth, 100)' }}
              >
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div data-intro data-hero-out className="relative z-20 mt-6 md:mt-8">
        <div data-hero-rule className="h-0.5 w-full bg-w-fg" />
        <div data-hero-sub className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-[46ch] text-lg leading-snug text-w-soft md:text-xl">
            Software engineer at Mode Fair. Backend services in Kotlin and Spring Boot, LangGraph
            agents, and the infrastructure behind them.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex h-12 items-center rounded-[2px] bg-w-fg px-6 text-[15px] font-medium text-w-bg transition-transform duration-200 active:scale-[0.98]"
            >
              See the work
            </a>
            <a
              href="/Sia_Zhong_Tai_Resume.pdf"
              download
              className="inline-flex h-12 items-center rounded-[2px] px-6 text-[15px] font-medium shadow-[inset_0_0_0_1.5px_var(--w-fg)] transition-transform duration-200 active:scale-[0.98]"
            >
              Résumé (PDF)
            </a>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
