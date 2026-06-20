import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/home'
import { AuthPage } from './pages/auth-page'
import { ProtectedRoute } from './routes/protected-route'
import { PublicRoute } from './routes/public-route'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthPage mode="login" />} path="/login" />
          <Route element={<AuthPage mode="register" />} path="/register" />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Navigate replace to="/dashboard" />} path="/" />
          <Route element={<Home />} path="/dashboard" />
          <Route element={<Home />} path="/debts" />
          <Route element={<Home />} path="/debts/:id" />
          <Route element={<Home />} path="/contacts" />
          <Route element={<Home />} path="/folders" />
          <Route element={<Home />} path="/profile" />
        </Route>

        <Route element={<Navigate replace to="/dashboard" />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
