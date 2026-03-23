// useTheme.js
// ─────────────────────────────────────────────────────────────────────────────
// THE FIX EXPLAINED:
//
// The previous code did:
//   <div className={dark ? "dark" : ""}>
//
// This does NOT work because Tailwind's darkMode: 'class' strategy looks for
// the 'dark' class specifically on the <html> element (document.documentElement).
// It cannot detect it on a wrapper div inside the tree.
//
// The fix: toggle the 'dark' class directly on document.documentElement via
// a useEffect whenever the dark state changes.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

export function useTheme() {
  // Initialise from localStorage so preference survives page refreshes
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('synergy-theme')
    if (saved) return saved === 'dark'
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement          // ← the <html> element
    if (dark) {
      root.classList.add('dark')                   // ← add 'dark' here
    } else {
      root.classList.remove('dark')                // ← remove 'dark' here
    }
    localStorage.setItem('synergy-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => setDark(prev => !prev)

  return { dark, toggleTheme }
}
