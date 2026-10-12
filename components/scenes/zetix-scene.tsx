"use client"

import Image from "next/image"
import { gsap } from "@/lib/gsap"
import { SceneShell, type SceneContext } from "@/components/scenes/scene-shell"
import { cn } from "@/lib/utils"

const CHAPTERS = [
  {
    title: "A party signs up.",
    body: "One form, one email address, a ticket for every guest in the party. Duplicate sign-ups are flagged for merging.",
  },
  {
    title: "Seats are claimed under a lock.",
    body: "One Postgres function locks the show before it counts, so two parties racing for the last seats can't oversell the hall. Its concurrency tests run in CI against a real Postgres.",
  },
  {
    title: "Every guest gets a ticket.",
    body: "A QR ticket by email and a personal page for each guest. Every send is idempotent, so pressing Send twice is harmless.",
  },
  {
    title: "The door works with no signal.",
    body: "The scanner downloads the show's roster and admits from it offline. On the night, two ushers' phones lost signal mid-rush, admitted 6 guests anyway, and synced when they reconnected.",
  },
]

const FACTS = [
  { value: 400, label: "tickets issued" },
  { value: 334, label: "guests admitted by 7 ushers" },
  { value: 51, label: "admitted in the busiest five minutes" },
  { value: 6, label: "admitted offline when two phones lost signal" },
]

// The hall in the illustration: 240 seats, 235 already taken
const SEATS = 240
const TAKEN = 235

const SQL = [
  { t: "-- Serialise per hall. Everything below reads counts", c: true },
  { t: "-- and then writes rows; without this lock two", c: true },
  { t: "-- callers read the same figures and both write.", c: true },
  { t: "perform 1" },
  { t: "   from shows s" },
  { t: "   join show_segments g on g.show_id = s.id" },
  { t: "  where g.id = p_segment_id" },
  { t: "    for update of s;", hot: true },
]

const geist = { fontFamily: "var(--font-geist), var(--font-sora), sans-serif" }

