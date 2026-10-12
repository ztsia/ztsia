"use client"

import { useEffect, useImperativeHandle, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

export type StringsHandle = {
  /** Pluck string `i` at `xFrac` (0..1 of width) with `amp` px of displacement. */
  pluck: (i: number, amp: number, xFrac?: number) => void
}

type StringState = {
  y: number
  disp: number
  vel: number
  px: number
  grabbed: boolean
  gauge: number
}

// Violin strings, low to high. Lower strings are thicker and ring slower.
const GAUGES = [2.2, 1.7, 1.3, 1]
const PULL_LIMIT = 46
const DAMPING = 2.6

/**
 * Horizontal strings that can be plucked by moving the pointer (or a finger)
 * across them. Each string sits on the vertical centre of a matching
 * `[data-string-anchor]` element inside `anchorsRoot`, so the strings follow
 * the layout at every breakpoint.
 */
export function Strings({
  anchorsRoot,
  ref,
  className,
  labels,
}: {
  anchorsRoot: React.RefObject<HTMLElement | null>
  ref?: React.Ref<StringsHandle>
  className?: string
  labels?: string[]
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathsRef = useRef<(SVGPathElement | null)[]>([])
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([])
  const state = useRef<StringState[]>([])
  const width = useRef(0)
  const reduced = useRef(false)

  const count = labels?.length ?? 1

  useImperativeHandle(ref, () => ({
    pluck(i, amp, xFrac = 0.5) {
      const s = state.current[i]
      if (!s || reduced.current) return
      s.grabbed = false
      s.px = width.current * xFrac
      s.disp = amp
      s.vel = 0
    },
  }))

  useEffect(() => {
    const svg = svgRef.current
    const root = anchorsRoot.current
    if (!svg || !root) return
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const draw = (s: StringState, i: number) => {
      const path = pathsRef.current[i]
      if (!path) return
      const w = width.current
      const y = s.y
      const d = s.disp
      if (Math.abs(d) < 0.05) {
        path.setAttribute("d", `M0 ${y}H${w}`)
      } else {
        const px = Math.min(Math.max(s.px, 24), w - 24)
        // Two quadratic halves meeting at the pluck point with a flat tangent,
        // so the bend reads as one smooth string rather than a kink.
        path.setAttribute(
          "d",
          `M0 ${y}Q${px * 0.62} ${y + d} ${px} ${y + d}Q${px + (w - px) * 0.38} ${y + d} ${w} ${y}`
        )
      }
      const energy = Math.min(1, Math.abs(d) / 18)
      path.style.stroke = `color-mix(in oklab, var(--signal) ${Math.round(energy * 100)}%, var(--ink-soft))`
      path.style.strokeOpacity = String(0.42 + energy * 0.58)
    }

    const measure = () => {
      const box = svg.getBoundingClientRect()
      width.current = box.width
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`)
      const anchors = root.querySelectorAll<HTMLElement>("[data-string-anchor]")
      for (let i = 0; i < count; i++) {
        const a = anchors[i]
        if (!a) continue
        const r = a.getBoundingClientRect()
        const y = r.top + r.height / 2 - box.top
        const prev = state.current[i]
        state.current[i] = {
          y,
          disp: prev?.disp ?? 0,
          vel: prev?.vel ?? 0,
          px: prev?.px ?? box.width / 2,
          grabbed: false,
          gauge: GAUGES[i] ?? 1,
        }
        const label = labelsRef.current[i]
        if (label) label.style.transform = `translateY(${y}px) translateY(-50%)`
        draw(state.current[i], i)
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    ro.observe(svg)
    document.fonts?.ready.then(measure)

    if (reduced.current) return () => ro.disconnect()

    // Pointer: grab a string when the pointer crosses it, drag it, and let go
    // once it is pulled past the limit. The release is the pluck.
    let last: { x: number; y: number } | null = null
    const move = (clientX: number, clientY: number) => {
      const box = svg.getBoundingClientRect()
      const x = clientX - box.left
      const y = clientY - box.top
      const inside = x >= 0 && x <= box.width && y >= -PULL_LIMIT && y <= box.height + PULL_LIMIT
      if (!inside) {
        release()
        last = null
        return
      }
      for (const s of state.current) {
        if (!s) continue
        if (s.grabbed) {
          s.disp = y - s.y
          s.px = x
          if (Math.abs(s.disp) > PULL_LIMIT) {
            s.grabbed = false
            s.disp = Math.sign(s.disp) * PULL_LIMIT
            s.vel = 0
          }
        } else if (last && (last.y - s.y) * (y - s.y) < 0 && Math.abs(s.disp) < 6) {
          s.grabbed = true
          s.px = x
          s.disp = y - s.y
          s.vel = 0
        }
      }
      last = { x, y }
    }
    const release = () => {
      for (const s of state.current) if (s?.grabbed) s.grabbed = false
    }
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      move(e.clientX, e.clientY)
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) move(t.clientX, t.clientY)
    }
    const onTouchEnd = () => {
      release()
      last = null
    }

    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("touchmove", onTouch, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    document.documentElement.addEventListener("pointerleave", release)

    // Damped spring per string. Thicker strings ring at a lower frequency.
    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 32) / 1000
      state.current.forEach((s, i) => {
        if (!s) return
        if (!s.grabbed) {
          if (Math.abs(s.disp) < 0.05 && Math.abs(s.vel) < 0.5) {
            if (s.disp !== 0) {
              s.disp = 0
              s.vel = 0
              draw(s, i)
            }
            return
          }
          const omega = (2 * Math.PI * 11) / s.gauge
          // Integrate in small steps; the spring is stiff
          const steps = 4
          const h = dt / steps
          for (let k = 0; k < steps; k++) {
            const acc = -omega * omega * s.disp - DAMPING * 2 * s.vel
            s.vel += acc * h
            s.disp += s.vel * h
          }
        }
        draw(s, i)
      })
    }
    gsap.ticker.add(tick)

    return () => {
      ro.disconnect()
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("touchmove", onTouch)
      window.removeEventListener("touchend", onTouchEnd)
      document.documentElement.removeEventListener("pointerleave", release)
      gsap.ticker.remove(tick)
    }
  }, [anchorsRoot, count])

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <svg ref={svgRef} className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
        {Array.from({ length: count }, (_, i) => (
          <path
            key={i}
            ref={(el) => {
              pathsRef.current[i] = el
            }}
            data-string
            fill="none"
            strokeLinecap="round"
            strokeWidth={GAUGES[i] ?? 1}
            vectorEffect="non-scaling-stroke"
            style={{ stroke: "var(--ink-soft)", strokeOpacity: 0.42 }}
          />
        ))}
      </svg>
      {labels?.map((l, i) => (
        <span
          key={l}
          ref={(el) => {
            labelsRef.current[i] = el
          }}
          data-string-label
          className="absolute left-2 top-0 bg-background px-1.5 text-xs font-medium text-ink-soft sm:left-4"
        >
          {l}
        </span>
      ))}
    </div>
  )
}
