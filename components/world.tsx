"use client"

import { useRef } from "react"
import { useGSAP, ScrollTrigger } from "@/lib/gsap"
import { cn } from "@/lib/utils"

export type WorldName = "zetix" | "study" | "field"

/**
 * A section that recolours the whole page while it fills the middle of the
 * viewport, by setting data-world on <html>. The palettes live in globals.css.
 */
export function World({
  name,
  id,
  className,
  children,
  label,
}: {
  name: WorldName
  id?: string
  className?: string
  children: React.ReactNode
  label: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const html = document.documentElement
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) html.dataset.world = name
        else if (html.dataset.world === name) delete html.dataset.world
      },
    })
    return () => {
      st.kill()
      if (html.dataset.world === name) delete html.dataset.world
    }
  }, [name])

  return (
    <section ref={ref} id={id} aria-label={label} data-world-section={name} className={cn("relative", className)}>
      {children}
    </section>
  )
}
