type LogoutToastProps = {
  open: boolean
  count: number
  onClose: () => void
}

export function LogoutToast({ open, count, onClose }: LogoutToastProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl shadow-slate-900/15">
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <p className="font-semibold text-emerald-700">Logged out</p>
          <p className="mt-1 text-sm text-slate-500">Session closed successfully.</p>
        </div>
        <button
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          type="button"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <div className="h-1 bg-emerald-50">
        <div className="logout-progress h-full bg-emerald-500" key={count} />
      </div>
    </div>
  )
}
