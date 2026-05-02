"use client"

import { useState } from "react"
import { FadeUp } from "@/components/fade-up"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Check, Mail } from "lucide-react"
import { InlineIcon } from "@/components/tech-icon"

const EMAIL = "leosia929@gmail.com"
const LINKEDIN_PATH = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.14-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"

export function Contact() {
  const [emailCopied, setEmailCopied] = useState(false)

  function handleEmailClick() {
    navigator.clipboard.writeText(EMAIL)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  return (
    <>
      <Separator />
      <section id="contact" className="py-24 max-w-5xl mx-auto px-6">
        <FadeUp>
        <h2 className="text-2xl font-semibold text-foreground">Available July 2026</h2>
        <p className="text-muted-foreground mt-2">
          Open to full-stack AI engineering roles — remote-friendly preferred.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleEmailClick}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {emailCopied
              ? <><Check data-icon="inline-start" className="h-4 w-4" /> Copied!</>
              : <><Mail data-icon="inline-start" className="h-4 w-4" /> {EMAIL}</>
            }
          </a>
          <a
            href="https://www.linkedin.com/in/ztsia"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn" className="h-4 w-4" data-icon="inline-start"><path d={LINKEDIN_PATH} /></svg> LinkedIn
          </a>
          <a
            href="https://github.com/ztsia"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <InlineIcon name="github" className="h-4 w-4" /> GitHub
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-16">Built by Sia Zhong Tai · 2026</p>
        </FadeUp>
      </section>
    </>
  )
}
