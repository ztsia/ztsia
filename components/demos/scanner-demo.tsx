"use client"

import { useEffect, useRef, useState } from "react"
import { gsap, Draggable, useGSAP } from "@/lib/gsap"
import { cn } from "@/lib/utils"

// Guests from the Zetix demo concert
const TICKETS = [
  { id: "ZX-4F2A", name: "Maren Okafor", party: "Party of 2" },
  { id: "ZX-91C7", name: "Theo Whitfield", party: "Party of 1" },
  { id: "ZX-07BD", name: "Eleanor Whitfield", party: "Party of 3" },
]

type Screen =
  | { kind: "idle" }
  | { kind: "ok"; name: string; party: string; offline: boolean }
  | { kind: "dup"; name: string }
  | { kind: "synced"; count: number }

function seeded(id: string) {
  let h = 2166136261
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function Qr({ id }: { id: string }) {
  const rand = seeded(id)
  const cells: [number, number][] = []
  for (let y = 0; y < 9; y++)
    for (let x = 0; x < 9; x++) {
      const finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5)
      if (!finder && rand() > 0.52) cells.push([x, y])
    }
  return (
    <svg viewBox="0 0 9 9" className="size-full" aria-hidden>
      {[
        [0, 0],
        [6, 0],
        [0, 6],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x + 0.15} y={y + 0.15} width={2.7} height={2.7} fill="none" stroke="currentColor" strokeWidth={0.3} />
          <rect x={x + 0.9} y={y + 0.9} width={1.2} height={1.2} fill="currentColor" />
        </g>
      ))}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.1} y={y + 0.1} width={0.8} height={0.8} fill="currentColor" />
      ))}
    </svg>
  )
}

