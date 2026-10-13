"use client"

import { gsap } from "@/lib/gsap"
import { SceneShell, type SceneContext } from "@/components/scenes/scene-shell"
import { cn } from "@/lib/utils"

const CHAPTERS = [
  {
    title: "Sixty players, one live map.",
    body: "Teams fought over buildings across the venue from their phones, and every screen watched the same map.",
  },
  {
    title: "Captures land for everyone at once.",
    body: "Owners, scores and the leaderboard update live on every device the moment a capture commits. The server, not the phone, decides.",
  },
  {
    title: "Same building, same second.",
    body: "Every capture runs as a Firestore transaction. Both teams read the building as free; one commits, the other's transaction retries, sees the new owner, and is rejected.",
  },
  {
    title: "No accounts, three tiers.",
    body: "Each device enters an access code that maps to Manager, HQ or Admin. Team devices take their team's colours from the code, with no extra UI.",
  },
]

const FACTS = [
  { value: 60, label: "participants on the day" },
  { value: 6, label: "team managers running it live" },
  { value: 3, label: "role tiers: manager, HQ, admin" },
]

type Team = "green" | "blue" | "ungu" | "fire"
const TEAMS: Record<Team, { name: string; color: string }> = {
  green: { name: "Team Green", color: "#1f9a55" },
  blue: { name: "Team Blue", color: "#2e67dc" },
  ungu: { name: "Rumah Ungu", color: "#8248d8" },
  fire: { name: "Fireforce", color: "#d93a31" },
}
const ORDER: Team[] = ["green", "blue", "ungu", "fire"]

// The venue, traced from the game's own map (outdoor-game-manager-app/src/assets/map.png)
const ROADS = ["M36 200 H675", "M36 200 V831 H138", "M80 248 H527 V419", "M80 248 V797 H138", "M558 247 H675 M558 247 V419"]
type Plot = { id: string; x: number; y: number; w: number; h: number; d?: string; label?: string }
const PLOTS: Plot[] = [
  { id: "changfeng", x: 320, y: 72, w: 186, h: 103, label: "Chang Feng" },
  { id: "kinenkan", x: 320, y: 270, w: 186, h: 104, label: "Kinenkan" },
  { id: "hall-a", x: 824, y: 161, w: 180, h: 85 },
  { id: "hall-b", x: 887, y: 269, w: 113, h: 206 },
  { id: "south", x: 810, y: 497, w: 223, h: 107 },
  { id: "b1", x: 105, y: 419, w: 93, h: 264 },
  { id: "b2", x: 218, y: 419, w: 144, h: 264 },
  { id: "b3", x: 362, y: 419, w: 93, h: 264 },
  { id: "b4", x: 464, y: 419, w: 93, h: 264 },
  { id: "kiosk", x: 599, y: 611, w: 148, h: 50 },
  { id: "carpark", x: 138, y: 774, w: 168, h: 131, label: "Open Space Carpark" },
  { id: "c2", x: 331, y: 734, w: 192, h: 171 },
  { id: "c3", x: 548, y: 790, w: 69, h: 115 },
  { id: "d1", x: 681, y: 700, w: 83, h: 83 },
  { id: "f1", x: 784, y: 700, w: 96, h: 145, label: "F1" },
  { id: "d3", x: 893, y: 700, w: 48, h: 145, d: "M893 700 H1001 V761 H941 V845 H893 Z" },
  { id: "d4", x: 946, y: 765, w: 55, h: 80 },
  { id: "d5", x: 1014, y: 699, w: 80, h: 148 },
  { id: "d6", x: 1107, y: 699, w: 71, h: 148 },
  { id: "d7", x: 1185, y: 699, w: 71, h: 148 },
  { id: "strip", x: 978, y: 869, w: 257, h: 74 },
]
const shape = (p: Plot) => p.d ?? `M${p.x} ${p.y} h${p.w} v${p.h} h${-p.w} Z`
const COMPOUND = "M675 139 h358 v358 h-358 Z"

