"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useCameras } from "@/components/camera/camera-context"
import { Sun, Moon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SettingsView() {
  const { theme, setTheme } = useTheme()
  const { cameras, toggleStreamType } = useCameras()

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Appearance</h2>
        <div className="flex items-center justify-between">
          <Label>Theme</Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'hidden' : 'block'}`} />
            <Moon className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'block' : 'hidden'}`} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Connected Cameras</h2>
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <Info className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Stream Types</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">MJPEG Stream</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    <li>Faster refresh rate</li>
                    <li>More current feed with less delay</li>
                    <li>No audio support</li>
                    <li>Custom image viewer (not native video player)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">HLS Stream</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    <li>Uses native video player</li>
                    <li>Includes audio support</li>
                    <li>Higher latency (more delay)</li>
                    <li>Takes longer to initially load</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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