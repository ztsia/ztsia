import { FadeUp } from "@/components/fade-up"

export function About() {
  return (
    <section id="about" className="py-24 max-w-5xl mx-auto px-6">
      <FadeUp>
      <p className="text-base font-mono uppercase tracking-wider text-muted-foreground mb-6">About</p>
      <div className="max-w-2xl space-y-4 text-foreground leading-relaxed">
        <p>
          Final year Software Engineering student at UTAR, graduating June 2026. I spent my
          internship shipping a LangGraph multi-agent system at a Malaysian AI startup. My FYP is a
          full-stack AI academic platform — 6 LangGraph agents, a CP-SAT scheduling engine, FSRS
          spaced repetition, and a 19-table Supabase backend across 4 repositories.
        </p>
        <p className="text-muted-foreground">
          &ldquo;I&rsquo;m drawn to roles where AI is the product, not a feature.&rdquo;
        </p>
        <p>
          When I&rsquo;m not building, I lead 100+ person concert operations as Concertmaster of
          Galaxy Chamber Orchestra.
        </p>
      </div>
      </FadeUp>
    </section>
  )
}
