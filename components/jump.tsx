"use client"

import { useLenis } from "lenis/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

const CURTAIN = "jump-curtain"

/**
 * A full-screen veil for long jumps. Rendered once inside the smooth scroller.
 */
export function JumpCurtain() {
  return (
    <div
      id={CURTAIN}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] bg-[var(--ink)] opacity-0"
    />
  )
}

/**
 * Returns `jump(hash)`. Short distances glide with Lenis; anything further
 * than about two screens cuts through a quick fade instead, so a visitor in a
 * hurry isn't made to watch every scene play on the way past.
 */
export function useJump() {
  const lenis = useLenis()

  return (hash: string) => {
    const target = document.querySelector<HTMLElement>(hash)
    if (!target) return false
    history.replaceState(null, "", hash)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!lenis) {
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
      return true
    }
    const distance = Math.abs(target.getBoundingClientRect().top)
    if (distance < window.innerHeight * 2 && !reduce) {
      lenis.scrollTo(target, { duration: 1.1 })
      return true
    }
    const curtain = document.getElementById(CURTAIN)
    const land = () => {
      lenis.scrollTo(target, { immediate: true, force: true })
      ScrollTrigger.update()
    }
    if (!curtain || reduce) {
      land()
      return true
    }
    gsap
      .timeline()
      .to(curtain, { opacity: 1, duration: 0.22, ease: "power2.in" })
      .add(land)
      .to(curtain, { opacity: 0, duration: 0.45, ease: "power2.out" }, "+=0.08")
    return true
  }
}
