import * as si from "simple-icons"

function slugToKey(slug: string) {
  return "si" + slug.charAt(0).toUpperCase() + slug.slice(1)
}

export function InlineIcon({ name, className }: { name: string; className?: string }) {
  const icon = (si as Record<string, { path: string; title: string } | undefined>)[slugToKey(name)]
  if (!icon) return null
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label={icon.title}
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}

export function TechIcon({ name, label }: { name: string; label?: string }) {
  const key = slugToKey(name)
  const icon = (si as Record<string, { path: string; title: string } | undefined>)[key]

  return (
    <div className="flex flex-col items-center gap-1.5">
      {icon ? (
        <svg
          role="img"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-label={icon.title}
          className="h-6 w-6"
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span className="font-mono text-xs text-muted-foreground bg-muted rounded px-2 py-1">
          {label ?? name}
        </span>
      )}
      {icon && label && (
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  )
}
