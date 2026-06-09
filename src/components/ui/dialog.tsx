import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import {
  addUser,
  deleteUser,
  editUser,
  type AppDispatch,
  type User,
} from '../../store/store'
import './dialog.css'

export type DialogMode = 'add' | 'edit' | 'info' | 'delete'

type DialogProps = {
  isOpen: boolean
  mode: DialogMode
  user: User | null
  onClose: () => void
}

const dialogTitles = {
  add: 'Добавить пользователя',
  edit: 'Редактировать пользователя',
  info: 'Информация о пользователе',
  delete: 'Удалить пользователя',
}

function Dialog({ isOpen, mode, user, onClose }: DialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [description, setDescription] = useState(user?.description ?? '')
  const [status, setStatus] = useState(user?.status ?? true)

  useEffect(() => {
    if (!isOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function saveUser() {
    const formData = {
      name: name.trim(),
      email: email.trim(),
      description: description.trim() || 'Описание не добавлено',
      status,
    }

    if (mode === 'add') {
      dispatch(addUser(formData))
    } else if (user) {
      dispatch(editUser({ id: user.id, changes: formData }))
    }

    onClose()
  }

  function removeUser() {
    if (!user) return

    dispatch(deleteUser(user.id))
    onClose()
  }

  return createPortal(
    <div className="dialog-overlay" onMouseDown={onClose}>
      <section
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog__glow" />

        <header className="dialog__header">
          <div className="dialog__icon">{mode === 'delete' ? '!' : mode === 'info' ? 'i' : '+'}</div>
          <div>
            <span>Local Redux store</span>
            <h2 id="dialog-title">{dialogTitles[mode]}</h2>
            <p>
              {mode === 'delete'
                ? 'Пользователь будет удалён из локального состояния.'
                : 'Изменения выполняются через actions и reducers Redux Toolkit.'}
            </p>
          </div>
          <button
            className="dialog__close"
            type="button"
            aria-label="Закрыть модальное окно"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        {mode === 'info' && user && (
          <div className="dialog__info">
            <div className="dialog__avatar">{user.name.charAt(0)}</div>
            <h3>{user.name}</h3>
            <a href={`mailto:${user.email}`}>{user.email}</a>
            <p>{user.description}</p>
            <span className={user.status ? 'is-active' : 'is-inactive'}>
              {user.status ? 'Активен' : 'Неактивен'}
            </span>
            <footer className="dialog__footer">
              <button className="dialog__submit" type="button" onClick={onClose}>
                Готово
              </button>
            </footer>
          </div>
        )}

        {mode === 'delete' && user && (
          <div className="dialog__delete">
            <strong>Удалить {user.name}?</strong>
            <p>Пользователь исчезнет из локального Redux store.</p>
            <footer className="dialog__footer">
              <button className="dialog__cancel" type="button" onClick={onClose}>
                Отмена
              </button>
              <button className="dialog__danger" type="button" onClick={removeUser}>
                Удалить
              </button>
            </footer>
          </div>
        )}

        {(mode === 'add' || mode === 'edit') && (
          <form
            className="dialog__form"
            onSubmit={(event) => {
              event.preventDefault()
              saveUser()
            }}
          >
            <label>
              <span>Имя</span>
              <input
                autoFocus
                required
                value={name}
                placeholder="Например, Alex Johnson"
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label>
              <span>Email</span>
              <input
                required
                type="email"
                value={email}
                placeholder="alex@example.com"
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              <span>Описание</span>
              <textarea
                rows={4}
                value={description}
                placeholder="Несколько слов о пользователе..."
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>

            <label>
              <span>Статус</span>
              <select value={String(status)} onChange={(event) => setStatus(event.target.value === 'true')}>
                <option value="true">Активен</option>
                <option value="false">Неактивен</option>
              </select>
            </label>

            <footer className="dialog__footer">
              <button className="dialog__cancel" type="button" onClick={onClose}>
                Отмена
              </button>
              <button className="dialog__submit" type="submit">
                {mode === 'add' ? 'Добавить' : 'Сохранить'}
                <span>→</span>
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>,
    document.body,
  )
}

export default Dialog
