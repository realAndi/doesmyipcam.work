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

export function SettingsView() {
  const { cameras } = useCameras()

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Camera Management</CardTitle>
            <CardDescription>
              View and manage your connected cameras.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cameras.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No cameras added yet.
              </div>
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
  )
} 