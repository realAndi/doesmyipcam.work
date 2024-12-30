"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AddCameraDialog } from "@/components/camera/add-camera-dialog"
import { CameraViewer } from "@/components/camera/camera-viewer"
import { useCameras } from "@/components/camera/camera-context"

export default function CamerasPage() {
  const { cameras, removeCamera } = useCameras()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Cameras</h1>
        <AddCameraDialog />
      </div>

      {cameras.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Your First Camera</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Click the Add Camera button above to get started with your first IP camera feed.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameras.map((camera) => (
            <CameraViewer
              key={camera.id}
              camera={camera}
              onDelete={removeCamera}
            />
          ))}
        </div>
      )}
    </div>
  )
} 