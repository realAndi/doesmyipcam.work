"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Smartphone, Zap, Github, User } from "lucide-react"
import Link from "next/link"

interface LandingViewProps {
  onGetStarted: () => void
}

export function LandingView({ onGetStarted }: LandingViewProps) {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 min-h-screen flex flex-col">
      <div className="flex justify-end gap-4 text-muted-foreground">
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

      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Does My IP Cam Work?
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          A simple, secure way to view your Sharx SCNC IP cameras from any device.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button size="lg" className="gap-2" onClick={onGetStarted}>
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Fast & Simple
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Quick setup with no complicated configuration. Just add your camera and start viewing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Secure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your camera credentials are stored locally and never leave your device.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Mobile First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Optimized for mobile devices with a responsive, app-like experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 