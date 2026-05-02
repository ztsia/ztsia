import fs from "fs"
import path from "path"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VideoEmbed } from "@/components/video-embed"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ExternalLink, Mail, ShieldCheck } from "lucide-react"
import { InlineIcon } from "@/components/tech-icon"
import { MermaidDiagram, AgentTabs } from "@/components/fyp/fyp-dynamic"

const MASTER_DIAGRAM = `flowchart LR
    %% External Triggers
    CRON["⏰ Cron Jobs<br/>(Daily / Hourly)"]
    HOOK["🔗 DB Webhooks<br/>(Schedule Conflicts)"]

    subgraph CLIENTS ["🖥️ Client Tier"]
        direction TB
        WEB["<b>Web Frontend</b><br/>(Next.js)"]
        MOBILE["<b>Mobile Frontend</b><br/>(Expo)"]
    end

    subgraph BAAS ["☁️ Secure BaaS"]
        direction TB
        EDGE["⚡ <b>Edge Functions</b><br/>(AI Gateway)"]

        subgraph DB ["🗄️ PostgreSQL Database"]
            direction TB
            DB1["Learning Chunks &<br/>Knowledge Graphs"]
            DB2["Tasks, Routines &<br/>Calendar Events"]
            DB3["Quizzes, FSRS &<br/>Mastery Logs"]
        end
    end

    subgraph AI ["🧠 AI Service Tier"]
        direction TB
        ORCH["<b>FastAPI Server</b><br/>(Agent Orchestrator)"]
        A1["Agent 1:<br/>LMS Ingestion"]
        A2["Agent 2:<br/>Task Parser"]
        A3["Agent 3:<br/>RAG Query"]
        A4["Agent 4:<br/>CP-SAT Scheduler"]
        A5["Agent 5:<br/>Daily Planner"]
        A6["Agent 6:<br/>Data Analytics"]
    end

    subgraph EXT ["🌐 External Triggers & APIs"]
        direction TB
        LLM["Google Gemini API<br/>(Pro & Flash)"]
        LMS["University LMS<br/>(Mock API)"]
    end

    %% Client flows
    WEB & MOBILE == "Direct CRUD via RLS" ==> DB
    WEB & MOBILE == "User Invoke" ==> EDGE
    EDGE == "Bearer Token Auth" ==> ORCH

    %% Invocation
    ORCH --> A1 & A2 & A3 & A4 & A5 & A6

    %% Autonomous Triggers
    CRON -.->|Background Async Tasks| ORCH
    HOOK -.->|Conflict Detection| ORCH

    %% Internal AI workflows
    A5 -.->|1. Generates FSRS Quizzes| A3
    A5 -.->|2. Finds Calendar Slots| A4

    %% Agent to Database output mapping
    A1 -->|Extract Chunks & JSON Graphs| DB1
    A2 -->|Classify NLP Input| DB2
    A4 -->|Constraint Optimize| DB2
    A3 -->|3-Phase CoT Query| DB3
    A6 -->|Spaced Repetition update| DB3

    %% External APIs
    A1 -->|Web Scrape| LMS
    A1 & A2 & A3 & A4 & A6 -->|LLM Inference| LLM

    %% Styling
    classDef clientBox fill:#3b82f6,stroke:#1e40af,color:#fff,font-weight:bold
    classDef baasBox fill:#22c55e,stroke:#166534,color:#fff,font-weight:bold
    classDef aiBox fill:#a855f7,stroke:#6b21a8,color:#fff,font-weight:bold
    classDef dbBox fill:#dcfce7,stroke:#16a34a,color:#14532d,font-weight:bold
    classDef extBox fill:#f97316,stroke:#c2410c,color:#fff,font-weight:bold
    classDef triggerStyle fill:#fef3c7,stroke:#d97706,color:#92400e,font-weight:bold

    class WEB,MOBILE clientBox
    class EDGE baasBox
    class DB1,DB2,DB3 dbBox
    class A1,A2,A3,A4,A5,A6,ORCH aiBox
    class LLM,LMS extBox
    class CRON,HOOK triggerStyle`

const agentFiles: Record<string, string> = {
  scheduler: "agents/scheduler_graph_manual.md",
  rag: "agents/rag_graph_architecture.md",
  ingestion: "agents/ingestion_graph_manual.md",
  analytics: "agents/analytics_graph_architecture.md",
  cron: "agents/daily_cron_architecture.md",
  parser: "agents/parser_graph_architecture.md",
}

