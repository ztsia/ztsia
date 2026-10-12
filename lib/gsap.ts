"use client"

import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Draggable, Flip)

export const REDUCED = "(prefers-reduced-motion: reduce)"
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"

export { gsap, Draggable, Flip, ScrollTrigger, SplitText, useGSAP }
