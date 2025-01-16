"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera } from "./camera-context"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StorageFile {
  name: string
  size: number
  date: Date
}

interface CameraStorageProps {
  camera: Camera
}

export function CameraStorage({ camera }: CameraStorageProps) {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStorage = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/stream?ip=${camera.ip}&port=${camera.port}&path=/form/getStorageFileList&username=${encodeURIComponent(camera.username)}&password=${encodeURIComponent(camera.password)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch storage')
        }

        const text = await response.text()
        
        // Parse the response text
        const match = text.match(/000 Success NUM=(\d+)/)
        if (!match) {
          throw new Error('Invalid response format')
        }

        const numFiles = parseInt(match[1])
        const files: StorageFile[] = []

        // Parse each file entry
        for (let i = 0; i < numFiles; i++) {
          const nameMatch = text.match(new RegExp(`NAME${i}=([^\\s]+)`))
          const sizeMatch = text.match(new RegExp(`SIZE${i}=(\\d+)`))
          
          if (nameMatch && sizeMatch) {
            const name = nameMatch[1]
            // Parse date from filename (MA_YYYY-MM-DD_HH-MM-SS)
            const dateMatch = name.match(/MA_(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})/)
            const date = dateMatch ? new Date(dateMatch[1].replace('_', ' ').replace(/-/g, ':')) : new Date()
            
            files.push({
              name,
              size: parseInt(sizeMatch[1]),
              date
            })
          }
        }

        // Sort by date, newest first
        files.sort((a, b) => b.date.getTime() - a.date.getTime())
        setFiles(files)
      } catch (err) {
        console.error('Storage fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load storage')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStorage()
  }, [camera.ip, camera.port, camera.username, camera.password])

  const getDownloadUrl = (fileName: string) => {
    return `/api/stream?ip=${camera.ip}&port=${camera.port}&path=/disk/IPCAMERA_Window/${encodeURIComponent(fileName)}&username=${encodeURIComponent(camera.username)}&password=${encodeURIComponent(camera.password)}`
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Storage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading storage...</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : files.length === 0 ? (
          <div className="text-sm text-muted-foreground">No files found</div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.name} className="flex items-center justify-between py-2 border-b">
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {file.date.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a 
                    href={getDownloadUrl(file.name)}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4" />
                    <span className="sr-only">Download</span>
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 