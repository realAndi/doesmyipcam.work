import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    console.log('Connecting to camera:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'multipart/x-mixed-replace, */*',
        'User-Agent': 'IPCamViewer/1.0',
        'Connection': 'keep-alive',
      },
    })

    if (!response.ok) {
      console.error('Camera response error:', {
        status: response.status,
        statusText: response.statusText,
      })
      return new NextResponse(`Camera error: ${response.statusText}`, { 
        status: response.status 
      })
    }

    const contentType = response.headers.get('content-type')
    console.log('Camera response type:', contentType)

    // Forward the response headers
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    
    // Ensure proper content type for MJPEG
    if (contentType?.includes('multipart/x-mixed-replace')) {
      headers.set('Content-Type', contentType)
    }

    // Stream the response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch (error: unknown) {
    console.error('Proxy error details:', {
      error,
      cause: error instanceof Error ? error.cause : undefined,
      message: error instanceof Error ? error.message : 'Unknown error',
    })
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new NextResponse(`Proxy error: ${errorMessage}`, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  })
} 