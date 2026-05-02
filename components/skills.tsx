import { FadeUp } from "@/components/fade-up"
import { TechIcon } from "@/components/tech-icon"

export function Skills() {
  return (
    <section id="skills" className="py-24 max-w-5xl mx-auto px-6">
      <FadeUp>
      <p className="text-base font-mono uppercase tracking-wider text-muted-foreground">Skills</p>

      <p className="text-sm text-muted-foreground font-mono mt-8 mb-4">Core Stack</p>
      <div className="flex flex-wrap gap-8 items-center">
        <TechIcon name="python" label="Python" />
        <TechIcon name="typescript" label="TypeScript" />
        <TechIcon name="nextdotjs" label="Next.js" />
        <TechIcon name="react" label="React" />
        <TechIcon name="fastapi" label="FastAPI" />
        <TechIcon name="nodedotjs" label="Node.js" />
        <TechIcon name="vuedotjs" label="Vue.js" />
      </div>

      <p className="text-sm text-muted-foreground font-mono mt-8 mb-4">AI & Infrastructure</p>
      <div className="flex flex-wrap gap-8 items-center">
        <TechIcon name="supabase" label="Supabase" />
        <TechIcon name="docker" label="Docker" />
        <TechIcon name="langgraph" label="LangGraph" />
        <TechIcon name="ortools" label="OR-Tools" />
        <TechIcon name="githubactions" label="GitHub Actions" />
      </div>
      </FadeUp>
    </section>
  )
}
