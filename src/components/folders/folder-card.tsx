import { Folder } from '../../store/authStore'
import { Button } from '../ui/button'

type FolderCardProps = {
  folder: Folder
  balance: number
  cardColor: string
  contactsCount: number
  icon: string
  amountText: string
  editFolder: (id: string, name: string, color: string) => void
  deleteFolder: (id: string) => void
}

const getAmountClass = (balance: number) => {
  if (balance > 0) {
    return 'text-[var(--success)]'
  }

  if (balance < 0) {
    return 'text-[var(--danger)]'
  }

  return 'text-[var(--muted)]'
}

const getSafeColor = (color: string) => {
  const value = color.trim()
  const shortHex = /^#([0-9a-f]{3})$/i.exec(value)
  const longHex = /^#([0-9a-f]{6})$/i.exec(value)
  let hex = ''

  if (shortHex) {
    const part = shortHex[1]
    hex = `${part[0]}${part[0]}${part[1]}${part[1]}${part[2]}${part[2]}`
  }

  if (longHex) {
    hex = longHex[1]
  }

  if (!hex) {
    return 'var(--primary)'
  }

  const red = parseInt(hex.slice(0, 2), 16)
  const green = parseInt(hex.slice(2, 4), 16)
  const blue = parseInt(hex.slice(4, 6), 16)
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000

  if (brightness > 205) {
    return 'var(--muted)'
  }

  return value
}

export function FolderCard({
  folder,
  balance,
  cardColor,
  contactsCount,
  icon,
  amountText,
  editFolder,
  deleteFolder,
}: FolderCardProps) {
  const safeColor = getSafeColor(cardColor)

  return (
    <article className="surface-card group overflow-hidden rounded-2xl transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <div className="h-1" style={{ backgroundColor: safeColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{
                backgroundColor: `color-mix(in srgb, ${safeColor} 16%, transparent)`,
                color: safeColor,
              }}
            >
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight text-[var(--text)]">{folder.name}</h2>
              <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                {contactsCount} Contacts
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              className="rounded-full text-[var(--muted)] opacity-70 group-hover:opacity-100"
              size="icon"
              variant="ghost"
              onClick={() => editFolder(folder.id, folder.name, folder.color)}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </Button>
            <Button
              className="rounded-full text-[var(--danger)] opacity-70 group-hover:opacity-100"
              size="icon"
              variant="ghost"
              onClick={() => {
                void deleteFolder(folder.id)
              }}
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-4">
          <p className="eyebrow !text-[10px]">Total outstanding</p>
          <p className={`mt-2 text-2xl font-bold tracking-[-0.03em] ${getAmountClass(balance)}`}>
            {amountText}
          </p>
        </div>
      </div>
    </article>
  )
}
