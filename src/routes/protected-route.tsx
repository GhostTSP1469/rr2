import { Navigate, Outlet } from 'react-router-dom'
import { useBear } from '../store/authStore'

export function ProtectedRoute() {
  const { token } = useBear()

  if (!token) {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}
