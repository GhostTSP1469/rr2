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
    return 'text-emerald-700'
  }

  if (balance < 0) {
    return 'text-red-600'
  }

  return 'text-slate-400'
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
  return (
    <article className="overflow-hidden rounded-[1rem] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-1.5" style={{ backgroundColor: cardColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="grid h-11 w-11 place-items-center rounded-xl text-white"
              style={{ backgroundColor: cardColor }}
            >
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">{folder.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {contactsCount} Contacts
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              className="rounded-full text-slate-400"
              size="icon"
              variant="ghost"
              onClick={() => editFolder(folder.id, folder.name, folder.color)}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </Button>
            <Button
              className="rounded-full text-red-500"
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

        <div className="mt-7 border-t border-[#e7eeff] pt-4">
          <p className="text-xs font-semibold text-slate-500">Total Outstanding</p>
          <p className={`mt-2 text-3xl font-bold ${getAmountClass(balance)}`}>
            {amountText}
          </p>
        </div>
      </div>
    </article>
  )
}
