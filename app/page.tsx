import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"

export default function Page() {
  return (
    <div className="pt-16">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </div>
  )
}
