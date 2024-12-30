"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCameras } from "@/components/camera/camera-context"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SettingsPage() {
  const { cameras } = useCameras()

  return (
    <div className="container max-w-2xl py-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </div>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Cameras</CardTitle>
              <CardDescription>
                List of all cameras added to the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cameras.length === 0 ? (
                <p className="text-muted-foreground">No cameras added yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Camera Name</TableHead>
                      <TableHead>Stream Type</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cameras.map((camera) => (
                      <TableRow key={camera.id}>
                        <TableCell className="font-medium">{camera.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={camera.streamType === "rtsp" ? "text-muted-foreground" : ""}>MJPEG</span>
                            <Switch
                              disabled
                              checked={camera.streamType === "rtsp"}
                              onCheckedChange={() => {}}
                              aria-label="Toggle RTSP"
                            />
                            <span className={camera.streamType === "rtsp" ? "" : "text-muted-foreground"}>RTSP</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-muted-foreground">
                            Connected
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 