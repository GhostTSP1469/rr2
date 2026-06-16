import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState, type SyntheticEvent } from 'react'
import {
  addDataAtom,
  dataAtom,
  deleteDataAtom,
  editDataAtom,
  errorAtom,
  getDataAtom,
  isLoadingAtom,
  type Todo,
} from './store/store'

function App() {
  const data = useAtomValue(dataAtom)
  const isLoading = useAtomValue(isLoadingAtom)
  const error = useAtomValue(errorAtom)

  const getData = useSetAtom(getDataAtom)
  const addData = useSetAtom(addDataAtom)
  const editData = useSetAtom(editDataAtom)
  const deleteData = useSetAtom(deleteDataAtom)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    getData()
  }, [getData])

  const clearForm = () => {
    setName('')
    setDescription('')
    setImages([])
    setEditId(null)
    setFormError('')
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!name.trim() || !description.trim()) {
      setFormError('Fill name and description')
      return
    }

    if (editId === null && images.length === 0) {
      setFormError('Choose image for add')
      return
    }

    setFormError('')

    try {
      if (editId === null) {
        await addData({
          name,
          description,
          images,
        })
      } else {
        await editData({
          id: editId,
          name,
          description,
        })
      }

      clearForm()
    } catch {
      setFormError('Action failed')
    }
  }

  const startEdit = (todo: Todo) => {
    setEditId(todo.id)
    setName(todo.name)
    setDescription(todo.description)
    setImages([])
    setFormError('')
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-center text-3xl font-bold">API CRUD Jotai</h1>

        <form
          className="mb-6 rounded-xl bg-white p-5 shadow"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <input
              className="w-full rounded border p-3"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              className="w-full rounded border p-3"
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {editId === null && (
            <div className="mb-3">
              <input
                className="w-full rounded border p-3"
                type="file"
                multiple
                onChange={(event) =>
                  setImages(Array.from(event.target.files ?? []))
                }
              />
            </div>
          )}

          {formError && <p className="mb-3 text-red-500">{formError}</p>}
          {error && <p className="mb-3 text-red-500">{error}</p>}

          <button
            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            disabled={isLoading}
            type="submit"
          >
            {editId === null ? 'Add' : 'Save'}
          </button>

          {editId !== null && (
            <button
              className="ml-2 rounded bg-gray-500 px-5 py-2 text-white"
              type="button"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}
        </form>

        {isLoading && <p className="mb-4 text-center">Loading...</p>}

        <div className="space-y-3">
          {data.map((todo) => (
            <div
              className="rounded-xl bg-white p-4 shadow"
              key={todo.id}
            >
              <div className="mb-3">
                <h2 className="text-xl font-bold">{todo.name}</h2>
                <p className="text-slate-600">{todo.description}</p>
                <p className="text-sm text-slate-400">ID: {todo.id}</p>
                <p className="text-sm text-slate-400">
                  Images: {todo.images.length}
                </p>
              </div>

              <button
                className="mr-2 rounded bg-yellow-500 px-4 py-2 text-white"
                type="button"
                onClick={() => startEdit(todo)}
              >
                Edit
              </button>

              <button
                className="rounded bg-red-500 px-4 py-2 text-white"
                type="button"
                onClick={() => {
                  deleteData(todo.id)
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
