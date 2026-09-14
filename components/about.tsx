import { FadeUp } from "@/components/fade-up"

export function About() {
  return (
    <section id="about" className="py-24 max-w-5xl mx-auto px-6">
      <FadeUp>
      <p className="text-base font-mono uppercase tracking-wider text-muted-foreground mb-6">About</p>
      <div className="max-w-2xl space-y-4 text-foreground leading-relaxed">
        <p>
          Software Engineer at Mode Fair, building backend services in Kotlin and Spring Boot
          within an AI-native engineering workflow. B.Software Engineering from UTAR, 2026.
          Before this I shipped a LangGraph multi-agent system at a Malaysian AI startup, and
          built a full-stack AI academic platform as my final year project — 6 LangGraph agents,
          a CP-SAT scheduling engine, FSRS spaced repetition, and a production Supabase backend
          across 4 repositories.
        </p>
        <p className="text-muted-foreground">
          &ldquo;I&rsquo;m drawn to roles where AI is the product, not a feature.&rdquo;
        </p>
        <p>
          When I&rsquo;m not building, I lead concert operations for 100+ performer events as
          Concertmaster of Galaxy Chamber Orchestra.
        </p>
      </div>
      </FadeUp>
    </section>
  )
}
