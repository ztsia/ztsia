import { FadeUp } from "@/components/fade-up"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Code2, Link2, Mail } from "lucide-react"

export function Contact() {
  return (
    <>
      <Separator />
      <section id="contact" className="py-24 max-w-5xl mx-auto px-6">
        <FadeUp>
        <h2 className="text-2xl font-semibold text-foreground">Available July 2026</h2>
        <p className="text-muted-foreground mt-2">
          Open to full-stack AI engineering roles — remote-friendly preferred.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="mailto:leosia929@gmail.com" className={cn(buttonVariants({ variant: "outline" }))}>
            <Mail data-icon="inline-start" className="h-4 w-4" /> leosia929@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/ztsia"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <Link2 data-icon="inline-start" className="h-4 w-4" /> LinkedIn
          </a>
          <a
            href="https://github.com/ztsia"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <Code2 data-icon="inline-start" className="h-4 w-4" /> GitHub
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-16">Built by Sia Zhong Tai · 2026</p>
        </FadeUp>
      </section>
    </>
  )
}
