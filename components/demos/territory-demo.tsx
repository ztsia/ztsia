"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { Flip, gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

type TeamId = "green" | "blue" | "ungu" | "fire"

const TEAMS: Record<TeamId, { name: string; color: string }> = {
  green: { name: "Team Green", color: "#1f9a55" },
  blue: { name: "Team Blue", color: "#2e67dc" },
  ungu: { name: "Rumah Ungu", color: "#8248d8" },
  fire: { name: "Fireforce", color: "#d93a31" },
}

// A simplified version of the event map; positions are % of the board
const ZONES = [
  { id: "aud", name: "Auditorium", x: 2, y: 10, w: 12, h: 56, stars: 3 },
  { id: "f2", name: "Field 2", x: 16, y: 10, w: 14, h: 27, stars: 2 },
  { id: "f1", name: "Field 1", x: 16, y: 39, w: 14, h: 27, stars: 2 },
  { id: "roof", name: "Rooftop Carpark", x: 32, y: 10, w: 13, h: 56, stars: 1 },
  { id: "canteen", name: "Canteen", x: 30, y: 70, w: 24, h: 26, stars: 3 },
  { id: "martial", name: "Martial Art Area", x: 49, y: 30, w: 21, h: 18, stars: 1 },
  { id: "foyer", name: "Foyer", x: 58, y: 56, w: 13, h: 40, stars: 2 },
  { id: "cello", name: "Cello Room", x: 73, y: 56, w: 12, h: 40, stars: 1 },
  { id: "dorm", name: "Dorm Corridor", x: 74, y: 8, w: 24, h: 22, stars: 3 },
  { id: "tss", name: "TSS Carpark", x: 87, y: 34, w: 11, h: 62, stars: 2 },
]

const START: Record<string, TeamId> = { f2: "green", foyer: "blue", dorm: "ungu", canteen: "fire", aud: "blue" }

function scores(owners: Record<string, TeamId>) {
  const s: Record<TeamId, number> = { green: 0, blue: 0, ungu: 0, fire: 0 }
  for (const z of ZONES) {
    const o = owners[z.id]
    if (o) s[o] += z.stars * 100
  }
  return (Object.keys(s) as TeamId[]).map((id) => ({ id, score: s[id] })).sort((a, b) => b.score - a.score)
}

