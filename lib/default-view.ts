import { View } from "./types"

const DEFAULT_VIEW_KEY = 'default-view'

export function getDefaultView(): View {
  if (typeof window === 'undefined') return 'landing'
  return (localStorage.getItem(DEFAULT_VIEW_KEY) as View) || 'landing'
}

export function setDefaultView(view: View) {
  if (typeof window === 'undefined') return
  localStorage.setItem(DEFAULT_VIEW_KEY, view)
} 