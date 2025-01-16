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
      return new Response(`Failed to fetch storage files: ${response.statusText}`, { status: response.status })
    }

    const text = await response.text()
    
    // Parse the response into JSON format
    const files: { name: string; size: number }[] = []
    const regex = /NAME(\d+)=([^\s]+)\s+SIZE\1=(\d+)/g
    let match

    while ((match = regex.exec(text)) !== null) {
      files.push({
        name: match[2],
        size: parseInt(match[3], 10)
      })
    }

    return new Response(JSON.stringify({
      success: text.startsWith('000 Success'),
      files
    }), {
      headers: {
        'content-type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Storage error:', error)
    return new Response(`Storage error: ${error}`, { status: 500 })
  }
} 