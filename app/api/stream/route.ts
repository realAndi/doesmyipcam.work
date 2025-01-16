import { NextRequest, NextResponse } from 'next/server'
import { Socket } from 'net'

async function getRawResponse(ip: string, port: string, path: string, auth: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = new Socket()
    let response = ''

    socket.connect(parseInt(port), ip, () => {
      socket.write(
        `GET ${path} HTTP/1.1\r\n` +
        `Host: ${ip}:${port}\r\n` +
        `Authorization: Basic ${auth}\r\n` +
        `Connection: close\r\n\r\n`
      )
    })

    socket.on('data', (data) => {
      response += data.toString()
    })

    socket.on('end', () => {
      // Try different response formats
      // First try double CRLF
      let bodyMatch = response.match(/\r\n\r\n([\s\S]+)$/)
      if (!bodyMatch) {
        // Try double LF
        bodyMatch = response.match(/\n\n([\s\S]+)$/)
      }
      if (!bodyMatch) {
        // Try single CRLF
        bodyMatch = response.match(/\r\n([\s\S]+)$/)
      }
      if (!bodyMatch) {
        // Try single LF
        bodyMatch = response.match(/\n([\s\S]+)$/)
      }
      
      if (bodyMatch) {
        const body = bodyMatch[1].trim()
        resolve(body)
      } else {
        // If no headers found, try using the entire response
        if (response.trim()) {
          console.log('Using entire response as body')
          resolve(response.trim())
        } else {
          console.log('Invalid response format, response was:', response)
          reject(new Error('Invalid response format'))
        }
      }
    })

    socket.on('error', (err) => {
      reject(err)
    })

    // Set a timeout
    socket.setTimeout(5000, () => {
      socket.destroy()
      reject(new Error('Connection timeout'))
    })
  })
}

export async function GET(request: NextRequest) {
  const ip = request.nextUrl.searchParams.get('ip')
  const port = request.nextUrl.searchParams.get('port')
  const path = request.nextUrl.searchParams.get('path')
  const username = request.nextUrl.searchParams.get('username')
  const password = request.nextUrl.searchParams.get('password')
  
  if (!ip || !port || !path) {
    return NextResponse.json({ error: 'IP, port, and path parameters are required' }, { status: 400 })
  }

  try {
    // Handle storage file list with raw TCP socket
    if (path === '/form/getStorageFileList') {
      const auth = Buffer.from(`${username}:${password}`).toString('base64')
      const text = await getRawResponse(ip, port, path, auth)
      
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

      return NextResponse.json({
        success: text.startsWith('000 Success'),
        files
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        status: 200
      })
    }

    // Rest of the existing code for other endpoints
    const url = `http://${ip}:${port}${path}`
    const headers: Record<string, string> = {
      'Accept': '*/*',
    }

    if (username && password) {
      const auth = Buffer.from(`${username}:${password}`).toString('base64')
      headers['Authorization'] = `Basic ${auth}`
    }

    const response = await fetch(url, {
      headers,
      credentials: 'omit',
    })

    if (!response.ok) {
      console.error('Fetch failed:', response.status, response.statusText)
      return NextResponse.json({ error: 'Failed to fetch stream' }, { status: response.status })
    }

    const contentType = response.headers.get('content-type')
    console.log('Content-Type:', contentType)
    
    const responseHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Expose-Headers': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    })

    // Handle file downloads
    if (path.startsWith('/disk/IPCAMERA_Window/')) {
      responseHeaders.set('Content-Type', 'application/octet-stream')
      responseHeaders.set('Content-Disposition', 'attachment')
      return new NextResponse(response.body, {
        headers: responseHeaders,
        status: 200
      })
    }

    // Handle m3u8 playlists
    if (path.endsWith('.m3u8') || 
        contentType?.includes('application/vnd.apple.mpegurl') || 
        contentType?.includes('application/x-mpegURL')) {
      responseHeaders.set('Content-Type', 'application/vnd.apple.mpegurl')
      
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
          return `/api/stream?ip=${ip}&port=${port}&path=${encodeURIComponent(segmentPath)}&username=${encodeURIComponent(username || '')}&password=${encodeURIComponent(password || '')}`
        }
        return line
      }).join('\n')

      return new NextResponse(modifiedContent, { 
        headers: responseHeaders,
        status: 200
      })
    }
    
    // Handle .ts segments
    if (path.endsWith('.ts')) {
      responseHeaders.set('Content-Type', 'video/mp2t')
      return new NextResponse(response.body, { 
        headers: responseHeaders,
        status: 200
      })
    }

    // Handle MJPEG streams
    if (contentType?.includes('image/jpeg')) {
      responseHeaders.set('Content-Type', 'multipart/x-mixed-replace; boundary=--myboundary')
      responseHeaders.set('Connection', 'keep-alive')
      return new NextResponse(response.body, { 
        headers: responseHeaders,
        status: 200
      })
    }

    // Pass through other content types
    if (contentType) {
      responseHeaders.set('Content-Type', contentType)
    }
    
    return new NextResponse(response.body, { 
      headers: responseHeaders,
      status: 200
    })
  } catch (error) {
    console.error('Stream error:', error)
    return NextResponse.json({ error: 'Failed to proxy stream' }, { status: 500 })
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