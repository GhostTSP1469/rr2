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
    <div className="fixed bottom-6 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] shadow-[var(--shadow-lg)]">
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <p className="font-bold text-[var(--success)]">Logged out</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Session closed successfully.</p>
        </div>
        <button
          className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          type="button"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <div className="h-1 bg-[var(--success-soft)]">
        <div className="logout-progress h-full bg-[var(--success)]" key={count} />
      </div>
    </div>
  )
}
