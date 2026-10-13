"use client"

import { ScrollTrigger } from "@/lib/gsap"

export type WorldName = "zetix" | "study" | "field" | "ink"

/**
 * Sets data-world on <html> while `el` fills the middle of the viewport, so
 * dialogs and the page behind follow the section's palette. Sections paint
 * themselves (.world-paint), so this only matters for what sits outside them.
 * Refreshes after the pins, which change where sections sit.
 */
export function worldTrigger(el: Element, name: WorldName) {
  const html = document.documentElement
  return ScrollTrigger.create({
    trigger: el,
    start: "top 50%",
    end: "bottom 50%",
    refreshPriority: -1,
    onToggle: (self) => {
      if (self.isActive) html.dataset.world = name
      else if (html.dataset.world === name) delete html.dataset.world
    },
    onKill: () => {
      if (html.dataset.world === name) delete html.dataset.world
    },
  })
}
