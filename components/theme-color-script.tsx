"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeColorScript() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      const color = resolvedTheme === 'dark' ? '#000000' : '#ffffff'
      meta.setAttribute('content', color)
      
      // Add transition style
      const style = document.createElement('style')
      style.textContent = `
        @property --theme-color {
          syntax: '<color>';
          initial-value: ${color};
          inherits: false;
        }
        
        meta[name="theme-color"] {
          transition: content 0.15s ease;
        }
      `
      document.head.appendChild(style)
    }
  }, [resolvedTheme])

  return null
} 