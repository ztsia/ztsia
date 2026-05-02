"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import mermaid from "mermaid"

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!ref.current) return
    const id = `mermaid-${Math.random().toString(36).slice(2)}`
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === "dark" ? "dark" : "neutral",
    })
    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch(() => {
        if (ref.current) ref.current.textContent = chart
      })
  }, [chart, resolvedTheme])

  return (
    <div
      ref={ref}
      className="my-4 max-w-full overflow-x-auto rounded-lg border border-border p-4 bg-card"
    />
  )
}
