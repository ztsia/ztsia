"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MarkdownRenderer } from "@/components/fyp/markdown-renderer"

const AGENT_ORDER = [
  { id: "scheduler", label: "Scheduler" },
  { id: "rag", label: "RAG" },
  { id: "ingestion", label: "Ingestion" },
  { id: "analytics", label: "Analytics" },
  { id: "cron", label: "Daily Cron" },
  { id: "parser", label: "Parser" },
] as const

export function AgentTabs({ markdown }: { markdown: Record<string, string> }) {
  return (
    <section className="py-16 border-t border-border">
      <h2 className="text-2xl font-semibold text-foreground mb-8">The Agents</h2>
      <Tabs defaultValue="scheduler">
        <div className="overflow-x-auto pb-1">
          <TabsList variant="line" className="w-max">
            {AGENT_ORDER.map((agent) => (
              <TabsTrigger key={agent.id} value={agent.id}>
                {agent.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {AGENT_ORDER.map((agent) => (
          <TabsContent key={agent.id} value={agent.id} className="mt-6">
            <MarkdownRenderer content={markdown[agent.id] ?? ""} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
