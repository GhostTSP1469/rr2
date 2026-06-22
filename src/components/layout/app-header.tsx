import { User } from '../../store/authStore'
import { ThemeToggle } from '../theme/theme-toggle'
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
    <header className="mb-7 flex flex-col gap-5 border-b border-[var(--border)] pb-6 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">Debt workspace</p>
        <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[var(--text)] sm:text-3xl">
          {getTitle(page)}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          Welcome back, {user?.name || 'friend'}.
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center">
        <label className="toolbar-search w-full sm:w-[280px] lg:w-[340px]">
          <span className="material-symbols-outlined text-[20px]">search</span>
          <input
            className="w-full min-w-0 !border-0 !bg-transparent !p-0 text-sm text-[var(--text)] !shadow-none !outline-none focus:!ring-0"
            placeholder="Search anything..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <ThemeToggle />

        <Button
          aria-label="Refresh data"
          className="w-full sm:w-auto"
          variant="outline"
          onClick={() => {
            void getAllData()
          }}
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Refresh
        </Button>
      </div>
    </header>
  )
}
