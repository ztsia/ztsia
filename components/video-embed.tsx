"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"

export function VideoEmbed({ videoId, autoplay = false }: { videoId: string; autoplay?: boolean }) {
  return (
    <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden border border-border">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1&mute=1&loop=1&playlist=" + videoId : ""}`}
        className="h-full w-full"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </AspectRatio>
  )
}
