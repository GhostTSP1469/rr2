import axios from 'axios'
import { create } from 'zustand'

const API_URL = '/api/users'

export type User = {
  id: number | string
  name: string
  description: string
  email: string
  status: boolean
}

export type UserForm = Omit<User, 'id'>

type UserStore = {
  users: User[]
  loading: boolean
  saving: boolean
  error: string
  fetchUsers: () => Promise<void>
  addUser: (user: UserForm) => Promise<boolean>
  editUser: (id: User['id'], user: UserForm) => Promise<boolean>
  deleteUser: (id: User['id']) => Promise<boolean>
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return 'API-сервер недоступен. Перезапустите проект командой npm run dev.'
    }

    return error.response?.data?.message ?? error.message
  }

  return 'Произошла неизвестная ошибка'
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  saving: false,
  error: '',

  fetchUsers: async () => {
    set({ loading: true, error: '' })

    try {
      const response = await axios.get<User[]>(API_URL)
      set({ users: response.data })
    } catch (error) {
      set({ error: getErrorMessage(error) })
    } finally {
      set({ loading: false })
    }
  },

  addUser: async (user) => {
    set({ saving: true, error: '' })

    try {
      const response = await axios.post<User>(API_URL, user)
      set((state) => ({ users: [...state.users, response.data] }))
      return true
    } catch (error) {
      set({ error: getErrorMessage(error) })
      return false
    } finally {
      set({ saving: false })
    }
  },

  editUser: async (id, user) => {
    set({ saving: true, error: '' })

    try {
      const response = await axios.put<User>(`${API_URL}/${id}`, user)
      set((state) => ({
        users: state.users.map((currentUser) =>
          currentUser.id === id ? response.data : currentUser,
        ),
      }))
      return true
    } catch (error) {
      set({ error: getErrorMessage(error) })
      return false
    } finally {
      set({ saving: false })
    }
  },

  deleteUser: async (id) => {
    set({ saving: true, error: '' })

    try {
      await axios.delete(`${API_URL}/${id}`)
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }))
      return true
    } catch (error) {
      set({ error: getErrorMessage(error) })
      return false
    } finally {
      set({ saving: false })
    }
  },
}))
