import { navItems } from '../../constants/navigation'

type MobileNavProps = {
  page: string
  openPage: (page: string) => void
}

export function MobileNav({ page, openPage }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-2 bottom-2 z-30 grid grid-cols-5 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-1.5 shadow-[var(--shadow-md)] backdrop-blur-xl lg:hidden">
      {navItems.map((item) => (
        <button
          className={`flex min-w-0 flex-col items-center rounded-xl px-1 py-2 text-[10px] font-bold transition ${
            page === item.key ? 'bg-[var(--primary-soft)] text-[var(--primary-text)]' : 'text-[var(--muted)]'
          }`}
          key={item.key}
          type="button"
          onClick={() => openPage(item.key)}
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          <span className="mt-0.5 truncate">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
