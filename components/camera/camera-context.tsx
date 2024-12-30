"use client"

import { createContext, useContext, useEffect, useState } from "react"

export interface Camera {
  id: string
  name: string
  ip: string
  port: string
  username: string
  password: string
  streamUrl: string
  streamType: "mjpeg" | "rtsp"
}

interface CameraContextType {
  cameras: Camera[]
  addCamera: (camera: Omit<Camera, "id" | "streamUrl" | "streamType">) => void
  removeCamera: (id: string) => void
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

  const addCamera = (camera: Omit<Camera, "id" | "streamUrl" | "streamType">) => {
    const id = crypto.randomUUID()
    const streamUrl = constructStreamUrl(camera.ip, camera.port)
    console.log('Constructed stream URL:', streamUrl)
    setCameras([...cameras, { ...camera, id, streamUrl, streamType: "mjpeg" }])
  }

  const removeCamera = (id: string) => {
    setCameras(cameras.filter((c) => c.id !== id))
  }

  return (
    <CameraContext.Provider value={{ cameras, addCamera, removeCamera }}>
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

const constructStreamUrl = (ip: string, port: string) => {
  // Remove any existing protocol and clean up the IP
  const cleanIp = ip.replace(/^https?:\/\//, '').trim()
  // Force HTTP protocol and ensure proper URL format
  const streamUrl = `http://${cleanIp}:${port}/live/0/mjpeg.jpg`
  return streamUrl.toLowerCase()
} 