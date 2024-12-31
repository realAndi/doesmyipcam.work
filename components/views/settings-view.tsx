"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useCameras } from "@/components/camera/camera-context"

export function SettingsView() {
  const { theme, setTheme } = useTheme()
  const { cameras, toggleStreamType } = useCameras()

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Appearance</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Connected Cameras</h2>
        <div className="text-sm text-muted-foreground">
          {cameras.length === 0 ? (
            <p>No cameras connected</p>
          ) : (
            <ul className="space-y-2">
              {cameras.map((camera) => (
                <li key={camera.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div>{camera.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {camera.ip}:{camera.port}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={camera.streamType === "hls" ? "text-xs text-muted-foreground" : "text-xs text-foreground"}>
                      MJPEG
                    </span>
                    <Switch
                      checked={camera.streamType === "hls"}
                      onCheckedChange={() => toggleStreamType(camera.id)}
                      aria-label="Toggle HLS"
                    />
                    <span className={camera.streamType === "hls" ? "text-xs text-foreground" : "text-xs text-muted-foreground"}>
                      HLS
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
} 