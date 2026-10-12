"use client"

import { useEffect } from "react"
import type { WorldName } from "@/components/world"

/** Puts a whole page in one project's world, e.g. a case study. */
export function WorldPage({ name }: { name: WorldName }) {
  useEffect(() => {
    const html = document.documentElement
    html.dataset.world = name
    return () => {
      if (html.dataset.world === name) delete html.dataset.world
    }
  }, [name])
  return null
}
