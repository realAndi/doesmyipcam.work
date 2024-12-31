import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return new Response('Missing url parameter', { status: 400 })
  }

  try {
    const response = await fetch(url)
    const headers = new Headers(response.headers)
    
    // Set CORS headers
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    
    // Set content type for m3u8
    if (url.endsWith('.m3u8')) {
      headers.set('Content-Type', 'application/vnd.apple.mpegurl')
    }
    // Set content type for ts segments
    else if (url.endsWith('.ts')) {
      headers.set('Content-Type', 'video/mp2t')
    }

    return new Response(response.body, {
      status: response.status,
      headers
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response('Proxy error', { status: 500 })
  }
} 