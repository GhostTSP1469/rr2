import axios from 'axios'

export function saveAccessToken(token: string) {
  localStorage.setItem('access_token', token)
}

export function saveRefreshToken(token: string) {
  localStorage.setItem('refresh_token', token)
}

export function saveTokens(accessToken: string, refreshToken?: string) {
  saveAccessToken(accessToken)

  if (refreshToken) {
    saveRefreshToken(refreshToken)
  }
}

export function removeTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

export const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export async function refreshToken() {
  const refreshTokenValue = getRefreshToken()

  if (!refreshTokenValue) {
    return ''
  }

  const response = await axiosRequest.post('/auth/refresh', {
    refreshToken: refreshTokenValue,
  })

  saveTokens(response.data.accessToken, response.data.refreshToken)

  return response.data.accessToken
}

export async function logoutRequest() {
  const refreshTokenValue = getRefreshToken()

  if (!refreshTokenValue) {
    removeTokens()
    return
  }

  await axiosRequest.post('/auth/logout', {
    refreshToken: refreshTokenValue,
  })

  removeTokens()
}

axiosRequest.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
