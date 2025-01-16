export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const username = searchParams.get('username')
  const password = searchParams.get('password')

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
    const newHeaders = new Headers()
    newHeaders.set('content-type', contentType || 'application/octet-stream')

    return new Response(response.body, {
      headers: newHeaders,
    })
  } catch (error) {
    console.error('Stream error:', error)
    return new Response(`Stream error: ${error}`, { status: 500 })
  }
} 