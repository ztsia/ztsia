"use client"

import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Check, Copy, ExternalLink, Play } from "lucide-react"
import { InlineIcon } from "@/components/tech-icon"
import Image from "next/image"
import Link from "next/link"
import { VideoEmbed } from "@/components/video-embed"
import { FadeUp } from "@/components/fade-up"

// TODO: Replace with actual demo access codes
const CAMP_ACCESS_CODES = {
  manager: "GREEN_SECRET",
  hq: "HQ_SECRET",
  admin: "ADMIN_SECRET",
}

export function Projects() {
  const [copied, setCopied] = useState<string | null>(null)

  function copyCode(key: string, value: string) {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section id="projects" className="py-24 max-w-5xl mx-auto px-6">
      <FadeUp>
      <p className="text-base font-mono uppercase tracking-wider text-muted-foreground">Projects</p>
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        {/* Card 1 — AI Academic Assistant */}
        <Dialog>
          <Card className="relative group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
            <AspectRatio ratio={16 / 9} className="relative bg-muted">
              <Image
                src="/project_thumbnail/FYP_demo_thumbnail.jpg"
                alt="AI Academic Assistant demo thumbnail"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground transition-opacity group-hover:opacity-0"
              >
                <Play className="h-3 w-3" />
                Watch Demo
              </div>
              <DialogTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "absolute inset-0 z-10 h-full w-full rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                )}
                aria-label="Watch demo"
              >
                <Play className="h-8 w-8" />
              </DialogTrigger>
            </AspectRatio>
            <CardHeader>
              <CardTitle>
                <Link
                  href="/projects/ai-academic-assistant"
                  className="transition-colors hover:text-primary hover:underline underline-offset-4 after:absolute after:inset-0 after:content-['']"
                >
                  AI Academic Assistant
                </Link>
              </CardTitle>
              <CardDescription>Full-stack AI academic platform with 6 LangGraph agents</CardDescription>
              <CardAction>
                <Badge variant="outline" className="font-mono text-xs">Case Study</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-sm text-foreground/80 leading-relaxed">
                Adaptive quizzing via FSRS, CP-SAT constraint scheduling, and a semantic knowledge
                graph pipeline.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Next.js", "FastAPI", "LangGraph", "Supabase", "OR-Tools", "Python"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-mono text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="relative z-10 flex gap-2">
                <Link
                  href="/projects/ai-academic-assistant"
                  className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                >
                  View Case Study →
                </Link>
                <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                  <Play data-icon="inline-start" className="h-3 w-3" /> Watch Demo
                </DialogTrigger>
              </div>
            </CardFooter>
          </Card>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>AI Academic Assistant — Demo</DialogTitle>
              <DialogDescription>3-minute walkthrough of the full platform.</DialogDescription>
            </DialogHeader>
            <VideoEmbed videoId="FGOy59Ylnl4" />
          </DialogContent>
        </Dialog>

        {/* Card 2 — AI-Powered Outdoor Event System */}
        <Dialog>
          <Card className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
            <AspectRatio ratio={16 / 9} className="relative bg-muted">
              <Image
                src="/project_thumbnail/camp_pwa_demo-thumbnail.jpg"
                alt="Real-Time Outdoor Event System demo thumbnail"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground transition-opacity group-hover:opacity-0"
              >
                <Play className="h-3 w-3" />
                Watch Demo
              </div>
              <DialogTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "absolute inset-0 h-full w-full rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                )}
                aria-label="Watch demo"
              >
                <Play className="h-8 w-8" />
              </DialogTrigger>
            </AspectRatio>
            <CardHeader>
              <CardTitle>Real-Time Outdoor Event System</CardTitle>
              <CardDescription>Real-time PWA deployed live for a 60-participant outdoor event</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-sm text-foreground/80 leading-relaxed">
                Server-authoritative game engine with Firestore transactions and 3-tier RBAC — used
                by 6 team managers on event day.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["React 19", "Firebase", "Tailwind CSS", "PWA", "Firestore"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-mono text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 flex-wrap">
                <Dialog>
                  <DialogTrigger className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
                    <ExternalLink data-icon="inline-start" className="h-3 w-3" /> Live Demo
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xs">
                    <DialogHeader>
                      <DialogTitle>Demo Access Codes</DialogTitle>
                      <DialogDescription>
                        Use a role-specific code to log in to the live demo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 font-mono text-sm mt-2">
                      {(["manager", "hq", "admin"] as const).map((role) => (
                        <div key={role} className="flex justify-between items-center gap-2">
                          <span className="text-muted-foreground capitalize">{role}</span>
                          <div className="flex items-center gap-1">
                            <span className="bg-muted px-2 py-1 rounded text-foreground">{CAMP_ACCESS_CODES[role]}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() => copyCode(role, CAMP_ACCESS_CODES[role])}
                              aria-label={`Copy ${role} code`}
                            >
                              {copied === role ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a
                      href="https://outdoor-game-manager-app.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "default" }), "w-full mt-2")}
                    >
                      Open Live Demo →
                    </a>
                  </DialogContent>
                </Dialog>
                <a
                  href="https://github.com/ztsia/outdoor-game-manager-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  <InlineIcon name="github" className="h-3 w-3" /> GitHub
                </a>
                <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                  <Play data-icon="inline-start" className="h-3 w-3" /> Watch Demo
                </DialogTrigger>
              </div>
            </CardFooter>
          </Card>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Outdoor Event System — Demo</DialogTitle>
              <DialogDescription>Live event walkthrough.</DialogDescription>
            </DialogHeader>
            <VideoEmbed videoId="4FgoOfoR5xg" />
          </DialogContent>
        </Dialog>

      </div>
      </FadeUp>
    </section>
  )
}
