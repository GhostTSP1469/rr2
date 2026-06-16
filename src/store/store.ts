import { atom } from 'jotai'
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

const api = 'https://to-dos-api.softclub.tj/api/to-dos'

const initialData: Todo[] = []
const initialError: string | null = null

export const dataAtom = atom(initialData)
export const isLoadingAtom = atom(false)
export const errorAtom = atom(initialError)

const loadTodos = async () => {
  const response = await axios.get(api)
  const result = response.data as TodoApiResponse

  return result.data
}

export const getDataAtom = atom(null, async (_get, set) => {
  try {
    set(isLoadingAtom, true)
    set(errorAtom, null)

    const todos = await loadTodos()
    set(dataAtom, todos)
  } catch {
    set(errorAtom, 'Failed to load todos')
  } finally {
    set(isLoadingAtom, false)
  }
})

export const addDataAtom = atom(null, async (_get, set, todo: AddTodo) => {
  try {
    set(isLoadingAtom, true)
    set(errorAtom, null)

    const formData = new FormData()

    formData.append('Name', todo.name)
    formData.append('Description', todo.description)
    todo.images.forEach((image) => {
      formData.append('Images', image)
    })

    await axios.post(api, formData)

    const todos = await loadTodos()
    set(dataAtom, todos)
  } catch {
    set(errorAtom, 'Failed to add todo')
    throw new Error('Failed to add todo')
  } finally {
    set(isLoadingAtom, false)
  }
})

export const editDataAtom = atom(null, async (_get, set, todo: EditTodo) => {
  try {
    set(isLoadingAtom, true)
    set(errorAtom, null)

    await axios.put(api, {
      id: todo.id,
      name: todo.name,
      description: todo.description,
    })

    set(dataAtom, (todos) =>
      todos.map((currentTodo) =>
        currentTodo.id === todo.id ? { ...currentTodo, ...todo } : currentTodo,
      ),
    )
  } catch {
    set(errorAtom, 'Failed to edit todo')
    throw new Error('Failed to edit todo')
  } finally {
    set(isLoadingAtom, false)
  }
})

export const deleteDataAtom = atom(null, async (_get, set, id: number) => {
  try {
    set(errorAtom, null)

    await axios.delete(api, {
      params: { id },
    })

    set(dataAtom, (todos) => todos.filter((todo) => todo.id !== id))
  } catch {
    set(errorAtom, 'Failed to delete todo')
  }
})
