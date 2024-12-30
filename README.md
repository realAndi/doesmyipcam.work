# SharxCamViewerPWA

A Progressive Web App (PWA) optimized for mobile devices to view Sharx SCNC IP cameras via MJPEG streams. Built with modern web technologies and a focus on user experience.

### Written by AI

## Features

- 🎥 MJPEG stream support for Sharx SCNC cameras
- 💾 Local storage for camera settings
- 📲 PWA support for installation on mobile devices
- 🎨 Modern, responsive UI

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **State Management**: React Context
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/realandi/ipcam-viewer.git
cd ipcam-viewer
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Usage

1. Add a camera by clicking the "Add Camera" button
2. Enter your camera details:
   - Camera Name
   - IP Address
   - Port
   - Username
   - Password

3. View your camera stream in the cameras page
4. Manage cameras and settings in the settings page

## Project Structure

```
├── app/                  # Next.js app router pages
├── components/          
│   ├── camera/          # Camera-related components
│   ├── layout/          # Layout components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utility functions
└── public/              # Static assets and PWA manifest
```

## Future Features

- [ ] RTSP stream support
- [ ] Multiple camera layouts
- [ ] Camera PTZ controls
- [ ] Motion detection alerts
- [ ] Camera settings management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
