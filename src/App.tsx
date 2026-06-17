import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useForm, type FieldValues } from 'react-hook-form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog'
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

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [deleteTodo, setDeleteTodo] = useState<Todo | null>(null)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    shouldUnregister: true,
  })

  useEffect(() => {
    getData()
  }, [getData])

  const openAddModal = () => {
    setEditingTodo(null)
    setFormError('')
    reset()
    setIsFormOpen(true)
  }

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo)
    setFormError('')
    reset({
      name: todo.name,
      description: todo.description,
    })
    setIsFormOpen(true)
  }

  const closeFormModal = () => {
    setIsFormOpen(false)
    setEditingTodo(null)
    setFormError('')
    reset()
  }

  const onSubmit = async (values: FieldValues) => {
    const name = String(values.name).trim()
    const description = String(values.description).trim()
    const fileList = values.images as FileList | undefined
    const images = fileList ? Array.from(fileList) : []

    setFormError('')

    try {
      if (editingTodo === null) {
        await addData({
          name,
          description,
          images,
        })
      } else {
        await editData({
          id: editingTodo.id,
          name,
          description,
        })
      }

      closeFormModal()
    } catch {
      setFormError('Action failed')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTodo) {
      return
    }

    await deleteData(deleteTodo.id)
    setDeleteTodo(null)
  }

  const nameError = errors.name?.message
  const descriptionError = errors.description?.message
  const imagesError = errors.images?.message

  return (
    <main className="min-h-screen bg-[#09090b] p-5 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-zinc-800 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,_#18181b,_#09090b)] p-8 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
                Task Manager
              </p>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Records
              </h1>
              <p className="mt-4 max-w-2xl text-zinc-400">
                Create, update and remove records from one clean table.
              </p>
            </div>

            <button
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-zinc-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
              type="button"
              onClick={openAddModal}
            >
              Add Record
            </button>
          </div>
        </section>

        {error && (
          <p className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <section className="overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-5">
            <div>
              <h2 className="text-2xl font-black">Records</h2>
              <p className="text-sm text-zinc-400">Total: {data.length}</p>
            </div>
            {isLoading && (
              <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                Loading...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-black text-xs uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Images</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {data.map((todo) => (
                  <tr
                    className="transition hover:bg-zinc-900"
                    key={todo.id}
                  >
                    <td className="px-5 py-4 text-sm font-black text-zinc-500">
                      #{todo.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-black text-zinc-100">{todo.name}</p>
                    </td>
                    <td className="max-w-md px-5 py-4 text-sm text-zinc-400">
                      {todo.description}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-black text-cyan-300">
                        {todo.images.length}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-zinc-800"
                          type="button"
                          onClick={() => openEditModal(todo)}
                        >
                          Edit
                        </button>

                        <button
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                          type="button"
                          onClick={() => setDeleteTodo(todo)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {data.length === 0 && !isLoading && (
                  <tr>
                    <td
                      className="px-5 py-16 text-center text-zinc-500"
                      colSpan={5}
                    >
                      No records yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsFormOpen(true)
          } else {
            closeFormModal()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTodo === null ? 'Add Record' : 'Edit Record'}
            </DialogTitle>
            <DialogDescription>
              {editingTodo === null
                ? 'Fill in the fields and attach an image.'
                : 'Update the fields and save your changes.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">
              Name
            </label>
            <input
              className="mb-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              placeholder="Enter name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {typeof nameError === 'string' && (
              <p className="mb-4 text-sm text-red-300">{nameError}</p>
            )}

            <label className="mb-2 mt-4 block text-sm font-semibold text-zinc-300">
              Description
            </label>
            <textarea
              className="mb-2 min-h-28 w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              placeholder="Enter description"
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 3,
                  message: 'Description must be at least 3 characters',
                },
              })}
            />
            {typeof descriptionError === 'string' && (
              <p className="mb-4 text-sm text-red-300">{descriptionError}</p>
            )}

            {editingTodo === null && (
              <>
                <label className="mb-2 mt-4 block text-sm font-semibold text-zinc-300">
                  Image
                </label>
                <input
                  className="mb-2 w-full rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-400/5 p-3 text-sm text-zinc-300 file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-bold file:text-zinc-950"
                  type="file"
                  multiple
                  {...register('images', {
                    validate: (files: FileList) =>
                      files.length > 0 || 'Image is required for add',
                  })}
                />
                {typeof imagesError === 'string' && (
                  <p className="mb-4 text-sm text-red-300">{imagesError}</p>
                )}
              </>
            )}

            {formError && (
              <p className="mt-4 text-sm text-red-300">{formError}</p>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <button
                  className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold text-zinc-200 transition hover:bg-zinc-800"
                  type="button"
                  onClick={closeFormModal}
                >
                  Cancel
                </button>
              </DialogClose>
              <button
                className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-zinc-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                type="submit"
              >
                {editingTodo === null ? 'Add' : 'Save'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTodo !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTodo(null)
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Record</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The selected record will be removed.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="font-bold text-zinc-100">{deleteTodo?.name}</p>
            <p className="mt-1 text-sm text-zinc-400">
              {deleteTodo?.description}
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button
                className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold text-zinc-200 transition hover:bg-zinc-800"
                type="button"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white transition hover:bg-red-600"
              disabled={isLoading}
              type="button"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default App
