import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sia Zhong Tai — Full-Stack AI Engineer",
  description: "Full-Stack AI Engineer, graduating June 2026. Building LangGraph agents, RAG pipelines, and the infrastructure behind them.",
  openGraph: {
    title: "Sia Zhong Tai — Full-Stack AI Engineer",
    description: "Full-Stack AI Engineer, graduating June 2026. Building LangGraph agents, RAG pipelines, and the infrastructure behind them.",
    url: "https://siazai.dev",
    siteName: "Sia Zhong Tai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
