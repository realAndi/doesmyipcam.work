"use client"

import { useState } from "react"
import { CamerasView } from "@/components/views/cameras-view"
import { SettingsView } from "@/components/views/settings-view"
import { LandingView } from "@/components/views/landing-view"
import { Nav } from "@/components/nav"
import { View } from "@/lib/types"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>("landing")

  const handleViewChange = (view: View) => {
    if (view !== currentView) {
      setCurrentView(view)
    }
  }

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingView onGetStarted={() => handleViewChange("cameras")} />
      case "cameras":
        return <CamerasView />
      case "settings":
        return <SettingsView />
    }
  }

  return (
    <>
      <Nav currentView={currentView} onViewChange={handleViewChange} />
      {renderView()}
    </>
  )
}
