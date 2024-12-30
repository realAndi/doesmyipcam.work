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
    const fetchStream = async () => {
      if (!isSecureContext) {
        setStreamUrl(camera.streamUrl)
        return
      }

      try {
        const response = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: camera.streamUrl,
            username: camera.username,
            password: camera.password,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch stream')
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setStreamUrl(url)
      } catch (error) {
        console.error('Stream error:', error)
        setStreamError(true)
        setStreamUrl(camera.streamUrl)
      }
    }

    fetchStream()
  }, [camera.streamUrl, camera.username, camera.password, isSecureContext])

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
          onError={() => setStreamError(true)}
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