export function ScannerDemo() {
  const root = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const [admitted, setAdmitted] = useState<Record<string, boolean>>({})
  const [screen, setScreen] = useState<Screen>({ kind: "idle" })
  const [online, setOnline] = useState(true)
  const [pending, setPending] = useState(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const justDragged = useRef(false)

  const show = (s: Screen) => {
    setScreen(s)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setScreen({ kind: "idle" }), 2400)
  }

  useEffect(() => () => clearTimeout(idleTimer.current), [])

  // Draggable is created once; it calls the latest scan through this ref
  const scanRef = useRef<(id: string) => void>(() => {})

  const scan = (id: string) => {
    const t = TICKETS.find((x) => x.id === id)
    if (!t) return
    const phone = phoneRef.current
    if (admitted[id]) {
      show({ kind: "dup", name: t.name })
      if (phone && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.fromTo(phone, { x: 0 }, { x: 0, duration: 0.5, ease: "none", keyframes: { x: [0, -9, 8, -6, 4, 0] } })
      return
    }
    setAdmitted((a) => ({ ...a, [id]: true }))
    if (!online) setPending((p) => p + 1)
    show({ kind: "ok", name: t.name, party: t.party, offline: !online })
  }

  useEffect(() => {
    scanRef.current = scan
  })

  const toggleSignal = () => {
    const next = !online
    setOnline(next)
    if (next && pending > 0) {
      show({ kind: "synced", count: pending })
      setPending(0)
    }
  }

  const reset = () => {
    setAdmitted({})
    setPending(0)
    setOnline(true)
    setScreen({ kind: "idle" })
  }

  // Drag a ticket onto the phone to scan it
  useGSAP(
    () => {
      const phone = phoneRef.current
      if (!phone) return
      // Draggable's pointerX/Y are page coordinates; compare in viewport space
      const client = (e: Event) => {
        const p = "changedTouches" in e ? (e as TouchEvent).changedTouches[0] : (e as PointerEvent)
        return [p.clientX, p.clientY] as const
      }
      const over = (x: number, y: number) => {
        const r = phone.getBoundingClientRect()
        const pad = 24
        return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad
      }
      const drags = Draggable.create("[data-ticket]", {
        type: "x,y",
        dragClickables: true,
        zIndexBoost: true,
        onDragStart() {
          gsap.to(this.target, { scale: 0.62, duration: 0.35, ease: "power3.out" })
        },
        onDrag() {
          phone.dataset.hot = String(over(...client(this.pointerEvent)))
        },
        onDragEnd() {
          phone.dataset.hot = "false"
          // The browser's click after a drag is ignored; a drop on the phone scans
          justDragged.current = true
          setTimeout(() => (justDragged.current = false), 0)
          if (over(...client(this.pointerEvent))) scanRef.current(this.target.dataset.ticket as string)
        },
        onRelease() {
          gsap.to(this.target, { x: 0, y: 0, scale: 1, duration: 0.7, ease: "expo.out" })
        },
      })
      return () => drags.forEach((d) => d.kill())
    },
    { scope: root }
  )

  const count = Object.values(admitted).filter(Boolean).length

  return (
    <div ref={root} className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="order-2 grid gap-3 sm:order-1">
        <p className="text-sm text-w-soft">Drag a ticket onto the phone, or tap it.</p>
        {TICKETS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            data-ticket={t.id}
            onClick={() => {
              if (!justDragged.current) scan(t.id)
            }}
            aria-label={`Scan ticket for ${t.name}`}
            className={cn(
              "relative flex touch-none items-center gap-4 rounded-2xl bg-[#f6f1ea] p-3 pr-5 text-left text-[#18161f] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] outline-offset-4 select-none",
              "cursor-grab active:cursor-grabbing",
              i === 1 && "sm:ml-6",
              i === 2 && "sm:ml-12"
            )}
          >
            <span className="size-14 shrink-0 rounded-md bg-white p-1.5 text-[#18161f]">
              <Qr id={t.id} />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[#7b7487]">
                Gala evening
              </span>
              <span className="block truncate font-semibold">{t.name}</span>
              <span className="block text-xs text-[#7b7487]">
                {t.party}, unreserved seating
              </span>
            </span>
            {admitted[t.id] && (
              <span className="ml-auto -rotate-6 rounded-sm border-2 border-[#2fbf5a] px-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1f8f43]">
                Scanned
              </span>
            )}
          </button>
        ))}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            role="switch"
            aria-checked={online}
            onClick={toggleSignal}
            className="inline-flex items-center gap-2 rounded-full border border-w-rule px-3 py-1.5"
          >
            <span className={cn("size-2 rounded-full", online ? "bg-[#2fbf5a]" : "bg-w-soft")} />
            {online ? "Signal on" : "No signal"}
          </button>
          <button type="button" onClick={reset} className="text-w-soft underline-offset-4 hover:underline">
            Reset door
          </button>
        </div>
      </div>

      <div
        ref={phoneRef}
        data-hot="false"
        className="order-1 mx-auto aspect-[9/18] w-[200px] rounded-[34px] border border-[#3b3646] bg-[#0f0d14] p-2.5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] transition-[outline-color] outline-2 outline-offset-4 outline-transparent data-[hot=true]:outline-w-accent sm:order-2 sm:w-[220px]"
      >
        <div
          aria-live="polite"
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-[26px] text-center transition-colors duration-300",
            screen.kind === "ok" && "bg-[#2fbf5a] text-[#062b12]",
            screen.kind === "dup" && "bg-[#f5b33f] text-[#2b1a02]",
            screen.kind === "synced" && "bg-[#26222f] text-[#f6f1ea]",
            screen.kind === "idle" && "bg-[#14121a] text-[#f6f1ea]"
          )}
        >
          <div className="flex items-center justify-between px-4 pt-3 text-[10px] opacity-70">
            <span>Gala evening</span>
            <span>{online ? `${count}/3 in` : "Offline"}</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4">
            {screen.kind === "idle" && (
              <>
                <span className="relative block size-16" aria-hidden>
                  {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "left-0 bottom-0 border-l-2 border-b-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
                    <span key={c} className={cn("absolute size-4 rounded-[3px] border-[#f6f1ea]/70", c)} />
                  ))}
                </span>
                <span className="text-sm font-semibold">Ready at the door</span>
                <span className="text-[11px] opacity-60">Scan a ticket</span>
              </>
            )}
            {screen.kind === "ok" && (
              <>
                <span className="text-2xl font-bold">Admitted</span>
                <span className="text-sm font-semibold uppercase tracking-wide">{screen.name}</span>
                <span className="text-xs">{screen.party}</span>
                {screen.offline && (
                  <span className="mt-2 rounded-full bg-black/15 px-2.5 py-1 text-[10px] font-medium">
                    Saved offline. Syncs when signal returns.
                  </span>
                )}
              </>
            )}
            {screen.kind === "dup" && (
              <>
                <span className="text-xl font-bold">Already admitted</span>
                <span className="text-sm font-semibold uppercase tracking-wide">{screen.name}</span>
                <span className="text-xs">One ticket, one entry.</span>
              </>
            )}
            {screen.kind === "synced" && (
              <>
                <span className="text-lg font-bold">Back online</span>
                <span className="text-xs opacity-80">
                  Synced {screen.count} offline {screen.count === 1 ? "scan" : "scans"}
                </span>
              </>
            )}
          </div>
          <div className="pb-4 text-[10px] opacity-60">Zetix door scanner</div>
        </div>
      </div>
    </div>
  )
}
