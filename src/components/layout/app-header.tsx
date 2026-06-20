import { User } from '../../store/authStore'
import { Button } from '../ui/button'

type AppHeaderProps = {
  page: string
  user: User | null
  search: string
  setSearch: (value: string) => void
  getAllData: () => void
}

const getTitle = (page: string) => {
  if (page === 'debts') {
    return 'Manage Debts'
  }

  if (page === 'contacts') {
    return 'Contacts'
  }

  if (page === 'folders') {
    return 'Folders'
  }

  if (page === 'profile') {
    return 'Profile'
  }

  if (page === 'detail') {
    return 'Debt details'
  }

  return 'Financial overview'
}

export function AppHeader({ page, user, search, setSearch, getAllData }: AppHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Hello, {user?.name || 'friend'}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em]">
          {getTitle(page)}
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex min-w-0 w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-400">
          <span className="material-symbols-outlined text-[20px]">search</span>
          <input
            className="w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Search contacts, debts..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <Button
          className="w-full sm:w-auto"
          variant="outline"
          onClick={() => {
            void getAllData()
          }}
        >
          Refresh
        </Button>
      </div>
    </header>
  )
}
