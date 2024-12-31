"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Maximize2, RotateCw, X } from "lucide-react"
import { Camera } from "./camera-context"
import { useEffect, useRef, useState, useCallback } from "react"

interface CameraViewerProps {
  camera: Camera
  onDelete: (id: string) => void
}

export function CameraViewer({ camera, onDelete }: CameraViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const retryCountRef = useRef(0)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleFullscreen = async () => {
    setIsFullscreen(!isFullscreen)
  }

  const rotateImage = () => {
    setRotation((prev) => (prev + 180) % 360)
  }

  const getMjpegUrl = useCallback((index: number) => {
    return `http://${camera.ip}:${camera.port}/live/${index}/mjpeg.jpg`
  }, [camera.ip, camera.port])

  const tryMjpegStream = useCallback((imgEl: HTMLImageElement, retryCount = 0) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const streamIndex = retryCount % 3 // Cycle through 0, 1, 2
    const mjpegUrl = getMjpegUrl(streamIndex)
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(mjpegUrl)}`
    
    console.log(`Trying MJPEG stream ${streamIndex} for camera ${camera.name}:`, mjpegUrl)
    
    // Set image source
    imgEl.src = proxyUrl

    // Set timeout for retry
    timeoutRef.current = setTimeout(() => {
      if (isConnecting) { // Only retry if we're still connecting
        console.log(`Stream ${streamIndex} timed out, trying next stream...`)
        tryMjpegStream(imgEl, retryCount + 1)
      }
    }, 10000) // 10 seconds timeout
  }, [camera.name, getMjpegUrl, isConnecting])

  useEffect(() => {
    if (camera.streamType === "mjpeg") {
      const imgEl = imgRef.current
      if (!imgEl) return

      setIsConnecting(true)
      setStreamError(null)
      retryCountRef.current = 0
      
      tryMjpegStream(imgEl)
      
      // Handle load success
      const handleLoad = () => {
        console.log(`Camera ${camera.name} MJPEG stream loaded successfully`);
        setIsConnecting(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }

      // Handle errors
      const handleError = () => {
        if (retryCountRef.current >= 8) { // Try each stream up to 3 times (9 total attempts)
          console.error('MJPEG stream error after all retries');
          setStreamError('Failed to load MJPEG stream after multiple attempts');
          setIsConnecting(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
        } else {
          retryCountRef.current++
          tryMjpegStream(imgEl, retryCountRef.current)
        }
      }

      imgEl.addEventListener('load', handleLoad)
      imgEl.addEventListener('error', handleError)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        imgEl.removeEventListener('load', handleLoad)
        imgEl.removeEventListener('error', handleError)
        imgEl.src = ''
      }
    } else {
      // For HLS, we use the video element
      const videoEl = videoRef.current
      if (!videoEl) return

      setIsConnecting(true)
      setStreamError(null)

      // Add event listeners for debugging
      const events = ['loadstart', 'loadedmetadata', 'loadeddata', 'play', 'playing', 'pause', 'waiting', 'seeking', 'seeked', 'ended', 'error'];
      const cleanupEvents = events.map(event => {
        const handler = () => console.log(`Video event (${camera.name}):`, event);
        videoEl.addEventListener(event, handler);
        return () => videoEl.removeEventListener(event, handler);
      });

      const setupStream = async () => {
        try {
          // Construct the HLS URL and proxy it
          const hlsUrl = `http://${camera.ip}:${camera.port}/live/0/h264.m3u8`
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(hlsUrl)}`
          console.log(`Camera ${camera.name} HLS URL:`, hlsUrl)
          console.log(`Camera ${camera.name} Proxy URL:`, proxyUrl)
          
          // Set video source through proxy
          videoEl.src = proxyUrl
          
          // Handle errors
          videoEl.onerror = () => {
            const error = videoEl.error;
            let errorMessage = 'Unknown error';
            
            if (error) {
              switch (error.code) {
                case 1:
                  errorMessage = 'The video loading was aborted';
                  break;
                case 2:
                  errorMessage = 'Network error while loading the video';
                  break;
                case 3:
                  errorMessage = 'Video decode failed - this might be due to an unsupported codec or format';
                  break;
                case 4:
                  errorMessage = 'The video is not supported';
                  break;
              }
              setStreamError(`${errorMessage} (Code: ${error.code})`);
              console.error('Video error:', error);
            }
            setIsConnecting(false)
          };

          // Handle successful load
          videoEl.onloadeddata = () => {
            console.log(`Camera ${camera.name} stream loaded successfully`);
            setIsConnecting(false);
            videoEl.play().catch(error => {
              console.error('Playback error:', error);
              setStreamError(`Playback failed: ${error.message || 'Unknown error'}`);
            });
          };

        } catch (err) {
          console.error('Stream error:', err)
          setStreamError(err instanceof Error ? err.message : 'Failed to setup stream')
          setIsConnecting(false)
        }
      }

      setupStream()

      return () => {
        cleanupEvents.forEach(cleanup => cleanup());
        videoEl.src = ''
      }
    }
  }, [camera])

  return (
    <Card className={isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}>
      <CardHeader className={`flex flex-row items-start justify-between space-y-0 ${isFullscreen ? 'hidden' : ''}`}>
        <CardTitle className="text-base font-medium">
          {camera.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(camera.id)}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete camera</span>
        </Button>
      </CardHeader>
      <CardContent className={`${isFullscreen ? 'p-0 h-screen bg-black' : 'p-0 space-y-4'} relative`}>
        <div 
          ref={containerRef}
          className={`relative w-full ${isFullscreen ? 'h-screen flex items-center justify-center' : 'aspect-video'} bg-muted rounded-md overflow-hidden group cursor-pointer`}
          onClick={camera.streamType === "mjpeg" ? toggleFullscreen : undefined}
        >
          {camera.streamType === "mjpeg" ? (
            <>
              <div className={`relative ${isFullscreen ? 'w-screen h-auto max-h-screen' : 'w-full h-full'}`}>
                <img
                  ref={imgRef}
                  className="object-contain transition-transform duration-300"
                  style={{ transform: `rotate(${rotation}deg)` }}
                  alt={`${camera.name} stream`}
                />
              </div>
              {isFullscreen && (
                <div className="absolute top-4 right-4 flex gap-2 z-10" onClick={e => e.stopPropagation()}>
                  {isMobile && (
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={rotateImage}
                      className="bg-black/50 hover:bg-black/70"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="bg-black/50 hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {!isFullscreen && (
                <div 
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full"
              playsInline
              autoPlay
              muted
              controls
              crossOrigin="anonymous"
            />
          )}
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">
                Connecting to stream...
              </div>
            </div>
          )}
          {streamError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm text-destructive text-center p-4 bg-background/80">
                {streamError}<br/>
                Please check your camera settings and try again.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 