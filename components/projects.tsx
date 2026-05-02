"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
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
import { Code2, ExternalLink, Layers, Play } from "lucide-react"
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
  return (
    <section id="projects" className="py-24 max-w-5xl mx-auto px-6">
      <FadeUp>
      <p className="text-base font-mono uppercase tracking-wider text-muted-foreground">Projects</p>
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        {/* Card 1 — AI Academic Assistant */}
        <Dialog>
          <Card className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
            <AspectRatio ratio={16 / 9} className="relative bg-muted">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Layers className="h-8 w-8 opacity-40" />
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
              <CardTitle>AI Academic Assistant</CardTitle>
              <CardDescription>Full-stack AI academic platform with 6 LangGraph agents</CardDescription>
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
              <div className="flex gap-2">
                <DialogTrigger render={<Button variant="outline" size="sm" />}>
                  <Play data-icon="inline-start" className="h-3 w-3" /> Watch Demo
                </DialogTrigger>
                <Link
                  href="/projects/ai-academic-assistant"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  View Case Study →
                </Link>
              </div>
            </CardFooter>
          </Card>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Academic Assistant — Demo</DialogTitle>
              <DialogDescription>90-second walkthrough of the full platform.</DialogDescription>
            </DialogHeader>
            <VideoEmbed videoId="PLACEHOLDER_FYP" />
            <p className="text-sm text-muted-foreground text-center">Demo video coming soon.</p>
          </DialogContent>
        </Dialog>

        {/* Card 2 — AI-Powered Outdoor Event System */}
        <Dialog>
          <Card className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
            <AspectRatio ratio={16 / 9} className="relative bg-muted">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Layers className="h-8 w-8 opacity-40" />
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
                <DialogTrigger render={<Button variant="outline" size="sm" />}>
                  <Play data-icon="inline-start" className="h-3 w-3" /> Watch Demo
                </DialogTrigger>
                <a
                  href="https://github.com/ztsia/outdoor-game-manager-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  <Code2 data-icon="inline-start" className="h-3 w-3" /> GitHub
                </a>
                <Dialog>
                  <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
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
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Manager</span>
                        <span className="bg-muted px-2 py-1 rounded text-foreground">{CAMP_ACCESS_CODES.manager}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">HQ</span>
                        <span className="bg-muted px-2 py-1 rounded text-foreground">{CAMP_ACCESS_CODES.hq}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Admin</span>
                        <span className="bg-muted px-2 py-1 rounded text-foreground">{CAMP_ACCESS_CODES.admin}</span>
                      </div>
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
              </div>
            </CardFooter>
          </Card>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Outdoor Event System — Demo</DialogTitle>
              <DialogDescription>60-second live event walkthrough.</DialogDescription>
            </DialogHeader>
            <VideoEmbed videoId="PLACEHOLDER_CAMP" />
            <p className="text-sm text-muted-foreground text-center">Demo video coming soon.</p>
          </DialogContent>
        </Dialog>

      </div>
      </FadeUp>
    </section>
  )
}
