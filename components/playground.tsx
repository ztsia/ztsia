"use client"

import { useRef, useState } from "react"
import Image from "next/image"
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
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { cn } from "@/lib/utils"

// TODO: Replace with actual demo access codes
const CAMP_ACCESS_CODES = {
  manager: "GREEN_SECRET",
  hq: "HQ_SECRET",
  admin: "ADMIN_SECRET",
}

const btn =
  "inline-flex h-11 items-center gap-2 rounded-[min(var(--w-radius),12px)] px-5 text-[15px] font-medium transition-transform duration-200 active:scale-[0.98]"
export const btnPrimary = cn(btn, "bg-w-accent text-w-accent-fg")
export const btnLine = cn(btn, "shadow-[inset_0_0_0_1.5px_var(--w-fg)]")

export function Walkthrough({ videoId, thumb, title, length }: { videoId: string; thumb: string; title: string; length: string }) {
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

/**
 * Where a project's scene lets go: the hands-on demo, with the links and the
 * walkthrough beside it.
 */
export function Playground({
  kicker,
  title,
  summary,
  detail,
  stack,
  actions,
  walkthrough,
  demo,
  demoFirst,
}: {
  kicker: string
  title: string
  summary: string
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
        gsap
          .timeline({
            scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
            defaults: { ease: "expo.out" },
          })
          .from("[data-rise]", { y: 36, autoAlpha: 0, duration: 1, stagger: 0.07 })
          .from("[data-demo]", { y: 60, autoAlpha: 0, duration: 1.2 }, 0.1)
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div
      ref={ref}
      className="mx-auto grid max-w-[1400px] items-center gap-x-14 gap-y-12 px-4 pb-28 pt-16 sm:px-6 md:px-10 md:pb-36 md:pt-24 lg:grid-cols-12"
    >
      <div className={cn("min-w-0 lg:col-span-5", demoFirst && "lg:order-2")}>
        <p data-rise className="text-sm text-w-soft">
          {kicker}
        </p>
        <h3 data-rise className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] font-semibold leading-[1] tracking-[-0.035em]">
          {title}
        </h3>
        <p data-rise className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-w-soft">
          {summary}
        </p>
        {detail && (
          <p data-rise className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-w-soft">
            {detail}
          </p>
        )}
        <p data-rise className="mt-5 text-sm text-w-soft">
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
  )
}

export function AccessCodes() {
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

