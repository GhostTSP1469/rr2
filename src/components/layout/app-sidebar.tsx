import { navItems } from '../../constants/navigation'

type AppSidebarProps = {
  page: string
  openPage: (page: string) => void
}

export function AppSidebar({ page, openPage }: AppSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] flex-col border-r-2 border-[#d8e3fb] bg-white px-5 py-6 shadow-sm lg:flex">
      <button
        className="mb-10 flex items-center gap-3 text-left"
        type="button"
        onClick={() => openPage('dashboard')}
      >
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#4648d4] text-white shadow-lg shadow-[#4648d4]/20">
          <span className="material-symbols-outlined">account_balance_wallet</span>
        </div>
        <div>
          <p className="text-xl font-bold tracking-[-0.03em]">DebtFlow</p>
          <p className="text-xs font-medium text-slate-400">Personal debt tracker</p>
        </div>
      </button>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            className={`flex w-full items-center gap-4 rounded-[18px] border-r-[7px] px-4 py-4 text-sm font-semibold transition ${
              page === item.key
                ? 'border-r-[#4648d4] bg-[#e7edff] text-[#4648d4] shadow-sm'
                : 'border-r-transparent text-slate-500 hover:border-r-[#d8e3fb] hover:bg-[#f6f8ff] hover:text-slate-900'
            }`}
            key={item.key}
            type="button"
            onClick={() => openPage(item.key)}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-[1.5rem] border border-[#d8e3fb] bg-[#f8f9ff] p-5 text-[#111c2d]">
        <p className="text-sm font-semibold">DebtFlow</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Use the Debts tab to create and manage records.
        </p>
      </div>
    </aside>
  )
}
