"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type StreamType = "mjpeg" | "rtsp"

export interface Camera {
  id: string
  name: string
  streamUrl: string
  username: string
  password: string
  streamType: StreamType
}

interface CameraFormData {
  name: string
  url: string
  username: string
  password: string
}

interface CameraContextType {
  cameras: Camera[]
  addCamera: (data: CameraFormData) => void
  removeCamera: (id: string) => void
}

const CameraContext = createContext<CameraContextType | undefined>(undefined)

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function getUUID(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return generateUUID()
  }
}

function constructStreamUrl(baseUrl: string): string {
  // Extract the base parts of the URL
  const match = baseUrl.match(/^(https?:\/\/[^\/]+)(\/.*)?$/)
  if (!match) {
    console.error('Invalid URL format:', baseUrl)
    return baseUrl
  }

  const [, origin] = match
  // Use MJPEG stream path
  return `${origin}/live/0/mjpeg.jpg`
}

export function CameraProvider({ children }: { children: React.ReactNode }) {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("cameras")
    if (saved) {
      setCameras(JSON.parse(saved))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cameras", JSON.stringify(cameras))
    }
  }, [cameras, isLoaded])

  const addCamera = (data: CameraFormData) => {
    const newCamera: Camera = {
      id: getUUID(),
      name: data.name,
      streamUrl: constructStreamUrl(data.url),
      username: data.username,
      password: data.password,
      streamType: "mjpeg",
    }
    setCameras((prev) => [...prev, newCamera])
  }

  const removeCamera = (id: string) => {
    setCameras((prev) => prev.filter((camera) => camera.id !== id))
  }

  if (!isLoaded) {
    return null
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