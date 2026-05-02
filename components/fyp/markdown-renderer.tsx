"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { MermaidDiagram } from "@/components/fyp/mermaid-diagram"
import { cn } from "@/lib/utils"

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2({ children }) {
          return (
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-8 mb-3">
              {children}
            </h2>
          )
        },
        p({ children }) {
          return (
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>
          )
        },
        strong({ children }) {
          return (
            <strong className="font-semibold text-foreground text-sm">{children}</strong>
          )
        },
        ul({ children }) {
          return <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-3">{children}</ul>
        },
        li({ children }) {
          return <li>{children}</li>
        },
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || "")
          if (match?.[1] === "mermaid") {
            return <MermaidDiagram chart={String(children).trim()} />
          }
          return (
            <code className={cn("font-mono text-xs bg-muted px-1 py-0.5 rounded", className)}>
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
