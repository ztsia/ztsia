"use client"

import { useEffect, useRef } from "react"
import { ReactLenis, useLenis, type LenisRef } from "lenis/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

// Keeps ScrollTrigger in step with Lenis. Must sit inside <ReactLenis>.
function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update)
  return null
}

// Lenis drives the page scroll; GSAP's ticker drives Lenis so ScrollTrigger
// and the smooth scroll read the same frame. ReactLenis creates its instance
// in an effect and publishes it on a later render, so the ticker reads the
// ref every frame instead of capturing it once at mount.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
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
        anchors: { offset: -64 },
        allowNestedScroll: true,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
