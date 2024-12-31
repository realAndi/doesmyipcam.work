"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield, 
  Smartphone, 
  Zap,
  Github, 
  User, 
  Download,
  Wifi,
  Clock,
  MonitorSmartphone,
  ArrowRight,
  Plus,
  Router
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { setDefaultView } from "@/lib/default-view"

interface LandingViewProps {
  onGetStarted: () => void
}

export function LandingView({ onGetStarted }: LandingViewProps) {
  const [isPWA, setIsPWA] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if running as PWA
    setIsPWA(window.matchMedia('(display-mode: standalone)').matches)

    // Check if mobile
    setIsMobile(window.innerWidth <= 768)

    // Listen for beforeinstallprompt
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show install prompt
    deferredPrompt.prompt()
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setCanInstall(false)
    }
    
    // Clear the deferredPrompt
    setDeferredPrompt(null)
  }

  const handleGetStarted = () => {
    // Set cameras as default view after first use
    setDefaultView('cameras')
    onGetStarted()
  }

  if (isPWA) {
    return (
      <div className="container max-w-2xl mx-auto p-6 space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to IP Cam Viewer
          </h1>
          <p className="text-muted-foreground">
            Get started by adding your first Sharx SCNC camera
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to Add a Camera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Router className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Find Your Camera's Gateway IP</p>
                  <p className="text-sm text-muted-foreground">Access your camera through its gateway IP address (e.g., 192.168.1.X)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Add Your Camera</p>
                  <p className="text-sm text-muted-foreground">Click the "Add Camera" button and enter your camera's details</p>
                </div>
              </div>
            </div>
            <Button className="w-full gap-2" onClick={handleGetStarted}>
              Add Your First Camera
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col h-full">
        <div className="flex justify-end gap-4 text-muted-foreground pt-6 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both">
          <Link 
            href="https://github.com/realAndi/SharxCamViewerPWA" 
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link 
            href="https://reallyitsandi.com" 
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="sr-only">Portfolio</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            Does My IP Cam Work?
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
            A simple, secure way to view your Sharx SCNC IP cameras from any device.
          </p>
          <div className="flex flex-col items-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
            {isMobile && canInstall ? (
              <>
                <Button size="lg" className="gap-2 w-full max-w-xs" onClick={handleInstall}>
                  <Download className="w-4 h-4" />
                  Install App
                </Button>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground max-w-xs">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span>Works offline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Faster loading times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MonitorSmartphone className="w-4 h-4" />
                    <span>Native app-like experience</span>
                  </div>
                </div>
              </>
            ) : (
              <Button size="lg" className="gap-2" onClick={onGetStarted}>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isMobile && !canInstall && !isPWA && (
            <div className="mb-8 p-4 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[450ms] fill-mode-both">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MonitorSmartphone className="w-4 h-4 shrink-0" />
                <p>For the best experience, open this site in your default browser and install it as an app.</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 w-full">
            {[
              {
                title: "Fast & Simple",
                description: "Quick setup with no complicated configuration. Just add your camera and start viewing.",
                icon: Zap,
                delay: "delay-[450ms]"
              },
              {
                title: "Secure",
                description: "Your camera credentials are stored locally and never leave your device.",
                icon: Shield,
                delay: "delay-[600ms]"
              },
              {
                title: "Mobile First",
                description: "Optimized for mobile devices with a responsive, app-like experience.",
                icon: Smartphone,
                delay: "delay-[750ms]"
              }
            ].map((card, i) => (
              <Card key={i} className={cn("h-auto animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both", card.delay)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <card.icon className="w-5 h-5" />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 