"use client"

import { useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useJump } from "@/components/jump"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useGSAP, ScrollTrigger } from "@/lib/gsap"
import { cn } from "@/lib/utils"

const LINKS = [
  { label: "Work", hash: "#work" },
  { label: "About", hash: "#about" },
  { label: "Contact", hash: "#contact" },
]

export function Navbar() {
  const header = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const jump = useJump()
  const onHome = pathname === "/"

  // Hide while reading down, show when scrolling back up. The bar has no
  // ground of its own: it inverts whatever world is under it.
  useGSAP(() => {
    const el = header.current!
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const scrolled = self.scroll() > 24
        el.dataset.scrolled = String(scrolled)
        el.dataset.hidden = String(scrolled && self.direction === 1 && self.scroll() > 400)
      },
    })
    return () => st.kill()
  })

  function go(e: React.MouseEvent, hash: string) {
    setOpen(false)
    if (!onHome) return
    if (jump(hash)) e.preventDefault()
  }

  return (
    <header
      ref={header}
      data-hidden="false"
      data-scrolled="false"
      className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[hidden=true]:-translate-y-full"
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-10">
        <a
          href={onHome ? "#hero" : "/"}
          onClick={(e) => onHome && go(e, "#hero")}
          className="font-wide text-[17px] font-extrabold tracking-[-0.01em] [--wdth:118]"
        >
          ztsia
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.hash}
              href={onHome ? l.hash : `/${l.hash}`}
              onClick={(e) => go(e, l.hash)}
              className="link-draw text-[15px]"
            >
              {l.label}
            </a>
          ))}
          <a href="/Sia_Zhong_Tai_Resume.pdf" download className="link-draw text-[15px]">
            Résumé
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-9 items-center px-2 text-[15px] font-medium"
          >
            Menu
          </button>
        </div>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-4/5 bg-background">
          <SheetHeader>
            <SheetTitle className="font-wide text-lg font-extrabold [--wdth:118]">ztsia</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 grid gap-1 px-4">
            {LINKS.map((l) => (
              <a
                key={l.hash}
                href={onHome ? l.hash : `/${l.hash}`}
                onClick={(e) => go(e, l.hash)}
                className={cn("font-wide py-2 text-4xl font-extrabold tracking-[-0.02em] [--wdth:112]")}
              >
                {l.label}
              </a>
            ))}
            <a
              href="/Sia_Zhong_Tai_Resume.pdf"
              download
              className="font-wide py-2 text-4xl font-extrabold tracking-[-0.02em] [--wdth:112]"
            >
              Résumé
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
