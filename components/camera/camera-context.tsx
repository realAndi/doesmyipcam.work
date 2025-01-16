"use client"

import { createContext, useContext, useEffect, useState } from "react"

export interface Camera {
  id: string
  name: string
  ip: string
  port: number
  username: string
  password: string
  streamType: "hls" | "mjpeg"
  streamUrl: string
}

interface CameraContextType {
  cameras: Camera[]
  addCamera: (camera: Omit<Camera, "id" | "streamUrl">) => void
  removeCamera: (id: string) => void
  toggleStreamType: (id: string) => void
}

const CameraContext = createContext<CameraContextType | undefined>(undefined)

export function CameraProvider({ children }: { children: React.ReactNode }) {
  const [cameras, setCameras] = useState<Camera[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cameras")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem("cameras", JSON.stringify(cameras))
  }, [cameras])

  const addCamera = (camera: Omit<Camera, "id" | "streamUrl">) => {
    const id = crypto.randomUUID()
    const streamUrl = constructStreamUrl(camera.ip, camera.port.toString(), camera.streamType)
    console.log('Adding camera with stream URL:', streamUrl)
    setCameras([...cameras, { ...camera, id, streamUrl }])
  }

  const removeCamera = (id: string) => {
    setCameras(cameras.filter((c) => c.id !== id))
  }

  const toggleStreamType = (id: string) => {
    setCameras(cameras.map(camera => {
      if (camera.id === id) {
        const newStreamType = camera.streamType === "mjpeg" ? "hls" : "mjpeg"
        const newStreamUrl = constructStreamUrl(camera.ip, camera.port.toString(), newStreamType)
        return {
          ...camera,
          streamType: newStreamType,
          streamUrl: newStreamUrl
        }
      }
      return camera
    }))
  }

  return (
    <CameraContext.Provider value={{ cameras, addCamera, removeCamera, toggleStreamType }}>
      {children}
    </CameraContext.Provider>
  )
}

export function useCameras() {
  const context = useContext(CameraContext)
  if (context === undefined) {
    throw new Error("useCameras must be used within a CameraProvider")
  }
  return context
}

const constructStreamUrl = (ip: string, port: string, streamType: "hls" | "mjpeg") => {
  // Remove any existing protocol and clean up the IP
  const cleanIp = ip.replace(/^https?:\/\//, '').trim()
  // Force HTTP protocol and ensure proper URL format
  const streamUrl = streamType === "mjpeg" 
    ? `http://${cleanIp}:${port}/live`
    : `http://${cleanIp}:${port}/live/0/h264.m3u8`
  return streamUrl.toLowerCase()
} 