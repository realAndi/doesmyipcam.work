"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { AddCameraDialog } from "@/components/camera/add-camera-dialog"
import { CameraViewer } from "@/components/camera/camera-viewer"
import { useCameras } from "@/components/camera/camera-context"

export function CamerasView() {
  const { cameras, removeCamera } = useCameras()

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 space-y-6">
      <div className="flex flex-row justify-between items-center md:flex-col md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Cameras</h1>
          <p className="text-muted-foreground mt-1">
            {cameras.length === 0 
              ? "Add your first camera to get started"
              : `Viewing ${cameras.length} camera${cameras.length === 1 ? '' : 's'}`
            }
          </p>
        </div>
        <AddCameraDialog />
      </div>

      {cameras.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="space-y-4">
            <CardTitle className="text-lg">No cameras added yet</CardTitle>
            <div className="text-muted-foreground">
              Click the Add Camera button above to get started with your first IP camera feed.
              <div className="mt-2 text-sm">
                Make sure you have:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Your camera's IP address and port</li>
                  <li>Login credentials (username and password)</li>
                  <li>Camera powered on and connected to your network</li>
                </ul>
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
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