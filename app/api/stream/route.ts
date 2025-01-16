export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const username = searchParams.get('username')
  const password = searchParams.get('password')
  const path = searchParams.get('path')

  if (!url && !path) {
    return new Response('Missing url or path parameter', { status: 400 })
  }

  const fullUrl = path ? 
    `http://${searchParams.get('ip')}:${searchParams.get('port')}${path}` : 
    url as string

  const headers: Record<string, string> = {
    'Accept': 'multipart/x-mixed-replace, */*',
  }

  if (username && password) {
    const auth = btoa(`${username}:${password}`)
    headers['Authorization'] = `Basic ${auth}`
  }

  try {
    const response = await fetch(fullUrl, {
      headers,
    })

    if (!response.ok) {
      return new Response(`Stream error: ${response.statusText}`, { status: response.status })
    }

    const contentType = response.headers.get('content-type')
    const newHeaders = new Headers()
    
    // Set appropriate headers for MJPEG streaming
    if (path?.includes('mjpeg')) {
      newHeaders.set('content-type', 'multipart/x-mixed-replace; boundary=--myboundary')
      newHeaders.set('connection', 'keep-alive')
      newHeaders.set('cache-control', 'no-cache, no-store, must-revalidate')
      newHeaders.set('pragma', 'no-cache')
      newHeaders.set('expires', '0')
    } else {
      newHeaders.set('content-type', contentType || 'application/octet-stream')
    }

    return new Response(response.body, {
      headers: newHeaders,
    })
  } catch (error) {
    console.error('Stream error:', error)
    return new Response(`Stream error: ${error}`, { status: 500 })
  }
} 