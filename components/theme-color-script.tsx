"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeColorScript() {
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme
    const themeColor = currentTheme === "dark" ? "#000000" : "#ffffff"
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor)
  }, [theme, systemTheme])

  return null
} 