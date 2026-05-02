"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

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
          <Tooltip>
            <TooltipTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label="Open menu"
              onClick={() => setSheetOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent side="bottom">Navigation</TooltipContent>
          </Tooltip>
        </div>

        {/* Mobile Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="data-[side=right]:w-4/5 flex flex-col overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-mono font-semibold text-foreground">ztsia</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col px-2 mt-4 gap-1 flex-1">
              {[
                { label: "About", href: "#about" },
                { label: "Projects", href: "#projects" },
                { label: "Skills", href: "#skills" },
                { label: "Contact", href: "#contact" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setSheetOpen(false)}
                  className="block rounded-md px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
            <Separator />
            <SheetFooter className="pt-4">
              <ThemeToggle />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
