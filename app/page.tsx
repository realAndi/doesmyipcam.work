"use client"

import { LandingView } from "@/components/views/landing-view"
import { CamerasView } from "@/components/views/cameras-view"
import { SettingsView } from "@/components/views/settings-view"
import { useEffect, useState } from "react"
import { getDefaultView } from "@/lib/default-view"
import { Nav } from "@/components/nav"
import { View } from "@/lib/types"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<View>('landing')

  useEffect(() => {
    // Small delay to prevent hydration issues
    const timer = setTimeout(() => {
      setView(getDefaultView())
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Handle view changes
  const handleViewChange = (newView: View) => {
    setView(newView)
  }

  // Show nothing while loading to prevent flash
  if (isLoading) {
    return null
  }

  return (
    <>
      <Nav currentView={view} onViewChange={handleViewChange} />
      {view === 'landing' && (
        <LandingView onGetStarted={() => handleViewChange('cameras')} />
      )}
      {view === 'cameras' && (
        <CamerasView />
      )}
      {view === 'settings' && (
        <SettingsView />
      )}
    </>
  )
}
