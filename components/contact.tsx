"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

const EMAIL = "leosia929@gmail.com"

export function Contact() {
  const [copied, setCopied] = useState(false)

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
    <section id="contact" className="bg-w-fg text-w-bg w-fade">
      <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-28 sm:px-6 md:px-10 md:pt-40">
        <h2 className="text-lg">Get in touch</h2>
        <p className="mt-2 max-w-[48ch] opacity-70">
          Happy to talk about backend systems, agent architectures and AI engineering.
        </p>

        <div className="mt-10 flex flex-wrap items-end gap-x-6 gap-y-4">
          <a
            href={`mailto:${EMAIL}`}
            className="link-draw font-wide whitespace-nowrap pb-1 text-[min(6.6vw,7.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] [--wdth:108]"
          >
            {EMAIL}
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
