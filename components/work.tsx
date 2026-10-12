"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Copy, Play } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VideoEmbed } from "@/components/video-embed"
import { World, type WorldName } from "@/components/world"
import { ScannerDemo } from "@/components/demos/scanner-demo"
import { SchedulerDemo } from "@/components/demos/scheduler-demo"
import { TerritoryDemo } from "@/components/demos/territory-demo"
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap"
import { cn } from "@/lib/utils"

// TODO: Replace with actual demo access codes
const CAMP_ACCESS_CODES = {
  manager: "GREEN_SECRET",
  hq: "HQ_SECRET",
  admin: "ADMIN_SECRET",
}

const btn =
  "inline-flex h-11 items-center gap-2 rounded-[min(var(--w-radius),12px)] px-5 text-[15px] font-medium transition-transform duration-200 active:scale-[0.98]"
const btnPrimary = cn(btn, "bg-w-accent text-w-accent-fg")
const btnLine = cn(btn, "shadow-[inset_0_0_0_1.5px_var(--w-fg)]")

type Fact = { value: string; label: string }

function Walkthrough({ videoId, thumb, title, length }: { videoId: string; thumb: string; title: string; length: string }) {
  return (
    <Dialog>
      <DialogTrigger className="group flex w-full max-w-sm items-center gap-4 rounded-[min(var(--w-radius),12px)] text-left">
        <span className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-[min(var(--w-radius),8px)] bg-w-panel">
          <Image src={thumb} alt="" fill sizes="144px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 grid place-items-center bg-black/25">
            <span className="grid size-9 place-items-center rounded-full bg-white text-black">
              <Play className="size-4 translate-x-px fill-current" />
            </span>
          </span>
        </span>
        <span className="text-sm">
          <span className="block font-medium underline-offset-4 group-hover:underline">Watch the walkthrough</span>
          <span className="text-w-soft">{length}</span>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Walkthrough video</DialogDescription>
        </DialogHeader>
        <VideoEmbed videoId={videoId} />
      </DialogContent>
    </Dialog>
  )
}

function Project({
  world,
  label,
  kicker,
  title,
  summary,
  facts,
  detail,
  stack,
  actions,
  walkthrough,
  demo,
  demoFirst,
}: {
  world: WorldName
  label: string
  kicker: string
  title: string
  summary: string
  facts: Fact[]
  detail?: string
  stack: string[]
  actions: React.ReactNode
  walkthrough: React.ReactNode
  demo: React.ReactNode
  demoFirst?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const trigger = { trigger: ref.current, start: "top 62%", once: true }
        // Each project's face loads lazily, so the title re-splits when it
        // arrives; its tween is returned from onSplit so SplitText can redo it.
        SplitText.create("[data-title]", {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.05,
              ease: "expo.out",
              scrollTrigger: trigger,
            })
          },
        })
        const tl = gsap.timeline({ scrollTrigger: trigger, defaults: { ease: "expo.out" } })
        tl.from("[data-rise]", { y: 28, autoAlpha: 0, duration: 1, stagger: 0.07 }, 0.15)
        tl.from("[data-demo]", { y: 48, autoAlpha: 0, duration: 1.2 }, 0.1)
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <World name={world} label={label} className="flex min-h-[100dvh] items-center px-4 py-24 sm:px-6 md:px-10">
      <div
        ref={ref}
        className="font-world mx-auto grid w-full max-w-[1400px] items-center gap-x-14 gap-y-12 lg:grid-cols-12"
      >
        <div className={cn("min-w-0 lg:col-span-5", demoFirst && "lg:order-2")}>
          <p data-rise className="text-sm text-w-soft">
            {kicker}
          </p>
          <h3
            data-title
            className="mt-3 text-[clamp(2.75rem,6vw,5.25rem)] font-bold leading-[0.95] tracking-[-0.035em]"
          >
            {title}
          </h3>
          <p data-rise className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-w-soft">
            {summary}
          </p>
          <dl data-rise className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-w-rule pt-6">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none tracking-[-0.03em] tabular">
                  {f.value}
                </dd>
                <dd className="mt-1.5 text-sm leading-snug text-w-soft">{f.label}</dd>
              </div>
            ))}
          </dl>
          {detail && (
            <p data-rise className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-w-soft">
              {detail}
            </p>
          )}
          <p data-rise className="mt-6 text-sm text-w-soft">
            {stack.join(", ")}
          </p>
          <div data-rise className="mt-7 flex flex-wrap gap-3">
            {actions}
          </div>
          <div data-rise className="mt-7">
            {walkthrough}
          </div>
        </div>
        <div data-demo className={cn("min-w-0 lg:col-span-7", demoFirst && "lg:order-1")}>
          {demo}
        </div>
      </div>
    </World>
  )
}

