import { navItems } from '../../constants/navigation'

type AppSidebarProps = {
  page: string
  openPage: (page: string) => void
}

export function AppSidebar({ page, openPage }: AppSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[272px] flex-col border-r border-[var(--border)] bg-[var(--surface)] px-4 py-5 lg:flex">
      <button
        className="mb-9 flex items-center gap-3 rounded-xl px-2 py-1.5 text-left"
        type="button"
        onClick={() => openPage('dashboard')}
      >
        <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-[var(--primary)] text-white shadow-[0_8px_22px_color-mix(in_srgb,var(--primary)_28%,transparent)]">
          <span className="material-symbols-outlined text-[21px]">account_balance_wallet</span>
        </div>
        <div>
          <p className="text-lg font-bold tracking-[-0.025em] text-[var(--text)]">DebtFlow</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--faint)]">Personal finance</p>
        </div>
      </button>

      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--faint)]">Workspace</p>
      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <button
            className={`flex w-full items-center gap-3 rounded-xl border-r-4 px-3.5 py-3 text-sm font-bold transition-all ${
              page === item.key
                ? 'border-r-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-text)]'
                : 'border-r-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]'
            }`}
            key={item.key}
            type="button"
            onClick={() => openPage(item.key)}
          >
            <span className="material-symbols-outlined text-[21px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

    </aside>
  )
}
