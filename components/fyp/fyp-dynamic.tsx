"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

export const MermaidDiagram = dynamic(
  () => import("@/components/fyp/mermaid-diagram").then((m) => ({ default: m.MermaidDiagram })),
  { ssr: false, loading: () => <Skeleton className="h-48 w-full rounded-lg" /> }
)

export const AgentTabs = dynamic(
  () => import("@/components/fyp/agent-tabs").then((m) => ({ default: m.AgentTabs })),
  { ssr: false, loading: () => <Skeleton className="h-96 w-full rounded-lg" /> }
)
