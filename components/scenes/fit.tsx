"use client"

import { useEffect, useRef } from "react"

/**
 * Lays its child out at a fixed design size and scales it to fit the space
 * it's given, so a mock screen keeps its proportions and its text keeps its
 * place on a short phone stage as on a desktop one. Never scales up.
 */
export function Fit({
  width,
  height,
  margin = 0.94,
  children,
}: {
  width: number
  height: number
  margin?: number
  children: React.ReactNode
}) {
  const outer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = outer.current!
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect
      const k = Math.min(1, (w * margin) / width, (h * margin) / height)
      el.style.setProperty("--fit", String(Math.max(k, 0.1)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, height, margin])

  return (
    <div ref={outer} className="absolute inset-0 grid place-items-center">
      <div
        className="shrink-0"
        style={{ width, height, transform: "scale(var(--fit, 1))", transformOrigin: "center" }}
      >
        {children}
      </div>
    </div>
  )
}