function animate(tl: gsap.core.Timeline, { q, mobile }: SceneContext) {
  const [phone] = q("[data-phone]")
  const typed = q("[data-type]")

  // 1. The form fills itself in
  tl.fromTo(typed[0], { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.28, ease: "steps(16)" }, 0.06)
    .fromTo(typed[1], { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.24, ease: "steps(18)" }, 0.36)
    .to(q("[data-guests]"), { yPercent: -66.666, duration: 0.14, ease: "steps(2)" }, 0.62)
    .to(q("[data-register]"), { scale: 0.94, duration: 0.04, yoyo: true, repeat: 1 }, 0.78)
    .fromTo(q("[data-toast]"), { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.1, ease: "back.out(2)" }, 0.84)

  // 2. The phone steps aside for the hall and the lock
  tl.to(phone, { yPercent: mobile ? 0 : 8, xPercent: mobile ? -140 : -120, rotate: -8, autoAlpha: 0, duration: 0.12, ease: "power2.in" }, 0.9)
    .fromTo(q("[data-hall]"), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power3.out" }, 1.03)
    .fromTo(q("[data-req]"), { x: (i) => (i ? 80 : -80), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.14, ease: "power3.out" }, 1.18)
  const seats = q("[data-seat]")
  const lock = q("[data-lock]")
  const left = q("[data-left]")[0]
  const leftN = { v: SEATS - TAKEN }
  // Oriana's party of 3 takes the lock first; Hugo's 2 waits, then goes in
  tl.to(q("[data-req-a]"), { y: -14, duration: 0.06 }, 1.36)
    .to(lock, { attr: { "data-shut": "true" }, duration: 0.01 }, 1.37)
    .to(q("[data-sql-hot]"), { backgroundColor: "rgba(255,106,77,0.22)", color: "#ffb4a3", duration: 0.06 }, 1.37)
    .to(q("[data-req-b]"), { opacity: 0.45, duration: 0.06 }, 1.38)
    .to(seats.slice(TAKEN, TAKEN + 3), { backgroundColor: "#ff6a4d", duration: 0.1, stagger: 0.02 }, 1.42)
    .to(leftN, { v: 2, duration: 0.08, onUpdate: () => (left.textContent = String(Math.round(leftN.v))) }, 1.42)
    .to(q("[data-req-a]"), { autoAlpha: 0, y: -30, duration: 0.08 }, 1.52)
    .to(lock, { attr: { "data-shut": "false" }, duration: 0.01 }, 1.56)
    .to(q("[data-req-b]"), { opacity: 1, y: -14, duration: 0.06 }, 1.58)
    .to(lock, { attr: { "data-shut": "true" }, duration: 0.01 }, 1.6)
    .to(seats.slice(TAKEN + 3), { backgroundColor: "#f6f1ea", duration: 0.08, stagger: 0.02 }, 1.62)
    .to(leftN, { v: 0, duration: 0.06, onUpdate: () => (left.textContent = String(Math.round(leftN.v))) }, 1.62)
    .to(q("[data-req-b]"), { autoAlpha: 0, y: -30, duration: 0.08 }, 1.7)
    .to(lock, { attr: { "data-shut": "false" }, duration: 0.01 }, 1.74)
    .fromTo(q("[data-full]"), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.08, ease: "back.out(3)" }, 1.74)
    .to(q("[data-hall]"), { autoAlpha: 0, y: -60, duration: 0.18, ease: "power2.in" }, 1.86)

  // 3. Her ticket arrives
  tl.set(q("[data-s-form]"), { autoAlpha: 0 }, 1.95)
    .set(q("[data-s-ticket]"), { autoAlpha: 1 }, 1.95)
    .fromTo(phone, { xPercent: mobile ? 140 : 120, yPercent: 8, rotate: 8, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, rotate: 0, autoAlpha: 1, duration: 0.22, ease: "power3.out", immediateRender: false }, 1.95)
    .fromTo(q("[data-mail]"), { yPercent: -150, autoAlpha: 1 }, { yPercent: 0, autoAlpha: 1, duration: 0.1, ease: "back.out(1.6)" }, 2.14)
    .to(q("[data-mail]"), { yPercent: -150, duration: 0.08, ease: "power2.in" }, 2.42)
    .to(q("[data-ticket-img]"), { yPercent: -36, duration: 0.4, ease: "power1.inOut" }, 2.3)
    .fromTo(q("[data-send]"), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.1 }, 2.2)
    .to(q("[data-send-btn]"), { scale: 0.9, duration: 0.03, yoyo: true, repeat: 1 }, 2.32)
    .to(q("[data-send-btn]"), { scale: 0.9, duration: 0.03, yoyo: true, repeat: 1 }, 2.42)
    .fromTo(q("[data-send-out]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 2.5)
    .to(q("[data-send]"), { autoAlpha: 0, x: 40, duration: 0.1 }, 2.86)

  // 4. At the door, then the signal drops
  tl.set(q("[data-s-ticket]"), { autoAlpha: 0 }, 2.98)
    .set(q("[data-s-scan]"), { autoAlpha: 1 }, 2.98)
    .fromTo(q("[data-guest-a]"), { xPercent: 160, rotate: 14, autoAlpha: 0 }, { xPercent: 0, rotate: -4, autoAlpha: 1, duration: 0.16, ease: "power3.out" }, 3.04)
    .fromTo(q("[data-beam]"), { yPercent: 0, autoAlpha: 1 }, { yPercent: 900, duration: 0.12, ease: "power1.inOut" }, 3.16)
    .set(q("[data-beam]"), { autoAlpha: 0 }, 3.28)
    .fromTo(q("[data-ok-a]"), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.06 }, 3.28)
    .to(q("[data-guest-a]"), { xPercent: 160, rotate: 14, autoAlpha: 0, duration: 0.12, ease: "power2.in" }, 3.4)
    .to(q("[data-ok-a]"), { autoAlpha: 0, duration: 0.04 }, 3.48)
    .to(q("[data-bar]"), { opacity: 0.18, duration: 0.03, stagger: { each: 0.02, from: "end" } }, 3.5)
    .fromTo(q("[data-nosig]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 3.56)
    .fromTo(q("[data-guest-b]"), { xPercent: 160, rotate: 14, autoAlpha: 0 }, { xPercent: 0, rotate: -4, autoAlpha: 1, duration: 0.14, ease: "power3.out" }, 3.56)
    .fromTo(q("[data-ok-b]"), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.06 }, 3.7)
    .to(q("[data-guest-b]"), { xPercent: 160, rotate: 14, autoAlpha: 0, duration: 0.1, ease: "power2.in" }, 3.78)
    .to(q("[data-bar]"), { opacity: 1, duration: 0.03, stagger: 0.02 }, 3.84)
    .to(q("[data-nosig]"), { autoAlpha: 0, duration: 0.03 }, 3.84)
    .to(q("[data-ok-b]"), { autoAlpha: 0, duration: 0.04 }, 3.86)
    .fromTo(q("[data-synced]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 3.88)
}

function Phone() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        data-phone
        style={geist}
        className="relative aspect-[9/19] h-[min(86%,640px)] rounded-[2.6rem] border border-[#3b3646] bg-[#0f0d14] p-[3.2%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <div className="relative h-full overflow-hidden rounded-[2.2rem] bg-[#0a0a0b] text-[#f2f2f2]">
          {/* Status bar */}
          <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[9%] pt-[5%] text-[10px] font-medium">
            <span>19:02</span>
            <span className="flex items-center gap-1.5">
              <span data-nosig className="invisible rounded-full bg-[#f5b33f] px-1.5 text-[9px] font-semibold text-[#2b1a02]">
                No signal
              </span>
              <span className="flex items-end gap-[2px]" aria-hidden>
                {[4, 6, 8, 10].map((h) => (
                  <span key={h} data-bar className="w-[3px] rounded-[1px] bg-current" style={{ height: h }} />
                ))}
              </span>
            </span>
          </div>

          {/* Email arrives */}
          <div
            data-mail
            className="invisible absolute inset-x-[4%] top-[3%] z-40 rounded-2xl bg-[#26232d]/95 p-3 text-[11px] leading-tight shadow-lg backdrop-blur"
          >
            <p className="font-semibold">Zetix</p>
            <p className="mt-0.5 text-[#cfc9d8]">Your 3 tickets for Gala evening</p>
          </div>

          {/* Screen: registration form */}
          <div data-s-form className="absolute inset-0 flex flex-col px-[8%] pb-[8%] pt-[18%]">
            <p className="text-[11px] text-[#9a9a9f]">Autumn Serenade</p>
            <p className="text-[19px] font-semibold tracking-[-0.02em]">Gala evening</p>
            <p className="mt-1 text-[10px] text-[#9a9a9f]">Free seating. Register your party.</p>
            <div className="mt-5 grid gap-3 text-[11px]">
              <Field label="Full name">
                <span data-type className="inline-block whitespace-nowrap">Oriana Abernethy</span>
              </Field>
              <Field label="Email">
                <span data-type className="inline-block whitespace-nowrap">oriana@example.org</span>
              </Field>
              <div>
                <p className="mb-1 text-[#9a9a9f]">Guests in your party</p>
                <div className="flex items-center justify-between rounded-xl border border-[#2a2a2e] px-3 py-2">
                  <span className="text-[#9a9a9f]">&minus;</span>
                  <span className="relative h-[1.2em] overflow-hidden font-semibold tabular">
                    <span data-guests className="flex flex-col">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                    </span>
                  </span>
                  <span className="text-[#9a9a9f]">+</span>
                </div>
              </div>
            </div>
            <div data-register className="mt-auto rounded-full bg-[#ff6a4d] py-2.5 text-center text-[12px] font-semibold text-[#1a0b07]">
              Register
            </div>
            <div
              data-toast
              className="invisible absolute inset-x-[6%] bottom-[16%] rounded-xl bg-[#1f3d2a] px-3 py-2 text-[11px] text-[#b9f0c9]"
            >
              Registered. Your tickets are on their way.
            </div>
          </div>

          {/* Screen: the real ticket page */}
          <div data-s-ticket className="invisible absolute inset-0 overflow-hidden">
            <div data-ticket-img className="relative w-full pt-[8%]">
              <Image
                src="/scenes/zetix-ticket-dark.webp"
                alt="Zetix ticket page for Oriana Abernethy, Gala evening, 3 seats, with a QR code"
                width={640}
                height={1090}
                sizes="300px"
                className="w-full"
              />
            </div>
          </div>

          {/* Screen: door scanner */}
          <div data-s-scan className="invisible absolute inset-0 flex flex-col pt-[14%]">
            <div className="mx-[6%] flex items-center justify-between rounded-xl bg-[#1b1b1e] px-3 py-2 text-[11px] font-semibold">
              Gala evening <span className="text-[#9a9a9f]">&#9662;</span>
            </div>
            <div className="relative mx-[6%] mt-[8%] flex-1 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_40%,#2a2730,#0d0c10)]">
              <span className="absolute inset-[18%] rounded-xl" aria-hidden>
                {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "left-0 bottom-0 border-l-2 border-b-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
                  <span key={c} className={cn("absolute size-6 rounded-[4px] border-white/80", c)} />
                ))}
              </span>
              <span data-beam className="absolute inset-x-[18%] top-[18%] h-[7%] bg-gradient-to-b from-transparent to-[#ff6a4d]/70" />
              <p className="absolute inset-x-0 bottom-[6%] text-center text-[10px] text-white/60">Point at a ticket</p>
              <div data-ok-a className="invisible absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#2fbf5a] text-center text-[#062b12]">
                <span className="text-[22px] font-bold">Admitted</span>
                <span className="text-[11px] font-semibold uppercase tracking-wide">Oriana Abernethy</span>
                <span className="text-[10px]">3 of 3 in</span>
              </div>
              <div data-ok-b className="invisible absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#2fbf5a] px-4 text-center text-[#062b12]">
                <span className="text-[22px] font-bold">Admitted</span>
                <span className="text-[11px] font-semibold uppercase tracking-wide">Theo Whitfield</span>
                <span className="mt-1 rounded-full bg-black/15 px-2 py-0.5 text-[9px] font-medium">
                  Saved offline. Syncs when signal returns.
                </span>
              </div>
            </div>
            <div data-synced className="invisible mx-[6%] mt-3 rounded-xl bg-[#1b1b1e] px-3 py-2 text-center text-[11px]">
              Back online. Synced 1 offline scan.
            </div>
            <div className="mt-3 grid grid-cols-3 border-t border-white/10 py-2 text-center text-[9px] text-white/60">
              <span className="text-white">Scan</span>
              <span>Search</span>
              <span>Stats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guests at the door */}
      {[
        { key: "a", name: "Oriana Abernethy", party: "3 seats" },
        { key: "b", name: "Theo Whitfield", party: "1 seat" },
      ].map((g) => (
        <div
          key={g.key}
          {...{ [`data-guest-${g.key}`]: "" }}
          style={geist}
          className="invisible absolute right-[2%] top-[40%] w-[clamp(7.5rem,15vw,11rem)] rounded-2xl bg-[#f6f1ea] p-2.5 text-[#18161f] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] md:right-[6%]"
        >
          <div className="aspect-square rounded-lg bg-white p-1.5">
            <QrGlyph seed={g.name} />
          </div>
          <p className="mt-2 truncate text-[11px] font-semibold">{g.name}</p>
          <p className="text-[10px] text-[#7b7487]">{g.party}</p>
        </div>
      ))}

      {/* Send twice, one email */}
      <div
        data-send
        style={geist}
        className="invisible absolute bottom-[6%] left-0 flex items-center gap-3 rounded-full bg-[#221f2b] py-1.5 pl-1.5 pr-4 text-[12px] md:bottom-[10%]"
      >
        <span data-send-btn className="rounded-full bg-[#ff6a4d] px-3 py-1 font-semibold text-[#1a0b07]">
          Send
        </span>
        <span data-send-out className="invisible text-[#cfc9d8]">
          Pressed twice. One email.
        </span>
      </div>
    </div>
  )
}

