import { useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'

type User = {
  id: number
  name: string
  age: string
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Минимум 2 символа')
    .required('Введите имя'),
  age: Yup.number()
    .typeError('Возраст должен быть числом')
    .min(1, 'Минимальный возраст 1')
    .max(120, 'Максимальный возраст 120')
    .required('Введите возраст'),
})

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [editId, setEditId] = useState<number | null>(null)

  const formik = useFormik({
    initialValues: {
      name: '',
      age: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (editId !== null) {
        const editedUsers = users.map((user) =>
          user.id === editId ? { ...user, ...values } : user,
        )

        setUsers(editedUsers)
        setEditId(null)
      } else {
        const newUser = {
          id: Date.now(),
          name: values.name,
          age: values.age,
        }

        setUsers([...users, newUser])
      }

      formik.resetForm()
    },
  })

  const editUser = (user: User) => {
    formik.setValues({
      name: user.name,
      age: user.age,
    })
    setEditId(user.id)
  }

  const deleteUser = (id: number) => {
    const filteredUsers = users.filter((user) => user.id !== id)
    setUsers(filteredUsers)

    if (editId === id) {
      setEditId(null)
      formik.resetForm()
    }
  }

  const cancelEdit = () => {
    setEditId(null)
    formik.resetForm()
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">


        <form
          className="mb-8 rounded-lg bg-white p-5 shadow"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-4">
            <input
              className="w-full rounded border p-3"
              name="name"
              placeholder="Имя"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.name}
              </p>
            )}
          </div>

          <div className="mb-4">
            <input
              className="w-full rounded border p-3"
              name="age"
              placeholder="Возраст"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.age && formik.errors.age && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.age}</p>
            )}
          </div>

          <button
            className="rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
            type="submit"
          >
            {editId !== null ? 'Сохранить' : 'Добавить'}
          </button>

          {editId !== null && (
            <button
              className="ml-2 rounded bg-gray-500 px-5 py-2 text-white"
              type="button"
              onClick={cancelEdit}
            >
              Отмена
            </button>
          )}
        </form>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
              key={user.id}
            >
              <div>
                <h2 className="text-lg font-bold">{user.name}</h2>
                <p>Возраст: {user.age}</p>
              </div>

              <div>
                <button
                  className="mr-2 rounded bg-yellow-500 px-4 py-2 text-white"
                  type="button"
                  onClick={() => editUser(user)}
                >
                  Edit
                </button>
                <button
                  className="rounded bg-red-500 px-4 py-2 text-white"
                  type="button"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
