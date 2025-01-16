export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const username = searchParams.get('username')
  const password = searchParams.get('password')
  const baseUrl = searchParams.get('baseUrl')

  if (!url) {
    return new Response('Missing url parameter', { status: 400 })
  }

  const headers: Record<string, string> = {
    'Accept': '*/*',
  }

  if (username && password) {
    const auth = btoa(`${username}:${password}`)
    headers['Authorization'] = `Basic ${auth}`
  }

  try {
    const response = await fetch(url, {
      headers,
    })

    if (!response.ok) {
      return new Response(`Stream error: ${response.statusText}`, { status: response.status })
    }

    const contentType = response.headers.get('content-type')

    // Handle m3u8 playlists
    if (url.endsWith('.m3u8') || 
        contentType?.includes('application/vnd.apple.mpegurl') || 
        contentType?.includes('application/x-mpegURL')) {
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
          const segmentUrl = `${baseUrl}${segmentPath}`
          return `/api/hls?url=${encodeURIComponent(segmentUrl)}&username=${encodeURIComponent(username || '')}&password=${encodeURIComponent(password || '')}`
        }
        return line
      }).join('\n')

      return new Response(modifiedContent, {
        headers: {
          'content-type': 'application/vnd.apple.mpegurl',
        },
      })
    }

    // Handle .ts segments
    if (url.endsWith('.ts')) {
      return new Response(response.body, {
        headers: {
          'content-type': 'video/mp2t',
        },
      })
    }

    return new Response(response.body, {
      headers: {
        'content-type': contentType || 'application/octet-stream',
      },
    })
  } catch (error) {
    console.error('Stream error:', error)
    return new Response(`Stream error: ${error}`, { status: 500 })
  }
} 