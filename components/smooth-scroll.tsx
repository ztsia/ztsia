"use client"

import { useEffect, useRef } from "react"
import { ReactLenis, type LenisRef } from "lenis/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

// Lenis drives the page scroll; GSAP's ticker drives Lenis so ScrollTrigger
// and the smooth scroll read the same frame.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    if (!lenis) return
    const update = (time: number) => lenis.raf(time * 1000)
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.off("scroll", ScrollTrigger.update)
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        // Pauses when a dialog locks the page (overflow: hidden on <html>)
        autoToggle: true,
        anchors: { offset: -72 },
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
