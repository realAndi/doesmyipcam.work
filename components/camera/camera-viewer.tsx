"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Camera } from "./camera-context"
import { useEffect, useState, useRef } from "react"

interface CameraViewerProps {
  camera: Camera
  onDelete: (id: string) => void
}

export function CameraViewer({ camera, onDelete }: CameraViewerProps) {
  const [streamError, setStreamError] = useState(false)
  const [streamUrl, setStreamUrl] = useState("")
  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const setupStream = () => {
      // Add timestamp to prevent caching
      const proxyUrl = `/api/stream?url=${encodeURIComponent(camera.streamUrl)}&t=${Date.now()}`
      console.log('Using proxied stream URL:', proxyUrl)
      setStreamUrl(proxyUrl)
      setStreamError(false)
    }

    const handleStreamError = () => {
      console.error('Stream error, attempting to reconnect...')
      setStreamError(true)
      
      // Clear any existing retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      
      // Attempt to reconnect after 5 seconds
      retryTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect stream...')
        setupStream()
      }, 5000)
    }

    setupStream()

    // Cleanup function
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [camera.streamUrl])

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-base font-medium">
          {camera.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(camera.id)}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete camera</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0 space-y-4 relative">
        <div className="relative w-full aspect-video">
          {streamUrl && (
            <img
              ref={imgRef}
              src={streamUrl}
              alt={`Stream from ${camera.name}`}
              className="w-full h-full object-cover rounded-md bg-muted"
              onError={() => {
                console.error('Stream error for URL:', streamUrl)
                setStreamError(true)
              }}
            />
          )}
        </div>
        {streamError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-destructive text-center p-4 bg-background/80 rounded-md">
              Connection lost. Attempting to reconnect...<br/>
              Please wait or check your camera settings.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 