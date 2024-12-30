import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url, username, password } = await req.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const auth = Buffer.from(`${username}:${password}`).toString('base64')
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch stream' }, { status: response.status })
    }

    // Forward the response headers and body
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 