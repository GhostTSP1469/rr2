import { navItems } from '../../constants/navigation'

type MobileNavProps = {
  page: string
  openPage: (page: string) => void
}

export function MobileNav({ page, openPage }: MobileNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white p-2 pb-4 shadow-[0_-1px_0_rgba(15,23,42,0.05)] lg:hidden">
      {navItems.map((item) => (
        <button
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-[11px] font-semibold ${
            page === item.key ? 'bg-[#e1e0ff] text-[#4648d4]' : 'text-slate-500'
          }`}
          key={item.key}
          type="button"
          onClick={() => openPage(item.key)}
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
}
