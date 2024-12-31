import { NextRequest, NextResponse } from 'next/server'
import WebSocket from 'ws'
import { spawn } from 'child_process'

const streams = new Map()

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return new NextResponse('Missing RTSP URL', { status: 400 })
    }

    // Create a unique stream ID
    const streamId = Buffer.from(url).toString('base64')

    // Check if stream already exists
    if (!streams.has(streamId)) {
      // Create WebSocket server for this stream
      const wss = new WebSocket.Server({ port: 0 })
      const port = (wss.address() as any).port

      // Start FFmpeg process
      const ffmpeg = spawn('ffmpeg', [
        '-i', url,
        '-f', 'mpegts',
        '-codec:v', 'mpeg1video',
        '-b:v', '1000k',
        '-bf', '0',
        '-codec:a', 'mp2',
        '-ar', '44100',
        '-ac', '1',
        '-b:a', '128k',
        '-muxdelay', '0.001',
        'pipe:1'
      ])

      // Handle FFmpeg output
      ffmpeg.stdout.on('data', (data) => {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data)
          }
        })
      })

      // Store stream info
      streams.set(streamId, { wss, ffmpeg, port })
    }

    const { port } = streams.get(streamId)

    return NextResponse.json({ 
      streamId,
      wsUrl: `ws://${req.headers.get('host')?.split(':')[0]}:${port}`
    })
  } catch (error) {
    console.error('RTSP connection error:', error)
    return new NextResponse('Failed to connect to RTSP stream', { status: 500 })
  }
}

// Cleanup function for streams
export async function DELETE(req: NextRequest) {
  try {
    const { streamId } = await req.json()
    const stream = streams.get(streamId)
    
    if (stream) {
      stream.ffmpeg.kill()
      stream.wss.close()
      streams.delete(streamId)
    }

    return new NextResponse('Stream closed', { status: 200 })
  } catch (error) {
    return new NextResponse('Failed to close stream', { status: 500 })
  }
} 