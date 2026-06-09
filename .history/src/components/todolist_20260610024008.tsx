import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { type RootState, type User } from '../store/store'
import Dialog, { type DialogMode } from './ui/dialog'
import './todolist.css'

function Todolist() {
  const users = useSelector((state: RootState) => state.users)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>('add')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  function openDialog(mode: DialogMode, user: User | null = null) {
    setDialogMode(mode)
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false)
  }, [])

  return (
    <section className="users-panel">
      <div className="users-panel__header">
        <div>
          <span>Local Redux Toolkit CRUD</span>
          <h2>Пользователи</h2>
          <p>Данные хранятся локально в Redux store до перезагрузки страницы.</p>
        </div>
        <button className="dialog-trigger" type="button" onClick={() => openDialog('add')}>
          <span>+</span>
          Добавить пользователя
        </button>
      </div>

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="users-table__person">
                    <span>{user.name.charAt(0)}</span>
                    <div><strong>{user.name}</strong><small>id: {user.id}</small></div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`users-table__status ${user.status ? 'is-active' : 'is-inactive'}`}>
                    {user.status ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td>
                  <div className="users-table__actions">
                    <button type="button" onClick={() => openDialog('info', user)}>Инфо</button>
                    <button type="button" onClick={() => openDialog('edit', user)}>Изменить</button>
                    <button className="is-danger" type="button" onClick={() => openDialog('delete', user)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <Dialog
          isOpen
          mode={dialogMode}
          user={selectedUser}
          onClose={closeDialog}
        />
      )}
    </section>
  )
}

export default Todolist
