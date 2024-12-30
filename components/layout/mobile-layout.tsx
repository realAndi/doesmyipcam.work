"use client"

import { Home, Settings, Grid } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home
  },
  {
    name: "Cameras",
    href: "/cameras",
    icon: Grid
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings
  }
]

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container p-4">
        {children}
      </main>
      
      <nav className="fixed pb-4 bottom-0 left-0 right-0 border-t bg-background">
        <div className="container flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 gap-1 p-2 text-sm",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      
      {/* Add bottom padding to account for navigation bar */}
      <div className="h-20" />
    </div>
  )
} 