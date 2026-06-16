import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export type TodoImage = {
  id: number
  imageName: string
}

export type Todo = {
  id: number
  name: string
  description: string
  isCompleted: boolean
  images: TodoImage[]
}

type TodoApiResponse = {
  data: Todo[]
  errors: string[]
  statusCode: number
}

type TodoState = {
  data: Todo[]
  isLoading: boolean
  error: string | null
}

type AddTodo = {
  name: string
  description: string
  images: File[]
}

type EditTodo = {
  id: number
  name: string
  description: string
}

const initialState: TodoState = {
  data: [],
  isLoading: false,
  error: null,
}

const api = 'https://to-dos-api.softclub.tj/api/to-dos'

const loadTodos = async () => {
  const response = await axios.get(api)
  const result = response.data as TodoApiResponse

  return result.data
}

export const getData = createAsyncThunk('todo/getData', async () => {
  try {
    return await loadTodos()
  } catch {
    throw new Error('Failed to load todos')
  }
})

export const addData = createAsyncThunk('todo/addData', async (todo: AddTodo) => {
  try {
    const formData = new FormData()

    formData.append('Name', todo.name)
    formData.append('Description', todo.description)
    todo.images.forEach((image) => {
      formData.append('Images', image)
    })

    await axios.post(api, formData)

    return await loadTodos()
  } catch {
    throw new Error('Failed to add todo')
  }
})

export const editData = createAsyncThunk('todo/editData', async (todo: EditTodo) => {
  try {
    await axios.put(api, {
      id: todo.id,
      name: todo.name,
      description: todo.description,
    })

    return todo
  } catch {
    throw new Error('Failed to edit todo')
  }
})

export const deleteData = createAsyncThunk('todo/deleteData', async (id: number) => {
  try {
    await axios.delete(api, {
      params: { id },
    })

    return id
  } catch {
    throw new Error('Failed to delete todo')
  }
})

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(getData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Something went wrong'
      })
      .addCase(addData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(addData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Something went wrong'
      })
      .addCase(editData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(editData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = state.data.map((todo) =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo,
        )
      })
      .addCase(editData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Something went wrong'
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.data = state.data.filter((todo) => todo.id !== action.payload)
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.error = action.error.message ?? 'Something went wrong'
      })
  },
})

export const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
  },
})
