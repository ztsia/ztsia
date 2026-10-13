"use client"

import { useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"

const EMAIL = "leosia929@gmail.com"

const REST = 104
const WIDE = 125

export function Contact() {
  const [copied, setCopied] = useState(false)
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const section = root.current!
        // The block rises from under the page as you reach it
        gsap.fromTo(
          "[data-contact-inner]",
          { yPercent: -35 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top 20%", scrub: true } }
        )
        gsap.from("[data-mail-char]", {
          yPercent: 110,
          stagger: 0.025,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-mail]", start: "top 85%", once: true },
        })

        // The hero's lens comes back once: letters near the cursor widen
        const chars = gsap.utils.toArray<HTMLElement>("[data-mail-char]", section)
        const mail = section.querySelector<HTMLElement>("[data-mail]")!
        const setters = chars.map((c) => gsap.quickTo(c, "--wdth", { duration: 0.5, ease: "power3" }))
        const move = (e: PointerEvent) => {
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect()
            const d = Math.hypot(r.left + r.width / 2 - e.clientX, (r.top + r.height / 2 - e.clientY) * 0.7)
            const k = Math.max(0, 1 - d / 260)
            setters[i](REST + (WIDE - REST) * k * k)
          })
        }
        const leave = () => setters.forEach((s) => s(REST))
        mail.addEventListener("pointermove", move)
        mail.addEventListener("pointerleave", leave)
        return () => {
          mail.removeEventListener("pointermove", move)
          mail.removeEventListener("pointerleave", leave)
        }
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the address stays selectable
    }
  }

  return (
    <section ref={root} id="contact" data-chapter="Contact" className="w-fade overflow-hidden bg-w-fg text-w-bg">
      <div data-contact-inner className="mx-auto max-w-[1400px] px-4 pb-10 pt-28 sm:px-6 md:px-10 md:pt-40">
        <h2 className="text-lg">Get in touch</h2>
        <p className="mt-2 max-w-[48ch] opacity-70">
          Happy to talk about backend systems, agent architectures and AI engineering.
        </p>

        <div className="mt-10 flex flex-wrap items-end gap-x-6 gap-y-4">
          <a
            data-mail
            href={`mailto:${EMAIL}`}
            aria-label={EMAIL}
            className="link-draw flex overflow-clip whitespace-nowrap pb-[0.08em] text-[min(6.2vw,7rem)] font-extrabold leading-[0.95] tracking-[-0.03em]"
          >
            {EMAIL.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden
                data-mail-char
                className="inline-block"
                style={{ fontVariationSettings: '"wdth" var(--wdth, 104)' }}
              >
                {ch}
              </span>
            ))}
          </a>
          <button
            type="button"
            onClick={copy}
            className="mb-2 inline-flex h-10 items-center gap-2 rounded-[2px] px-4 text-sm font-medium shadow-[inset_0_0_0_1.5px_currentColor] transition-transform active:scale-[0.98]"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy address"}
          </button>
        </div>

        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-lg">
          <li>
            <a href="https://www.linkedin.com/in/ztsia" target="_blank" rel="noopener noreferrer" className="link-draw">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/ztsia" target="_blank" rel="noopener noreferrer" className="link-draw">
              GitHub
            </a>
          </li>
          <li>
            <a href="/Sia_Zhong_Tai_Resume.pdf" download className="link-draw">
              Résumé (PDF)
            </a>
          </li>
        </ul>

        <div className="mt-28 flex flex-wrap items-end justify-between gap-4 border-t border-current/20 pt-6 text-sm opacity-70">
          <span>Sia Zhong Tai, 2026</span>
          <a href="#hero" className="link-draw">
            Back to top
          </a>
        </div>
      </div>
    </section>
  )
}
