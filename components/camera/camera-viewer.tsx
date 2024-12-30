"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Camera } from "./camera-context"
import { useEffect, useState } from "react"

interface CameraViewerProps {
  camera: Camera
  onDelete: (id: string) => void
}

export function CameraViewer({ camera, onDelete }: CameraViewerProps) {
  const [isSecureContext, setIsSecureContext] = useState(false)
  const [streamError, setStreamError] = useState(false)
  const [streamUrl, setStreamUrl] = useState(camera.streamUrl)

  useEffect(() => {
    setIsSecureContext(window.isSecureContext)
  }, [])

  useEffect(() => {
    // Ensure we're using HTTP
    const url = camera.streamUrl.replace(/^https:/, 'http:')
    console.log('Using stream URL:', url) // Debug log
    setStreamUrl(url)
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
        <img
          src={streamUrl}
          alt={`Stream from ${camera.name}`}
          className="w-full aspect-video object-cover rounded-md bg-muted"
          onError={(e) => {
            console.error('Stream error for URL:', streamUrl) // Debug log
            setStreamError(true)
          }}
        />
        {streamError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-destructive text-center p-4">
              Unable to access camera stream.<br/>
              Please check your camera settings and try again.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 