export function TerritoryDemo() {
  const root = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const [team, setTeam] = useState<TeamId>("green")
  const [owners, setOwners] = useState<Record<string, TeamId>>(START)
  const [feed, setFeed] = useState<string[]>(["Rumah Ungu captured Dorm Corridor"])
  const [racing, setRacing] = useState(false)
  const [races, setRaces] = useState(0)
  const rowsState = useRef<Flip.FlipState | null>(null)

  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const pop = (zoneId: string) => {
    const el = boardRef.current?.querySelector(`[data-zone="${zoneId}"]`)
    if (el && !reduce()) gsap.fromTo(el, { scale: 0.9 }, { scale: 1, duration: 0.6, ease: "back.out(3)" })
  }

  const commit = (zoneId: string, by: TeamId) => {
    rowsState.current = Flip.getState(root.current!.querySelectorAll("[data-row]"))
    setOwners((o) => ({ ...o, [zoneId]: by }))
    pop(zoneId)
  }

  const capture = (zoneId: string) => {
    if (racing) return
    const z = ZONES.find((x) => x.id === zoneId)!
    if (owners[zoneId] === team) {
      setFeed((f) => [`${z.name} already belongs to ${TEAMS[team].name}`, ...f].slice(0, 3))
      return
    }
    commit(zoneId, team)
    setFeed((f) => [`${TEAMS[team].name} captured ${z.name}`, ...f].slice(0, 3))
  }

  // Two teams tap the same zone at the same moment. The transaction lets one
  // win; the other retries, sees the zone changed, and is rejected.
  const race = () => {
    if (racing) return
    const free = ZONES.filter((z) => owners[z.id] !== team)
    const z = free[(races * 3) % Math.max(free.length, 1)] ?? ZONES[0]
    const rival = (Object.keys(TEAMS) as TeamId[]).find((t) => t !== team && t !== owners[z.id]) ?? "fire"
    // Alternate who lands first, so both outcomes show up
    const winner = races % 2 === 0 ? rival : team
    setRaces((r) => r + 1)
    const loser = winner === team ? rival : team
    setRacing(true)
    const el = boardRef.current?.querySelector<HTMLElement>(`[data-zone="${z.id}"]`)
    const tl = gsap.timeline({
      onComplete: () => {
        commit(z.id, winner)
        setFeed((f) =>
          [
            `${TEAMS[loser].name}: rejected, zone already taken`,
            `${TEAMS[winner].name} captured ${z.name}`,
            ...f,
          ].slice(0, 3)
        )
        setRacing(false)
      },
    })
    if (el && !reduce()) {
      tl.to(el, { outlineColor: TEAMS[team].color, duration: 0.2 })
        .to(el, { outlineColor: TEAMS[rival].color, duration: 0.2 })
        .to(el, { outlineColor: TEAMS[team].color, duration: 0.2 })
        .to(el, { outlineColor: "transparent", duration: 0.2 })
    } else tl.to({}, { duration: 0.1 })
  }

  useLayoutEffect(() => {
    const state = rowsState.current
    if (!state) return
    rowsState.current = null
    Flip.from(state, { duration: reduce() ? 0 : 0.7, ease: "expo.inOut" })
  }, [owners])

  const board = scores(owners)

  return (
    <div ref={root} className="grid gap-5">
      <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Play as">
        <span className="mr-1 text-sm text-w-soft">Play as</span>
        {(Object.keys(TEAMS) as TeamId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={team === id}
            onClick={() => setTeam(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-sm font-medium transition-colors",
              team === id ? "border-w-fg bg-w-fg text-w-bg" : "border-w-fg/25"
            )}
          >
            <span className="size-2.5 rounded-full" style={{ background: TEAMS[id].color }} />
            {TEAMS[id].name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_12.5rem]">
        <div
          ref={boardRef}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] border-2 border-w-fg bg-[#fffdf3]"
        >
          {ZONES.map((z) => {
            const o = owners[z.id]
            return (
              <button
                key={z.id}
                type="button"
                data-zone={z.id}
                onClick={() => capture(z.id)}
                aria-label={`${z.name}, ${z.stars} star${z.stars > 1 ? "s" : ""}, ${o ? `held by ${TEAMS[o].name}` : "unclaimed"}`}
                style={{
                  left: `${z.x}%`,
                  top: `${z.y}%`,
                  width: `${z.w}%`,
                  height: `${z.h}%`,
                  background: o ? TEAMS[o].color : "#ffffff",
                  color: o ? "#ffffff" : "#17150c",
                }}
                className="absolute flex flex-col items-center justify-center gap-0.5 rounded-md border-[1.5px] border-[#17150c] p-1 text-center outline-[3px] outline-offset-2 outline-transparent transition-colors duration-300 hover:brightness-95"
              >
                <span className="text-[clamp(8px,1.4vw,12px)] font-semibold leading-tight">{z.name}</span>
                <span aria-hidden className="text-[9px] tracking-[0.15em] opacity-80">
                  {"★".repeat(z.stars)}
                </span>
              </button>
            )
          })}
        </div>

        <div className="grid content-start gap-3">
          <ol className="grid gap-1.5" aria-label="Leaderboard">
            {board.map((row, i) => (
              <li
                key={row.id}
                data-row
                data-flip-id={`row-${row.id}`}
                className="flex items-center gap-2 rounded-lg bg-w-panel px-2.5 py-1.5 text-sm"
              >
                <span className="w-3 text-xs tabular text-w-soft">{i + 1}</span>
                <span className="size-2.5 rounded-full" style={{ background: TEAMS[row.id].color }} />
                <span className="flex-1 truncate font-medium">{TEAMS[row.id].name}</span>
                <span className="tabular">{row.score}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={race}
            disabled={racing}
            className="rounded-lg border-2 border-w-fg px-3 py-2 text-left text-sm font-medium leading-snug transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            Two teams tap the same zone at once
          </button>
        </div>
      </div>

      <ul aria-live="polite" className="grid gap-1 text-sm">
        {feed.map((f, i) => (
          <li key={`${f}-${i}`} className={cn(i > 0 && "text-w-soft")}>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
