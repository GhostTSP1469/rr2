import { Navigate, Outlet } from 'react-router-dom'
import { useBear } from '../store/authStore'

export function PublicRoute() {
  const { token } = useBear()

  if (token) {
    return <Navigate replace to="/dashboard" />
  }

  return <Outlet />
}
