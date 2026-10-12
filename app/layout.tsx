import type { Metadata, Viewport } from "next"
import { Archivo, Bricolage_Grotesque, Geist, JetBrains_Mono, Sora } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { Analytics } from "@vercel/analytics/next"

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
})

// Project-world faces load lazily; they only appear once a project scrolls in
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], preload: false })
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], preload: false })
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

const description =
  "Software engineer at Mode Fair. Backend services in Kotlin and Spring Boot, LangGraph agents, RAG pipelines, and the infrastructure behind them."

export const metadata: Metadata = {
  title: "Sia Zhong Tai, Software Engineer",
  description,
  openGraph: {
    title: "Sia Zhong Tai, Software Engineer",
    description,
    url: "https://siazai.dev",
    siteName: "Sia Zhong Tai",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0f" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${sora.variable} ${geist.variable} ${bricolage.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Lets CSS hide intro-animated elements before first paint, only when JS runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-w-fg focus:px-4 focus:py-2 focus:text-w-bg"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