function Hall() {
  return (
    <div data-hall className="invisible absolute inset-0 flex flex-col items-center justify-center gap-5" style={geist}>
      <div className="w-full max-w-[34rem] rounded-3xl bg-[#221f2b] p-4 md:p-5">
        <div className="flex items-baseline justify-between text-[12px] text-[#aaa3b4]">
          <span>Gala evening, public seats</span>
          <span>
            <span data-left className="tabular font-semibold text-[#f6f1ea]">
              {SEATS - TAKEN}
            </span>{" "}
            left
          </span>
        </div>
        <div className="mt-3 grid grid-cols-[repeat(24,minmax(0,1fr))] gap-[3px]" aria-hidden>
          {Array.from({ length: SEATS }, (_, i) => (
            <span
              key={i}
              data-seat
              className={cn("aspect-square rounded-full", i < TAKEN ? "bg-[#5c566a]" : "bg-[#2e2a38] ring-1 ring-inset ring-[#5c566a]")}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 text-[11px] md:text-[12px]">
          <span data-req data-req-a className="rounded-full bg-[#ff6a4d] px-3 py-1 font-semibold text-[#1a0b07]">
            Oriana&rsquo;s party, 3
          </span>
          <span data-lock data-shut="false" className="group grid size-9 place-items-center rounded-full border border-[#3b3646]">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path
                d="M8 11V7a4 4 0 0 1 8 0"
                className="origin-[16px_11px] transition-transform duration-200 group-data-[shut=false]:-translate-y-1 group-data-[shut=false]:rotate-[-25deg]"
              />
            </svg>
          </span>
          <span data-req data-req-b className="rounded-full bg-[#f6f1ea] px-3 py-1 font-semibold text-[#18161f]">
            Hugo&rsquo;s party, 2
          </span>
        </div>
        <p data-full className="invisible mt-3 text-center text-[12px] font-semibold text-[#f6f1ea]">
          Full. Nobody oversold.
        </p>
      </div>
      <pre className="hidden w-full max-w-[34rem] overflow-hidden rounded-2xl bg-[#0f0d14] p-4 font-mono text-[11px] leading-[1.6] text-[#cfc9d8] md:block">
        <span className="mb-2 block text-[10px] uppercase tracking-[0.12em] text-[#7b7487]">claim_seats(), from the repo</span>
        {SQL.map((l) => (
          <span
            key={l.t}
            {...(l.hot ? { "data-sql-hot": "" } : {})}
            className={cn("-mx-1 block rounded px-1", l.c && "text-[#7b7487]")}
          >
            {l.t}
          </span>
        ))}
      </pre>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[#9a9a9f]">{label}</p>
      <div className="rounded-xl border border-[#2a2a2e] px-3 py-2">{children}</div>
    </div>
  )
}

function QrGlyph({ seed }: { seed: string }) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const cells: [number, number][] = []
  for (let y = 0; y < 11; y++)
    for (let x = 0; x < 11; x++) {
      const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7)
      h = Math.imul(h ^ (h >>> 13), 1274126177)
      if (!finder && (h >>> 0) % 100 > 48) cells.push([x, y])
    }
  return (
    <svg viewBox="0 0 11 11" className="size-full" aria-hidden>
      {[
        [0, 0],
        [8, 0],
        [0, 8],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x + 0.2} y={y + 0.2} width={2.6} height={2.6} fill="none" stroke="currentColor" strokeWidth={0.4} />
          <rect x={x + 0.9} y={y + 0.9} width={1.2} height={1.2} fill="currentColor" />
        </g>
      ))}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.08} y={y + 0.08} width={0.84} height={0.84} fill="currentColor" />
      ))}
    </svg>
  )
}

export function ZetixScene({ children }: { children: React.ReactNode }) {
  return (
    <SceneShell
      id="zetix"
      world="zetix"
      index="01 / 03"
      title="Zetix"
      chapters={CHAPTERS}
      facts={FACTS}
      factsNote="From the chamber orchestra concert Zetix ran in September 2026."
      stage={
        <>
          <Phone />
          <Hall />
        </>
      }
      animate={animate}
    >
      {children}
    </SceneShell>
  )
}
