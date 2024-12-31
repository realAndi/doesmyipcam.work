import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const ip = request.nextUrl.searchParams.get('ip')
  const port = request.nextUrl.searchParams.get('port')
  const path = request.nextUrl.searchParams.get('path')
  const username = request.nextUrl.searchParams.get('username')
  const password = request.nextUrl.searchParams.get('password')
  
  if (!ip || !port || !path) {
    return NextResponse.json({ error: 'IP, port, and path parameters are required' }, { status: 400 })
  }

  try {
    const url = `http://${ip}:${port}${path}`
    const headers: Record<string, string> = {
      'Accept': 'application/x-mpegURL,application/vnd.apple.mpegurl,video/mp2t,video/mp4,image/jpeg,*/*',
    }

    if (username && password) {
      const auth = Buffer.from(`${username}:${password}`).toString('base64')
      headers['Authorization'] = `Basic ${auth}`
    }

    const response = await fetch(url, {
      headers,
      credentials: 'omit',
      mode: 'cors',
    })

    if (!response.ok) {
      console.error('Fetch failed:', response.status, response.statusText)
      return NextResponse.json({ error: 'Failed to fetch stream' }, { status: response.status })
    }

    const contentType = response.headers.get('content-type')
    console.log('Content-Type:', contentType)
    
    const responseHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Expose-Headers': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    })

    // Handle m3u8 playlists
    if (path.endsWith('.m3u8') || 
        contentType?.includes('application/vnd.apple.mpegurl') || 
        contentType?.includes('application/x-mpegURL')) {
      responseHeaders.set('Content-Type', 'application/vnd.apple.mpegurl')
      
      const text = await response.text()
      
      // Replace segment URLs with proxied URLs
      const modifiedContent = text.split('\n').map(line => {
        const trimmedLine = line.trim()
        // Only modify lines that end with .ts and don't start with #
        if (trimmedLine.endsWith('.ts?basic=') || trimmedLine.includes('.ts?')) {
          // Extract just the .ts filename from the full URL
          const matches = trimmedLine.match(/\/([^\/]+\.ts)/)
          if (!matches) return line
          
          const tsFile = matches[1]
          const segmentPath = `/live/0/${tsFile}`
          return `/api/stream?ip=${ip}&port=${port}&path=${encodeURIComponent(segmentPath)}&username=${encodeURIComponent(username || '')}&password=${encodeURIComponent(password || '')}`
        }
        return line
      }).join('\n')

      return new NextResponse(modifiedContent, { 
        headers: responseHeaders,
        status: 200
      })
    }
    
    // Handle .ts segments
    if (path.endsWith('.ts')) {
      responseHeaders.set('Content-Type', 'video/mp2t')
      return new NextResponse(response.body, { 
        headers: responseHeaders,
        status: 200
      })
    }

    // Handle MJPEG streams
    if (contentType?.includes('image/jpeg')) {
      responseHeaders.set('Content-Type', 'multipart/x-mixed-replace; boundary=--myboundary')
      responseHeaders.set('Connection', 'keep-alive')
      return new NextResponse(response.body, { 
        headers: responseHeaders,
        status: 200
      })
    }

    // Pass through other content types
    if (contentType) {
      responseHeaders.set('Content-Type', contentType)
    }
    
    return new NextResponse(response.body, { 
      headers: responseHeaders,
      status: 200
    })
  } catch (error) {
    console.error('Stream error:', error)
    return NextResponse.json({ error: 'Failed to proxy stream' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
      'Access-Control-Expose-Headers': 'Content-Range, Content-Length',
    },
  })
} 