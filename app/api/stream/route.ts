import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const url = searchParams.get('url')
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'multipart/x-mixed-replace;boundary=myboundary'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch stream: ${response.status} ${response.statusText}`)
    }

    // Forward the response with appropriate headers
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'multipart/x-mixed-replace;boundary=myboundary',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Stream error:', error)
    return new NextResponse('Failed to proxy stream', { status: 500 })
  }
} 