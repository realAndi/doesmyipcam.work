"use client"

import { Camera, Code, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { View } from "@/lib/types"

interface NavProps {
  currentView: View
  onViewChange: (view: View) => void
}

const links = [
  {
    name: "Cameras",
    view: "cameras" as const,
    icon: Camera,
  },
  {
    name: "Settings",
    view: "settings" as const,
    icon: Settings,
  },
  {
    name: "Dev Tools",
    view: "dev" as const,
    icon: Code,
  },
]

export function Nav({ currentView, onViewChange }: NavProps) {
  if (currentView === "landing") {
    return null
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-auto md:right-12 md:top-6 z-50">
      <div className="flex items-center gap-2 bg-background border rounded-full shadow-lg px-3 py-2 md:py-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = currentView === link.view

          return (
            <button
              key={link.view}
              onClick={() => onViewChange(link.view as View)}
              className={cn(
                "flex items-center gap-2 px-8 py-2 rounded-full transition-colors",
                "hover:bg-accent",
                isActive && "bg-accent"
              )}
            >
              <Icon className="w-6 h-6 md:w-5 md:h-5" />
              <span className="sr-only md:not-sr-only">{link.name}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
} 