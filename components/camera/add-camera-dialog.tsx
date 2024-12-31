"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCameras } from "./camera-context"
import { Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

export function AddCameraDialog() {
  const [open, setOpen] = useState(false)
  const { addCamera } = useCameras()
  const [name, setName] = useState("")
  const [ip, setIp] = useState("")
  const [port, setPort] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [streamType, setStreamType] = useState<"hls" | "mjpeg">("hls")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCamera({
      name,
      ip,
      port: parseInt(port),
      username,
      password,
      streamType
    })
    setOpen(false)
    setName("")
    setIp("")
    setPort("")
    setUsername("")
    setPassword("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Camera</DialogTitle>
            <DialogDescription>
              Add a new IP camera to your dashboard. Enter your camera&apos;s IP address, port, and credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Camera Name</Label>
              <Input
                id="name"
                placeholder="Living Room Camera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                placeholder="192.168.1.100"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                placeholder="8151"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Camera username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Camera password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Stream Type</Label>
              <RadioGroup
                defaultValue="hls"
                value={streamType}
                onValueChange={(value) => setStreamType(value as "hls" | "mjpeg")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hls" id="hls" />
                  <Label htmlFor="hls" className="font-normal">
                    HLS (Video Player with Audio)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mjpeg" id="mjpeg" />
                  <Label htmlFor="mjpeg" className="font-normal">
                    MJPEG (Optimized Video, No Audio)
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground mt-2">
                HLS provides better quality with audio support, while MJPEG offers lower latency without audio.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Camera</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 