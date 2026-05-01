"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm transition-all",
        isScrolled && "border-b border-border"
      )}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="font-mono font-semibold text-foreground hover:text-primary transition-colors"
        >
          ztsia
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#projects"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </a>
          <a
            href="#skills"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skills
          </a>
          <a
            href="#contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 pt-8">
                <SheetClose render={<a href="#about" className="text-foreground hover:text-primary transition-colors" />}>
                  About
                </SheetClose>
                <SheetClose render={<a href="#projects" className="text-foreground hover:text-primary transition-colors" />}>
                  Projects
                </SheetClose>
                <SheetClose render={<a href="#skills" className="text-foreground hover:text-primary transition-colors" />}>
                  Skills
                </SheetClose>
                <SheetClose render={<a href="#contact" className="text-foreground hover:text-primary transition-colors" />}>
                  Contact
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
