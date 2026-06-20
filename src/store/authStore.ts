import axios from 'axios'
import { create } from 'zustand'
import {
  axiosRequest,
  getAccessToken,
  getRefreshToken,
  removeTokens,
  saveTokens,
} from '../components/axconfig/axconfig'

export type User = {
  id: string
  name: string
  email: string
}

export type Folder = {
  id: string
  name: string
  color: string
  contacts_count?: number
}

export type Contact = {
  id: string
  name: string
  phone?: string
  email?: string
  note?: string
  folder_id?: string
  folder?: Folder
  created_at?: string
}

export type Debt = {
  id: string
  contact_id: string
  direction: string
  amount: number
  paid_amount?: number
  remaining_amount?: number
  currency: string
  description?: string
  due_date?: string
  status: string
  contact?: Contact
  contact_name?: string
  created_at?: string
}

export type Payment = {
  id: string
  debt_id: string
  amount: number
  note?: string
  paid_at?: string
  created_at?: string
}

export type DashboardSummary = {
  totals: {
    they_owe_me: number
    i_owe_them: number
  }
  outstanding: {
    they_owe_me: number
    i_owe_them: number
    net_balance: number
  }
  counts: {
    pending: number
    partial: number
    paid: number
    total: number
  }
  contacts_count: number
  upcoming_due: Debt[]
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type ContactPayload = {
  name: string
  phone?: string
  email?: string
  note?: string
  folder_id?: string
}

type FolderPayload = {
  name: string
  color: string
}

type DebtPayload = {
  contact_id: string
  direction: string
  amount: number
  currency: string
  description?: string
  due_date?: string
  status?: string
}

type PaymentPayload = {
  amount: number
  note?: string
  paid_at?: string
}

type AuthResponse = {
  token?: string
  accessToken?: string
  access_token?: string
  refreshToken?: string
  refresh_token?: string
  user?: User
  data?: {
    token?: string
    accessToken?: string
    access_token?: string
    refreshToken?: string
    refresh_token?: string
    user?: User
  }
}

const emptyUser: User | null = null
const emptyFolders: Folder[] = []
const emptyContacts: Contact[] = []
const emptyDebts: Debt[] = []
const emptyPayments: Payment[] = []
const emptySummary: DashboardSummary | null = null
const emptyDebt: Debt | null = null

const getServerUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || ''
  return apiUrl.replace(/\/api\/?$/, '')
}

const getTokenFromResponse = (data: AuthResponse) => {
  return (
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    null
  )
}

const getRefreshTokenFromResponse = (data: AuthResponse) => {
  return (
    data?.refreshToken ||
    data?.refresh_token ||
    data?.data?.refreshToken ||
    data?.data?.refresh_token ||
    null
  )
}

const getUserFromResponse = (data: AuthResponse) => {
  return data?.user || data?.data?.user || null
}

const isObject = (value: unknown) => {
  return typeof value === 'object' && value !== null
}

const getMessageFromData = (data: unknown) => {
  if (!isObject(data)) {
    return ''
  }

  if ('message' in data) {
    const message = data.message

    if (Array.isArray(message)) {
      return message.join(', ')
    }

    if (typeof message === 'string') {
      return message
    }
  }

  if ('error' in data && typeof data.error === 'string') {
    return data.error
  }

  return ''
}

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Server is not responding'
    }

    const message = getMessageFromData(error.response.data)

    return message || error.message
  }

  return 'Something went wrong'
}

