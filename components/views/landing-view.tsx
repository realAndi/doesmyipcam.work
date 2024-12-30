"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Smartphone, Zap, Github, User } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LandingViewProps {
  onGetStarted: () => void
}

export function LandingView({ onGetStarted }: LandingViewProps) {
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
          <div className="flex flex-wrap gap-4 justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
            <Button size="lg" className="gap-2" onClick={onGetStarted}>
              Get Started
            </Button>
          </div>

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