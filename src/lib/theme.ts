export type Theme = 'light' | 'dark'

export function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem('debtflow_theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('debtflow_theme', theme)
}
