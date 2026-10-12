"use client"

import Link from "next/link"
import { WorkIndex } from "@/components/work-index"
import { ZetixScene } from "@/components/scenes/zetix-scene"
import { StudyScene } from "@/components/scenes/study-scene"
import { FieldScene } from "@/components/scenes/field-scene"
import { CalendarPassage, CapturePassage, PaperPassage } from "@/components/scenes/transitions"
import { ScannerDemo } from "@/components/demos/scanner-demo"
import { SchedulerDemo } from "@/components/demos/scheduler-demo"
import { TerritoryDemo } from "@/components/demos/territory-demo"
import { AccessCodes, Playground, Walkthrough, btnLine, btnPrimary } from "@/components/playground"

/** The index, then each project as a scroll-told scene that lands on its demo */
export function Work() {
  return (
    <>
      <WorkIndex />

      <ZetixScene>
        <Playground
          kicker="Your turn at the door"
          title="Scan the guests in."
          summary="Drag a ticket onto the phone, or tap it. Scan someone twice, or switch the signal off and scan offline, then bring it back."
          detail="Zetix replaced a door check where ushers searched a spreadsheet for each guest's name. Version 1 took about two weeks. Close to 100 Playwright end-to-end specs, and a QA agent walks every flow in a real browser before a module's PR opens."
          stack={["Next.js", "PostgreSQL", "Supabase", "Drizzle", "Playwright"]}
          actions={
            <>
              <a href="https://zetix.vercel.app" target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                Open the live demo
              </a>
              <a href="https://github.com/ztsia/zetix" target="_blank" rel="noopener noreferrer" className={btnLine}>
                Source on GitHub
              </a>
            </>
          }
          walkthrough={
            <Walkthrough
              videoId="tYE9JxSCns0"
              thumb="/project_thumbnail/zetix_thumbnail.jpg"
              title="Zetix"
              length="From sign-up to the door"
            />
          }
          demo={<ScannerDemo />}
        />
      </ZetixScene>

      <CalendarPassage />

      <StudyScene>
        <Playground
          kicker="Run the solver"
          title="Fill a week."
          summary="Place six study blocks and spaced-repetition reviews around a student's fixed classes, then clear it and run it again."
          detail="Four repositories: a Next.js web app, a React Native app, a Supabase backend and a FastAPI service. The background work runs as three asyncio loops inside FastAPI's lifespan, sending push notifications, planning quizzes and rescheduling missed sessions."
          stack={["Next.js", "React Native", "FastAPI", "LangGraph", "Supabase", "OR-Tools", "Gemini API"]}
          actions={
            <Link href="/projects/ai-academic-assistant" className={btnPrimary}>
              Read the case study
            </Link>
          }
          walkthrough={
            <Walkthrough
              videoId="FGOy59Ylnl4"
              thumb="/project_thumbnail/FYP_demo_thumbnail.jpg"
              title="AI Academic Assistant"
              length="3-minute walkthrough of the platform"
            />
          }
          demo={<SchedulerDemo />}
          demoFirst
        />
      </StudyScene>

      <CapturePassage />

      <FieldScene>
        <Playground
          kicker="Play a round"
          title="Take the map."
          summary="Pick a team and capture buildings. Then make two teams tap the same one at once, and watch only one of them get it."
          detail="Shared game timers stay in sync on every device from one server timestamp, with no polling. Battles resolve by both sides voting, and a transaction settles the result."
          stack={["React 19", "Firebase Firestore", "Tailwind CSS v4", "PWA", "Vite"]}
          actions={
            <>
              <AccessCodes />
              <a
                href="https://github.com/ztsia/outdoor-game-manager-app"
                target="_blank"
                rel="noopener noreferrer"
                className={btnLine}
              >
                Source on GitHub
              </a>
            </>
          }
          walkthrough={
            <Walkthrough
              videoId="4FgoOfoR5xg"
              thumb="/project_thumbnail/camp_pwa_demo-thumbnail.jpg"
              title="Real-time outdoor event system"
              length="Walkthrough of the live event"
            />
          }
          demo={<TerritoryDemo />}
        />
      </FieldScene>

      <PaperPassage />
    </>
  )
}
