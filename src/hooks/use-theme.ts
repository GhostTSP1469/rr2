import { useEffect, useState } from 'react'
import { applyTheme, getInitialTheme } from '../lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
