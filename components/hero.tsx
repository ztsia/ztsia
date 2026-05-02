import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TechIcon } from "@/components/tech-icon"

export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6 py-24">
      <Badge
        variant="outline"
        className="text-primary border-primary/40 rounded-full w-fit"
      >
        Available July 2026 · Open to Remote
      </Badge>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mt-6">
        Sia Zhong Tai
      </h1>

      <p className="text-xl sm:text-2xl text-primary font-semibold mt-2">
        Full-Stack AI Engineer
      </p>

      <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
        Building LangGraph agents, RAG pipelines,
        <br />
        and the infrastructure behind them.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a href="#projects" className={cn(buttonVariants({ variant: "default" }))}>
          View My Work ↓
        </a>
        <a href="/resume.pdf" download className={cn(buttonVariants({ variant: "outline" }))}>
          Download Resume
        </a>
      </div>

      <hr className="border-border mt-12" />

      <div className="mt-8 flex flex-wrap gap-6 items-center opacity-60">
        <TechIcon name="python" />
        <TechIcon name="typescript" />
        <TechIcon name="supabase" />
        <TechIcon name="nextdotjs" />
        <TechIcon name="fastapi" />
        <TechIcon name="langgraph" />
      </div>
    </section>
  )
}
