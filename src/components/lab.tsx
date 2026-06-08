import { useContext, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from './themeContext'
import TodoList from './todolist'
function counterReducer(state: number, action: string) {
  switch (action) {
    case 'increment':
      return state + 1
    case 'decrement':
      return state - 1
    case 'decrement/2':
      return state - 2
    case 'reset':
      return 0
    default:
      return state
  }
}

function LabContent() {
  const [count, dispatch] = useReducer(counterReducer, 0)
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <main className="lab-page">
      <span>Практика useContext и useReducer</span>
      <h1>{count}</h1>

      <div className="counter-actions">
        <button type="button" onClick={() => dispatch('decrement')}>
          − Уменьшить
        </button>
        <button type="button" onClick={() => dispatch('decrement/2')}>
          − Уменьшить на 2
        </button>
        <button type="button" onClick={() => dispatch('reset')}>
          Сбросить
        </button>
        <button type="button" onClick={() => dispatch('increment')}>
          + Увеличить
        </button>
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
        </button>
      </div>


      <div>
        <TodoList />
      </div>

      <Link to="/">Вернуться на главную</Link>
    </main>
  )
}

function Lab() {
  const [theme, setTheme] = useState('dark')

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        <LabContent />
      </div>
    </ThemeContext.Provider>
  )
}

export default Lab
