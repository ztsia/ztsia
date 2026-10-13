import type { WorldName } from "@/components/world"

/**
 * The one list of showcased projects. Order here is the order on the page:
 * the work index, the scenes, the passages between them, every "02 / 03"
 * and the folio all follow it. Each project's story (chapters, stage, facts,
 * demo) lives in its own scene file under components/scenes/, wired up in
 * components/work.tsx. Its palette is `[data-world="…"]` in app/globals.css.
 */
export const PROJECTS = [
  {
    id: "zetix",
    world: "zetix",
    title: "Zetix",
    kind: "Ticketing for free concerts",
    meta: "Ran a real concert, 2026",
    tagline: "From sign-up to the door",
    thumb: "/project_thumbnail/zetix_thumbnail.jpg",
  },
  {
    id: "assistant",
    world: "study",
    title: "AI Academic Assistant",
    kind: "Six LangGraph agents",
    meta: "Final year project, 2025 to 2026",
    tagline: "Six agents and a solver, planning a student's week",
    thumb: "/project_thumbnail/FYP_demo_thumbnail.jpg",
  },
  {
    id: "event",
    world: "field",
    title: "Real-time outdoor event system",
    kind: "Live territory game",
    meta: "60 participants on the day",
    tagline: "Sixty players, one live map",
    thumb: "/project_thumbnail/camp_pwa_demo-thumbnail.jpg",
  },
] as const satisfies readonly {
  /** Anchor id on the page (#zetix) */
  id: string
  world: WorldName
  title: string
  /** The two small lines on the index row */
  kind: string
  meta: string
  /** Under the title on the card that opens the project */
  tagline: string
  thumb: string
}[]

export type Project = (typeof PROJECTS)[number]
export type ProjectId = Project["id"]

const pad = (n: number) => String(n).padStart(2, "0")

/** Position of a project as "02 / 03" */
export function folioOf(id: ProjectId) {
  const i = PROJECTS.findIndex((p) => p.id === id)
  return `${pad(i + 1)} / ${pad(PROJECTS.length)}`
}

export function projectOf(id: ProjectId): Project {
  return PROJECTS.find((p) => p.id === id)!
}

/** "01", "02" … for the index rows */
export const numberOf = (i: number) => pad(i + 1)

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]
/** "Three projects" */
export const projectCount = () => {
  const n: number = PROJECTS.length
  return `${WORDS[n] ?? n} project${n === 1 ? "" : "s"}`
}