export const useBear = create((set) => ({
  token: getAccessToken(),
  user: emptyUser,
  folders: emptyFolders,
  contacts: emptyContacts,
  debts: emptyDebts,
  payments: emptyPayments,
  summary: emptySummary,
  selectedDebt: emptyDebt,
  isLoading: false,
  error: '',
  message: '',

  clearMessage: () => {
    set({ error: '', message: '' })
  },

  getHealth: async () => {
    try {
      set({ isLoading: true, error: '' })

      const response = await axios.get(`${getServerUrl()}/health`)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return null
    }
  },

  setSelectedDebt: (debt: Debt | null) => {
    set({ selectedDebt: debt, payments: [] })
  },

  postLogin: async (payload: LoginPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      const response = await axiosRequest.post('/auth/login', payload)
      const token = getTokenFromResponse(response.data)
      const refreshToken = getRefreshTokenFromResponse(response.data)
      const user = getUserFromResponse(response.data)

      if (token) {
        if (refreshToken) {
          saveTokens(token, refreshToken)
        } else {
          saveTokens(token)
        }

        set({ token, user, message: 'Login successful', isLoading: false })
        return true
      }

      set({ message: 'Login successful', isLoading: false })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  postRegister: async (payload: RegisterPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      const response = await axiosRequest.post('/auth/register', payload)
      const token = getTokenFromResponse(response.data)
      const refreshToken = getRefreshTokenFromResponse(response.data)
      const user = getUserFromResponse(response.data)

      if (token) {
        if (refreshToken) {
          saveTokens(token, refreshToken)
        } else {
          saveTokens(token)
        }

        set({ token, user, message: 'Registration successful', isLoading: false })
        return true
      }

      set({ message: 'Registration successful', isLoading: false })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  postRefreshToken: async () => {
    try {
      set({ isLoading: true, error: '', message: '' })

      const refreshTokenValue = getRefreshToken()

      if (!refreshTokenValue) {
        set({ error: 'Refresh token not found', isLoading: false })
        return false
      }

      const response = await axiosRequest.post('/auth/refresh', {
        refreshToken: refreshTokenValue,
      })
      const token = getTokenFromResponse(response.data)
      const refreshToken = getRefreshTokenFromResponse(response.data)

      if (token) {
        if (refreshToken) {
          saveTokens(token, refreshToken)
        } else {
          saveTokens(token)
        }

        set({ token, message: 'Token refreshed', isLoading: false })
        return true
      }

      set({ error: 'Token not found in response', isLoading: false })
      return false
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  postLogout: async () => {
    try {
      set({ isLoading: true, error: '', message: '' })

      const refreshTokenValue = getRefreshToken()

      if (refreshTokenValue) {
        await axiosRequest.post('/auth/logout', {
          refreshToken: refreshTokenValue,
        })
      }

      removeTokens()
      set({
        token: null,
        user: null,
        folders: [],
        contacts: [],
        debts: [],
        payments: [],
        summary: null,
        selectedDebt: null,
        message: '',
        isLoading: false,
      })
    } catch (error) {
      removeTokens()
      set({
        token: null,
        user: null,
        error: getErrorMessage(error),
        message: '',
        isLoading: false,
      })
    }
  },

  getAllData: async () => {
    try {
      set({ isLoading: true, error: '' })

      const user = await axiosRequest.get('/users/me')
      const summary = await axiosRequest.get('/dashboard/summary')
      const folders = await axiosRequest.get('/folders')
      const contacts = await axiosRequest.get('/contacts')
      const debts = await axiosRequest.get('/debts')

      set({
        user: user.data,
        summary: summary.data,
        folders: folders.data,
        contacts: contacts.data,
        debts: debts.data,
        isLoading: false,
      })
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
    }
  },

  postDemoData: async () => {
    try {
      set({ isLoading: true, error: '', message: '' })

      const folder = await axiosRequest.post('/folders', {
        name: 'Friends',
        color: '#6366F1',
      })
      const contact = await axiosRequest.post('/contacts', {
        name: 'Michael Stone',
        phone: '+1 555 0100',
        email: 'michael@example.com',
        note: 'Demo contact',
        folder_id: folder.data.id,
      })
      const debt = await axiosRequest.post('/debts', {
        contact_id: contact.data.id,
        direction: 'they_owe_me',
        amount: 1200,
        currency: 'USD',
        description: 'Project payment',
        due_date: '2026-07-01',
      })

      await axiosRequest.post(`/debts/${debt.data.id}/payments`, {
        amount: 300,
        note: 'First payment',
        paid_at: new Date().toISOString(),
      })

      const summary = await axiosRequest.get('/dashboard/summary')
      const folders = await axiosRequest.get('/folders')
      const contacts = await axiosRequest.get('/contacts')
      const debts = await axiosRequest.get('/debts')

      set({
        summary: summary.data,
        folders: folders.data,
        contacts: contacts.data,
        debts: debts.data,
        message: 'Demo data added',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  getUser: async () => {
    try {
      const response = await axiosRequest.get('/users/me')
      set({ user: response.data, error: '' })
    } catch (error) {
      set({ error: getErrorMessage(error) })
    }
  },

  patchUser: async (name: string) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      const response = await axiosRequest.patch('/users/me', { name })
      set({ user: response.data, message: 'Profile updated', isLoading: false })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  getDashboard: async () => {
    try {
      set({ isLoading: true, error: '' })

      const response = await axiosRequest.get('/dashboard/summary')
      set({ summary: response.data, isLoading: false })
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
    }
  },

  getFolders: async () => {
    try {
      set({ isLoading: true, error: '' })

      const response = await axiosRequest.get('/folders')
      set({ folders: response.data, isLoading: false })
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
    }
  },

  getFolder: async (id: string) => {
    try {
      set({ isLoading: true, error: '' })

      const response = await axiosRequest.get(`/folders/${id}`)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return null
    }
  },

  postFolder: async (payload: FolderPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.post('/folders', payload)
      const response = await axiosRequest.get('/folders')
      set({
        folders: response.data,
        message: 'Folder created',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  patchFolder: async (id: string, payload: FolderPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.patch(`/folders/${id}`, payload)
      const response = await axiosRequest.get('/folders')
      set({
        folders: response.data,
        message: 'Folder updated',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  deleteFolder: async (id: string) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.delete(`/folders/${id}`)
      const response = await axiosRequest.get('/folders')
      set({
        folders: response.data,
        message: 'Folder deleted',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  getContacts: async (folderId?: string) => {
    try {
      set({ isLoading: true, error: '' })

      const params = folderId ? { folder_id: folderId } : undefined
      const response = await axiosRequest.get('/contacts', { params })
      set({ contacts: response.data, isLoading: false })
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
    }
  },

  getContact: async (id: string) => {
    try {
      set({ isLoading: true, error: '' })

      const response = await axiosRequest.get(`/contacts/${id}`)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return null
    }
  },

  postContact: async (payload: ContactPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.post('/contacts', payload)
      const response = await axiosRequest.get('/contacts')
      set({
        contacts: response.data,
        message: 'Contact created',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  patchContact: async (id: string, payload: ContactPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.patch(`/contacts/${id}`, payload)
      const response = await axiosRequest.get('/contacts')
      set({
        contacts: response.data,
        message: 'Contact updated',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  deleteContact: async (id: string) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.delete(`/contacts/${id}`)
      const response = await axiosRequest.get('/contacts')
      set({
        contacts: response.data,
        message: 'Contact deleted',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  getDebts: async (filters?: { status?: string; contact_id?: string; direction?: string }) => {
    try {
      set({ isLoading: true, error: '' })

      const response = await axiosRequest.get('/debts', { params: filters })
      set({ debts: response.data, isLoading: false })
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
    }
  },

  getDebt: async (id: string) => {
    try {
      set({ isLoading: true, error: '' })

      const response = await axiosRequest.get(`/debts/${id}`)
      set({ selectedDebt: response.data, isLoading: false })
      return response.data
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return null
    }
  },

  postDebt: async (payload: DebtPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.post('/debts', payload)
      const response = await axiosRequest.get('/debts')
      const summary = await axiosRequest.get('/dashboard/summary')
      set({
        debts: response.data,
        summary: summary.data,
        message: 'Debt created',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  patchDebt: async (id: string, payload: DebtPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      const updatedDebt = await axiosRequest.patch(`/debts/${id}`, payload)
      const response = await axiosRequest.get('/debts')
      const summary = await axiosRequest.get('/dashboard/summary')
      set({
        debts: response.data,
        summary: summary.data,
        selectedDebt: updatedDebt.data,
        message: 'Debt updated',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  deleteDebt: async (id: string) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.delete(`/debts/${id}`)
      const response = await axiosRequest.get('/debts')
      const summary = await axiosRequest.get('/dashboard/summary')
      set({
        debts: response.data,
        summary: summary.data,
        selectedDebt: null,
        payments: [],
        message: 'Debt deleted',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },

  getPayments: async (debtId: string) => {
    try {
      set({ isLoading: true, error: '' })

      const response = await axiosRequest.get(`/debts/${debtId}/payments`)
      set({ payments: response.data, isLoading: false })
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
    }
  },

  postPayment: async (debtId: string, payload: PaymentPayload) => {
    try {
      set({ isLoading: true, error: '', message: '' })

      await axiosRequest.post(`/debts/${debtId}/payments`, payload)
      const payments = await axiosRequest.get(`/debts/${debtId}/payments`)
      const debt = await axiosRequest.get(`/debts/${debtId}`)
      const debts = await axiosRequest.get('/debts')
      const summary = await axiosRequest.get('/dashboard/summary')
      set({
        payments: payments.data,
        selectedDebt: debt.data,
        debts: debts.data,
        summary: summary.data,
        message: 'Payment saved',
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false })
      return false
    }
  },
}))
