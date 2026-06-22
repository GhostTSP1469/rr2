import { useTheme } from '../../hooks/use-theme'

type ThemeToggleProps = {
  compact?: boolean
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="theme-toggle"
      title={isDark ? 'Light mode' : 'Dark mode'}
      type="button"
      onClick={toggleTheme}
    >
      <span className="material-symbols-outlined text-[19px]">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
      {!compact && <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>}
    </button>
  )
}
