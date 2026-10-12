"use client"

import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Draggable, Flip)

// Mobile browsers resize the viewport as their toolbars show and hide; don't
// recompute every pin for that
ScrollTrigger.config({ ignoreMobileResize: true })

export const REDUCED = "(prefers-reduced-motion: reduce)"
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"

// Conditions for gsap.matchMedia: scenes choreograph differently by width
export const SCENE = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
}

export { gsap, Draggable, Flip, ScrollTrigger, SplitText, useGSAP }

// Handy for poking at triggers from the console and from Playwright in dev
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  ;(window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger
}
