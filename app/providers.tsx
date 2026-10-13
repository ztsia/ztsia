"use client"

import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SmoothScroll } from "@/components/smooth-scroll"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </TooltipProvider>
    </ThemeProvider>
  )
}
