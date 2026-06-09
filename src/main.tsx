import { StrictMode, useReducer } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App'
import Lab from './components/lab'
import { initialState, StoreContext, storeReducer } from './components/store'
import { store } from './store/store'
 
export function Root() {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  return (
    <Provider store={store}>
      <StoreContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/lab" element={<Lab />} />
          </Routes>
        </BrowserRouter>
      </StoreContext.Provider>
    </Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
