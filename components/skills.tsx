const GROUPS = [
  {
    name: "AI and agents",
    items: ["LangGraph", "LLM integration", "RAG pipelines", "Prompt engineering", "n8n"],
  },
  {
    name: "Backend",
    items: ["Kotlin", "Spring Boot", "Java", "Python", "FastAPI", "Supabase", "PostgreSQL", "Node.js", "REST APIs"],
  },
  {
    name: "Frontend",
    items: ["TypeScript", "Next.js", "React Native (Expo)", "Tailwind CSS", "shadcn/ui"],
  },
  {
    name: "DevOps",
    items: ["Docker", "GitHub Actions", "CI/CD", "Vercel", "Firebase"],
  },
]

export function Skills() {
  return (
    <section id="stack" className="mx-auto max-w-[1400px] px-4 pb-28 sm:px-6 md:px-10 md:pb-40">
      <h2 className="font-wide text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.03em] [--wdth:118]">
        Stack
      </h2>
      <div className="mt-10 grid gap-x-10 gap-y-10 border-t-2 border-w-fg pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((g) => (
          <div key={g.name}>
            <h3 className="text-sm text-w-soft">{g.name}</h3>
            <ul className="mt-3 grid gap-1 text-xl font-medium tracking-[-0.01em]">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
