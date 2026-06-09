import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type User = {
  id: number
  name: string
  description: string
  email: string
  status: boolean
}

export type UserForm = Omit<User, 'id'>

const initialUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    description: 'Frontend-разработчик и участник команды Arcana.',
    email: 'john.doe@example.com',
    status: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    description: 'Дизайнер интерфейсов и исследователь продукта.',
    email: 'jane.smith@example.com',
    status: false,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    description: 'Backend-разработчик и специалист по API.',
    email: 'alice.johnson@example.com',
    status: true,
  },
]

const usersSlice = createSlice({
  name: 'users',
  initialState: initialUsers,
  reducers: {
    addUser: {
      reducer: (users, action: PayloadAction<User>) => {
        users.push(action.payload)
      },
      prepare: (user: UserForm) => ({
        payload: {
          ...user,
          id: Date.now(),
        },
      }),
    },
    editUser: (
      users,
      action: PayloadAction<{ id: number; changes: UserForm }>,
    ) => {
      const user = users.find((currentUser) => currentUser.id === action.payload.id)

      if (user) {
        Object.assign(user, action.payload.changes)
      }
    },
    deleteUser: (users, action: PayloadAction<number>) =>
      users.filter((user) => user.id !== action.payload),
  },
})

export const { addUser, editUser, deleteUser } = usersSlice.actions

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