// The replayed run: who takes which plot, in order
const CAPTURES: [string, Team][] = [
  ["b2", "green"], ["f1", "blue"], ["hall-b", "ungu"], ["carpark", "fire"], ["changfeng", "blue"],
  ["d5", "green"], ["c2", "fire"], ["hall-a", "ungu"], ["b1", "green"], ["d3", "blue"],
  ["south", "ungu"], ["b2", "fire"], ["strip", "green"], ["b4", "blue"],
]
const RACE_PLOT = "kinenkan"
const POINTS = 100
const ROW = 2.4 // rem per leaderboard row

function standings(upto: number) {
  const owner: Record<string, Team> = {}
  for (let i = 0; i < upto; i++) owner[CAPTURES[i][0]] = CAPTURES[i][1]
  const score: Record<Team, number> = { green: 0, blue: 0, ungu: 0, fire: 0 }
  for (const t of Object.values(owner)) score[t] += POINTS
  const rank = [...ORDER].sort((a, b) => score[b] - score[a] || ORDER.indexOf(a) - ORDER.indexOf(b))
  return { score, rank }
}

function animate(tl: gsap.core.Timeline, { q }: SceneContext) {
  // 1. The map draws itself
  tl.fromTo(q("[data-board]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0)
    .fromTo(q("[data-road]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, stagger: 0.04 }, 0.05)
    .fromTo(q("[data-outline]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, stagger: 0.015 }, 0.15)
    .fromTo(q("[data-maplabel]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, stagger: 0.05 }, 0.55)
    .fromTo(q("[data-board-panel]"), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.12 }, 0.7)

  // 2. Captures replay; the leaderboard re-sorts after each one
  const fill = (id: string) => q(`[data-fill="${id}"]`)
  const ping = (id: string) => q(`[data-ping="${id}"]`)
  const rows = Object.fromEntries(ORDER.map((t) => [t, q(`[data-lb="${t}"]`)[0]])) as Record<Team, HTMLElement>
  const nums = Object.fromEntries(ORDER.map((t) => [t, q(`[data-lb-num="${t}"]`)[0]])) as Record<Team, HTMLElement>
  const feed = q("[data-feed]")[0]
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const step = { v: -1 }
  tl.fromTo(
    step,
    { v: -1 },
    {
      v: CAPTURES.length - 1,
      duration: (CAPTURES.length - 1) * 0.055 + 0.001,
      onUpdate: () => (feed.textContent = LOG[Math.floor(step.v + 0.0001)] ?? ""),
    },
    1.02
  )
  const shown: Record<Team, { v: number }> = { green: { v: 0 }, blue: { v: 0 }, ungu: { v: 0 }, fire: { v: 0 } }
  CAPTURES.forEach(([plot, team], i) => {
    const t = 1.02 + i * 0.055
    const after = standings(i + 1)
    tl.to(fill(plot), { fill: TEAMS[team].color, fillOpacity: 0.92, duration: 0.03 }, t)
      .fromTo(ping(plot), { scale: 0.2, autoAlpha: 0.9 }, { scale: 2.4, autoAlpha: 0, duration: 0.08, ease: "power2.out" }, t)
    ORDER.forEach((tm) => {
      tl.to(rows[tm], { y: after.rank.indexOf(tm) * ROW * rem, duration: 0.04, ease: "power2.inOut" }, t + 0.01).to(
        shown[tm],
        { v: after.score[tm], duration: 0.03, onUpdate: () => (nums[tm].textContent = String(Math.round(shown[tm].v))) },
        t
      )
    })
  })

  // 3. Two teams, one building, one winner
  // The map steps right back so the race card stands alone
  tl.to(q("[data-board], [data-board-panel]"), { autoAlpha: 0.1, scale: 0.97, duration: 0.08 }, 1.95)
    .to(q(`[data-fill="${RACE_PLOT}"]`), { fillOpacity: 0, duration: 0.01 }, 1.95)
    .fromTo(q("[data-race]"), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.1, ease: "power3.out" }, 2.0)
    .fromTo(q("[data-race-a]"), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.05, stagger: 0.12 }, 2.12)
    .fromTo(q("[data-race-b]"), { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.05, stagger: 0.12 }, 2.14)
    .to(q(`[data-fill="${RACE_PLOT}"]`), { fill: TEAMS.blue.color, fillOpacity: 0.92, duration: 0.03 }, 2.42)
    .fromTo(ping(RACE_PLOT), { scale: 0.2, autoAlpha: 0.9 }, { scale: 2.6, autoAlpha: 0, duration: 0.1 }, 2.42)
    .fromTo(q("[data-race-end]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 2.62)
    .to(q("[data-race]"), { autoAlpha: 0, scale: 0.96, duration: 0.1, ease: "power2.in" }, 2.88)
    .to(q("[data-board], [data-board-panel]"), { autoAlpha: 1, scale: 1, duration: 0.08 }, 2.9)

  // 4. One code per device, three tiers
  tl.to(q("[data-board], [data-board-panel]"), { autoAlpha: 0.1, scale: 0.97, duration: 0.12 }, 3.0)
    .fromTo(
      q("[data-device]"),
      { autoAlpha: 0, y: 80, rotate: (i) => (i - 1) * 6 },
      { autoAlpha: 1, y: 0, rotate: 0, duration: 0.16, stagger: 0.08, ease: "power3.out" },
      3.06
    )
    .fromTo(q("[data-code]"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.16, ease: "steps(10)", stagger: 0.08 }, 3.2)
}

const LOG = CAPTURES.map(
  ([plot, team]) => `${TEAMS[team].name} captured ${PLOTS.find((p) => p.id === plot)?.label ?? "a building"}`
)

function Board() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
      <div data-board className="relative w-full md:min-w-0 md:flex-1">
        <div className="relative overflow-hidden rounded-[14px] border-2 border-w-fg bg-[#fffdf3]">
          <svg viewBox="0 0 1280 975" className="block w-full" aria-hidden>
            <g fill="none" stroke="#17150c" strokeWidth={3}>
              {ROADS.map((d) => (
                <path key={d} data-road d={d} pathLength={1} strokeDasharray="1" strokeDashoffset="1" strokeOpacity={0.35} />
              ))}
              <path data-outline d={COMPOUND} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
            </g>
            {PLOTS.map((p) => (
              <path key={`f-${p.id}`} data-fill={p.id} d={shape(p)} fill="#17150c" fillOpacity={0} />
            ))}
            <g fill="none" stroke="#17150c" strokeWidth={3}>
              {PLOTS.map((p) => (
                <path key={`o-${p.id}`} data-outline d={shape(p)} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
              ))}
            </g>
            {PLOTS.map((p) => (
              <circle
                key={`p-${p.id}`}
                data-ping={p.id}
                cx={p.x + p.w / 2}
                cy={p.y + p.h / 2}
                r={40}
                fill="none"
                stroke="#17150c"
                strokeWidth={4}
                opacity={0}
                className="[transform-box:fill-box] [transform-origin:center]"
              />
            ))}
            {PLOTS.filter((p) => p.label).map((p) => (
              <text
                key={`l-${p.id}`}
                data-maplabel
                x={p.x + p.w / 2}
                y={p.y + p.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#17150c] text-[30px] font-semibold"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                {p.label}
              </text>
            ))}
          </svg>
        </div>
      </div>

      <div
        data-board-panel
        className="invisible hidden w-full shrink-0 rounded-[14px] border-2 border-w-fg bg-w-panel p-2.5 md:block md:w-48"
      >
        <ol className="relative" style={{ height: `${ROW * 4}rem` }} aria-hidden>
          {ORDER.map((t, i) => (
            <li
              key={t}
              data-lb={t}
              className="absolute inset-x-0 top-0 flex items-center gap-2 rounded-lg px-2 text-sm"
              style={{ height: `${ROW - 0.3}rem`, transform: `translateY(${i * ROW}rem)` }}
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: TEAMS[t].color }} />
              <span className="flex-1 truncate font-medium">{TEAMS[t].name}</span>
              <span data-lb-num={t} className="tabular">
                0
              </span>
            </li>
          ))}
        </ol>
        <p data-feed aria-hidden className="mt-1 h-[2.6em] border-t border-w-fg/15 pt-1.5 text-[11px] leading-tight text-w-soft" />
      </div>

      <Race />
      <Devices />
    </div>
  )
}

function Race() {
  const step = "flex items-center gap-2 rounded-full border-2 border-w-fg bg-[#fffdf3] px-3 py-1 text-[11px] font-medium md:text-[12px]"
  return (
    <div data-race className="invisible absolute inset-0 grid place-items-center px-2">
      <div className="w-full max-w-[34rem] rounded-[18px] border-2 border-w-fg bg-w-panel p-4 shadow-[0_24px_0_-12px_#17150c]">
        <p className="text-center text-sm font-semibold">Both tap &ldquo;capture&rdquo; on Kinenkan</p>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <span className="size-2.5 rounded-full" style={{ background: TEAMS.blue.color }} /> Team Blue
          </p>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <span className="size-2.5 rounded-full" style={{ background: TEAMS.fire.color }} /> Fireforce
          </p>
          <span data-race-a className={step}>read: free</span>
          <span data-race-b className={step}>read: free</span>
          <span data-race-a className={step}>write: owner Blue</span>
          <span data-race-b className={step}>write: owner Fireforce</span>
          <span data-race-a className={cn(step, "bg-[#1f9a55] text-white")}>commit</span>
          <span data-race-b className={cn(step, "border-dashed")}>conflict, retry</span>
          <span />
          <span data-race-b className={step}>read: owner Blue</span>
          <span />
          <span data-race-b className={cn(step, "bg-[#d93a31] text-white")}>rejected</span>
        </div>
        <p data-race-end className="invisible mt-4 text-center text-[13px] leading-snug">
          One owner, on every screen. No double capture to untangle afterwards.
        </p>
      </div>
    </div>
  )
}

function Devices() {
  const devices = [
    { role: "Manager", code: "GREEN-••••", note: "Runs one team. Takes the team's colours.", color: TEAMS.green.color },
    { role: "HQ", code: "HQ-••••", note: "The live map, battles and cooldowns.", color: "#17150c" },
    { role: "Admin", code: "ADMIN-••••", note: "Teams, territories, rules and scoring.", color: "#4d4520" },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 md:gap-4">
      {devices.map((d) => (
        <div
          key={d.role}
          data-device
          className="invisible aspect-[9/16] w-[30%] max-w-[12rem] rounded-[22px] border-2 border-w-fg bg-[#fffdf3] p-2 shadow-[0_18px_0_-8px_#17150c]"
        >
          <div className="flex h-full flex-col rounded-[14px] p-2.5 text-white md:p-3" style={{ background: d.color }}>
            <p className="text-[10px] uppercase tracking-[0.12em] opacity-80">Access code</p>
            <p data-code className="mt-1 font-mono text-[11px] md:text-[13px]">
              {d.code}
            </p>
            <p className="mt-[28%] text-[clamp(1.1rem,2.2vw,1.8rem)] font-bold leading-none">{d.role}</p>
            <p className="mt-2 text-[10px] leading-snug opacity-85 md:text-[11px]">{d.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function FieldScene({ children }: { children: React.ReactNode }) {
  return (
    <SceneShell
      id="event"
      world="field"
      index="03 / 03"
      title="Real-time outdoor event system"
      chapters={CHAPTERS}
      facts={FACTS}
      factsNote="The map is the event's own venue map. The capture replay is an illustration."
      stage={<Board />}
      animate={animate}
    >
      {children}
    </SceneShell>
  )
}
