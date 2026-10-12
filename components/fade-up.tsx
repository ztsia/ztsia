// Temporary passthrough while the sections move from framer-motion to GSAP.
// Removed once the redesigned sections land.
export function FadeUp({ children }: { children: React.ReactNode; delay?: number }) {
  return <>{children}</>
}
