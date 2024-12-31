import { NextRequest, NextResponse } from 'next/server'

// Configure the runtime to use edge
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      credentials: 'omit',
      mode: 'cors',
      headers: {
        'Accept': 'application/x-mpegURL,application/vnd.apple.mpegurl,video/mp2t,video/mp4,*/*',
      }
    })
    
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    
    // Common security headers
    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
      'Access-Control-Expose-Headers': 'Content-Range, Content-Length',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }

    // Handle m3u8 playlists
    if (contentType.includes('application/vnd.apple.mpegurl') || 
        contentType.includes('application/x-mpegURL')) {
      const text = await response.text()
      
      // Rewrite relative and absolute URLs
      const rewrittenText = text
        .replace(/(https?:\/\/[^"\s]*)/g, (match) => `/api/proxy?url=${encodeURIComponent(match)}`)
        .replace(/^(?!#)(?!\s*https?:\/\/)([\w\-\.\/]+\.ts)/gm, (match) => {
          const baseUrl = new URL(url)
          const absoluteUrl = new URL(match, baseUrl).toString()
          return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`
        })

      return new NextResponse(rewrittenText, { headers })
    }

    // For video segments and other content, stream the response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 })
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