function AccessCodes() {
  const [copied, setCopied] = useState<string | null>(null)
  function copyCode(key: string, value: string) {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }
  return (
    <Dialog>
      <DialogTrigger className={btnPrimary}>Open the live demo</DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Demo access codes</DialogTitle>
          <DialogDescription>Each role has its own code for the live demo.</DialogDescription>
        </DialogHeader>
        <div className="mt-2 space-y-2 font-mono text-sm">
          {(["manager", "hq", "admin"] as const).map((role) => (
            <div key={role} className="flex items-center justify-between gap-2">
              <span className="capitalize text-muted-foreground">{role}</span>
              <div className="flex items-center gap-1">
                <span className="rounded bg-muted px-2 py-1 text-foreground">{CAMP_ACCESS_CODES[role]}</span>
                <button
                  type="button"
                  className="grid size-7 place-items-center rounded hover:bg-muted"
                  onClick={() => copyCode(role, CAMP_ACCESS_CODES[role])}
                  aria-label={`Copy ${role} code`}
                >
                  {copied === role ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <a
          href="https://outdoor-game-manager-app.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-[2px] bg-foreground text-sm font-medium text-background"
        >
          Open the live demo
        </a>
      </DialogContent>
    </Dialog>
  )
}

export function Work() {
  return (
    <div id="work">
      <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-28 sm:px-6 md:px-10 md:pt-40">
        <h2 className="font-wide text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.88] tracking-[-0.03em] [--wdth:118]">
          Selected work
        </h2>
        <p className="mt-6 max-w-[48ch] text-lg text-w-soft">
          Three projects. Each one has a small demo you can play with, showing how part of it works.
        </p>
      </div>

      <Project
        world="zetix"
        label="Zetix"
        kicker="Personal project. Used at a real concert in September 2026."
        title="Zetix"
        summary="Ticketing for free concerts with unreserved seating: registration, seat allocation, tickets by email, and a door scanner. Built to replace a door check where ushers searched a spreadsheet for each guest's name."
        facts={[
          { value: "400", label: "tickets issued" },
          { value: "334", label: "guests admitted by 7 ushers" },
          { value: "51", label: "admitted in the busiest five minutes" },
          { value: "6", label: "admitted offline when two phones lost signal" },
        ]}
        detail="Seats are claimed by one row-locked Postgres function, so a show cannot oversell, and its concurrency tests run in CI against a real Postgres. Close to 100 Playwright end-to-end specs."
        stack={["Next.js", "PostgreSQL", "Supabase", "Drizzle", "Playwright"]}
        actions={
          <>
            <a href="https://zetix.vercel.app" target="_blank" rel="noopener noreferrer" className={btnPrimary}>
              Open the live demo
            </a>
            <a href="https://github.com/ztsia/zetix" target="_blank" rel="noopener noreferrer" className={btnLine}>
              Source on GitHub
            </a>
          </>
        }
        walkthrough={
          <Walkthrough
            videoId="tYE9JxSCns0"
            thumb="/project_thumbnail/zetix_thumbnail.jpg"
            title="Zetix"
            length="From sign-up to the door"
          />
        }
        demo={<ScannerDemo />}
      />

      <Project
        world="study"
        label="AI Academic Assistant"
        kicker="Final year project, UTAR, 2025 to 2026"
        title="AI Academic Assistant"
        summary="An adaptive study platform across four repositories: web and mobile apps, a Supabase backend, and a Python service with six LangGraph agents for scheduling, quiz generation and knowledge processing."
        facts={[
          { value: "6", label: "LangGraph agents" },
          { value: "19", label: "tables, all behind row-level security" },
          { value: "3", label: "asyncio background loops, no Celery" },
          { value: "4", label: "repositories" },
        ]}
        stack={["Next.js", "React Native", "FastAPI", "LangGraph", "Supabase", "OR-Tools", "Gemini API"]}
        actions={
          <Link href="/projects/ai-academic-assistant" className={btnPrimary}>
            Read the case study
          </Link>
        }
        walkthrough={
          <Walkthrough
            videoId="FGOy59Ylnl4"
            thumb="/project_thumbnail/FYP_demo_thumbnail.jpg"
            title="AI Academic Assistant"
            length="3-minute walkthrough of the platform"
          />
        }
        demo={<SchedulerDemo />}
        demoFirst
      />

      <Project
        world="field"
        label="Real-time outdoor event system"
        kicker="Live event, 60 participants"
        title="Real-time outdoor event system"
        summary="A server-authoritative PWA for an outdoor team game. Territory captures run as Firestore transactions, so two teams tapping at once can't both win, and the leaderboard updates live for everyone."
        facts={[
          { value: "60", label: "participants on the day" },
          { value: "6", label: "team managers running it live" },
          { value: "3", label: "role tiers: manager, HQ, admin" },
        ]}
        stack={["React 19", "Firebase Firestore", "Tailwind CSS v4", "PWA", "Vite"]}
        actions={
          <>
            <AccessCodes />
            <a
              href="https://github.com/ztsia/outdoor-game-manager-app"
              target="_blank"
              rel="noopener noreferrer"
              className={btnLine}
            >
              Source on GitHub
            </a>
          </>
        }
        walkthrough={
          <Walkthrough
            videoId="4FgoOfoR5xg"
            thumb="/project_thumbnail/camp_pwa_demo-thumbnail.jpg"
            title="Real-time outdoor event system"
            length="Walkthrough of the live event"
          />
        }
        demo={<TerritoryDemo />}
      />
    </div>
  )
}
