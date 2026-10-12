"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

// A text toggle: says what it switches to
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const next = resolvedTheme === "dark" ? "light" : "dark"

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const canAnimate =
      "startViewTransition" in document && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!canAnimate) {
      setTheme(next)
      return
    }
    const x = event.clientX
    const y = event.clientY
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    document.startViewTransition(() => setTheme(next)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
      )
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${next} theme` : "Switch theme"}
      className="inline-flex h-9 min-w-12 items-center justify-center rounded-[2px] px-2 text-[15px] opacity-60 transition-opacity hover:opacity-100"
    >
      {mounted ? (next === "dark" ? "Dark" : "Light") : " "}
    </button>
  )
}
