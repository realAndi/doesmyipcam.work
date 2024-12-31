# IP Cam Viewer

A simple, secure way to view your Sharx SCNC IP cameras from any device. Built with Next.js and Tailwind CSS.

## Features

- 🔒 Secure HTTPS streaming
- 📱 Progressive Web App (PWA) support
- 🎥 Dual streaming options:
  - MJPEG: Fast refresh rate with minimal delay
  - HLS (m3u8): Native video player with audio support
- 🌓 Dark/Light mode
- 💾 Local storage for camera settings
- 📱 Mobile-optimized with fullscreen support
- 🔐 Credentials stored locally, never transmitted

## Getting Started

1. Access your Sharx SCNC camera through its gateway IP address (e.g., 192.168.1.X)
2. Add your camera using the "Add Camera" button
3. Choose your preferred stream type:
   - MJPEG for faster refresh rates and lower latency
   - HLS for audio support and native video controls

## Installation

For the best experience on mobile devices:
1. Open the site in your default browser
2. Install as a PWA when prompted
3. Enjoy offline support and faster loading times

## Development

```bash
npm install
npm run dev
```

## Security

- All camera credentials are stored locally in your browser
- No data is transmitted to external servers
- HTTPS ensures secure communication with your cameras

## License

MIT
