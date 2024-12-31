"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function DevView() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const playStream = async () => {
    if (!url || !videoRef.current) return
    setError(null)

    try {
      // Create proxy URL
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
      console.log('Playing stream through proxy:', proxyUrl)
      
      // Set video source
      videoRef.current.src = proxyUrl
      
      // Add event listeners for debugging
      const events = ['loadstart', 'loadedmetadata', 'loadeddata', 'play', 'playing', 'pause', 'waiting', 'seeking', 'seeked', 'ended', 'error'];
      events.forEach(event => {
        videoRef.current?.addEventListener(event, () => {
          console.log(`Video event: ${event}`);
        });
      });

      // Handle errors
      videoRef.current.onerror = () => {
        const error = videoRef.current?.error;
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
          setError(`${errorMessage} (Code: ${error.code})`);
          console.error('Detailed error:', error);
        }
      };

      // Start playing
      await videoRef.current.play()
        .catch((error: any) => {
          console.error('Playback error:', error)
          setError(`Playback failed: ${error.message || 'Unknown error'}`)
        });

    } catch (err) {
      console.error('Stream error:', err)
      setError('Failed to load stream')
    }
  }

  return (
    <div className="container max-w-2xl py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>HLS Stream Tester (Native Player)</CardTitle>
          <CardDescription>
            Enter an HLS stream URL (m3u8) to test direct playback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">Stream URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="http://example.com/stream.m3u8"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button onClick={playStream}>Play</Button>
            </div>
          </div>

          <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              playsInline
              autoPlay
              crossOrigin="anonymous"
            />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-sm text-destructive text-center p-4 bg-background/80">
                  {error}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 