export default function FypDetailPage() {
  const contentDir = path.join(process.cwd(), "content")
  const agentMarkdown = Object.fromEntries(
    Object.entries(agentFiles).map(([id, file]) => [
      id,
      fs.readFileSync(path.join(contentDir, file), "utf-8"),
    ])
  )

  return (
    <div className="pt-16 overflow-x-hidden">
      <main className="max-w-5xl mx-auto px-6">

        {/* Back link — top */}
        <div className="pt-12 pb-8">
          <a href="/" className={cn(buttonVariants({ variant: "ghost" }), "gap-2 -ml-3")}>
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </a>
        </div>

        {/* Hero */}
        <section className="pb-16">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
            Final Year Project · UTAR · 2025–2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            AI Academic Assistant
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-3xl">
            A full-stack AI academic platform built across 4 repositories — cross-platform
            frontends, a production Supabase backend, and a Python AI microservice with 6
            specialized LangGraph agents for adaptive learning, autonomous scheduling, and
            semantic knowledge processing.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Next.js", "React Native", "FastAPI", "LangGraph", "Supabase", "OR-Tools", "Python", "TypeScript", "Gemini API"].map((tag) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs">{tag}</Badge>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/ztsia/fyp-ai-service"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <InlineIcon name="github" className="h-4 w-4" /> fyp-ai-service ↗
            </a>
            <a
              href="https://fyp-web-frontend-chi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <ExternalLink className="h-4 w-4" /> Live Frontend ↗
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&to=leosia929@gmail.com&su=FYP%20Demo%20Request%20%E2%80%94%20AI%20Academic%20Assistant&body=Hi%20Zhong%20Tai%2C%0A%0AI%27d%20like%20to%20schedule%20a%20live%20demo%20of%20your%20AI%20Academic%20Assistant%20FYP.%0A%0AName%3A%0ACompany%2FRole%3A%0APreferred%20time%3A%0A%0AThanks"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "default" }), "gap-2")}
            >
              <Mail className="h-4 w-4" /> Request Demo →
            </a>
          </div>
        </section>

        {/* Demo Video */}
        <section className="py-16 border-t border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Demo</h2>
          <VideoEmbed videoId="PLACEHOLDER_FYP" autoplay={false} />
          <p className="text-sm text-muted-foreground text-center mt-3">Demo video coming soon.</p>
        </section>

        {/* System Overview */}
        <section className="py-16 border-t border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-6">System Overview</h2>
          <MermaidDiagram chart={MASTER_DIAGRAM} />
          <div className="mt-8 space-y-3">
            <p className="text-muted-foreground leading-relaxed">The platform operates across 4 tiers:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm ml-2">
              <li><span className="text-foreground font-medium">Client Tier:</span> Next.js web + React Native (Expo) mobile</li>
              <li><span className="text-foreground font-medium">BaaS Tier:</span> Supabase (PostgreSQL, Auth, Edge Functions, Realtime)</li>
              <li><span className="text-foreground font-medium">AI Service Tier:</span> FastAPI + 6 LangGraph agents</li>
              <li><span className="text-foreground font-medium">External:</span> Google Gemini API + Mock LMS</li>
            </ul>
          </div>
          <Alert className="mt-6">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Security model</AlertTitle>
            <AlertDescription>
              Frontends never call the AI service directly. All AI requests traverse Supabase Edge
              Functions with Bearer token authentication — the AI service URL is never exposed to
              the client.
            </AlertDescription>
          </Alert>
        </section>

        {/* Agent Tabs */}
        <AgentTabs markdown={agentMarkdown} />
        {/* Infrastructure Highlights */}
        <section className="py-16 border-t border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Infrastructure Highlights</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-base">Security</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>RLS on all 19 tables</li>
                  <li>Edge Function gateway</li>
                  <li>Signed URL storage</li>
                  <li>Bearer auth gateway</li>
                </ul>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-base">Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>FSRS + BKT-weighted EMA mastery scoring</li>
                  <li>FSRS review scheduling per concept</li>
                </ul>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-base">Background Infra</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>3 asyncio loops</li>
                  <li>No Celery, no Cloud Scheduler</li>
                  <li>Zero external dependencies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Request Demo */}
        <section className="py-16 border-t border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-3">Schedule a Demo</h2>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            The AI service runs a persistent asyncio background scheduler and cannot be hosted on
            serverless platforms.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&to=leosia929@gmail.com&su=FYP%20Demo%20Request%20%E2%80%94%20AI%20Academic%20Assistant&body=Hi%20Zhong%20Tai%2C%0A%0AI%27d%20like%20to%20schedule%20a%20live%20demo%20of%20your%20AI%20Academic%20Assistant%20FYP.%0A%0AName%3A%0ACompany%2FRole%3A%0APreferred%20time%3A%0A%0AThanks"
              target="_blank"
              rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "default" }), "mt-6 gap-2")}
          >
            <Mail className="h-4 w-4" /> Schedule a Demo Session →
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            I'll spin up a session — Parser Agent, RAG quiz generation, and CP-SAT scheduling
            available to demo live.
          </p>
        </section>

        {/* Footer back link */}
        <div className="py-8 border-t border-border">
          <a href="/" className={cn(buttonVariants({ variant: "ghost" }), "gap-2 -ml-3")}>
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </a>
        </div>

      </main>
    </div>
  )
}
