"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Camera } from "./camera-context"
import Image from "next/image"

interface CameraViewerProps {
  camera: Camera
  onDelete?: (id: string) => void
}

export function CameraViewer({ camera, onDelete }: CameraViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleImageError = () => {
    setError("Failed to connect to camera")
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setError(null)
    setIsLoading(false)
  }

  // Add authentication directly to the URL
  const getStreamUrl = () => {
    const auth = Buffer.from(`${camera.username}:${camera.password}`).toString('base64')
    return `${camera.streamUrl}?basic=${auth}`
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{camera.name}</CardTitle>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(camera.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 aspect-video relative bg-muted">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse">Loading camera...</div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-destructive">
            {error}
          </div>
        )}
        <Image
          src={getStreamUrl()}
          alt={`${camera.name} stream`}
          className="w-full h-full object-contain"
          onError={handleImageError}
          onLoad={handleImageLoad}
          width={640}
          height={360}
          unoptimized
        />
      </CardContent>
    </Card>
  )
} 