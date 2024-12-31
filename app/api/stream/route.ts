import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error('Fetch failed:', response.status, response.statusText)
      return NextResponse.json({ error: 'Failed to fetch stream' }, { status: response.status })
    }

    const contentType = response.headers.get('content-type')
    console.log('Content-Type:', contentType)
    
    const headers = new Headers()
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')

    // Handle different stream types
    if (url.endsWith('.m3u8')) {
      console.log('Handling HLS manifest')
      headers.set('Content-Type', 'application/vnd.apple.mpegurl')
      headers.set('Cache-Control', 'no-cache')

      // Get the manifest content
      const text = await response.text()
      console.log('Original M3U8 content:', text)

      // Get the base URL for the stream
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1)
      
      // Replace segment URLs with proxied URLs
      const modifiedContent = text.split('\n').map(line => {
        if (line.trim().endsWith('.ts')) {
          // It's a segment URL - remove any leading whitespace
          const segmentUrl = line.trim()
          return `/api/stream?url=${encodeURIComponent(segmentUrl)}&baseUrl=${encodeURIComponent(baseUrl)}`
        }
        return line
      }).join('\n')

      console.log('Modified M3U8 content:', modifiedContent)
      
      return new NextResponse(modifiedContent, {
        status: 200,
        headers,
      })
    } else if (url.endsWith('.ts')) {
      console.log('Handling HLS segment')
      headers.set('Content-Type', 'video/mp2t')
      return new NextResponse(response.body, {
        status: 200,
        headers,
      })
    } else if (contentType?.includes('image/jpeg')) {
      console.log('Handling MJPEG stream')
      headers.set('Content-Type', 'multipart/x-mixed-replace; boundary=--myboundary')
      headers.set('Connection', 'keep-alive')
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      headers.set('Pragma', 'no-cache')
      headers.set('Expires', '0')
      return new NextResponse(response.body, {
        status: 200,
        headers,
      })
    } else {
      console.log('Passing through content type:', contentType)
      if (contentType) {
        headers.set('Content-Type', contentType)
      }
      return new NextResponse(response.body, {
        status: 200,
        headers,
      })
    }
  } catch (err) {
    console.error('Stream error:', err)
    return NextResponse.json({ error: 'Failed to proxy stream' }, { status: 500 })
  }
}

export async function OPTIONS(req: NextRequest) {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  
  return new NextResponse(null, {
    status: 204,
    headers,
  })
} 