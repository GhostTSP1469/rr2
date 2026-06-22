type CardTone = 'neutral' | 'primary' | 'success' | 'warning'

type BalanceCardProps = {
  value: string
}

type MetricCardProps = {
  label: string
  value: string
  icon: string
  tone?: CardTone
  note?: string
}

const getToneClasses = (tone: CardTone) => {
  if (tone === 'primary') {
    return {
      icon: 'bg-[var(--primary-soft)] text-[var(--primary-text)]',
      value: 'text-[var(--primary-text)]',
    }
  }

  if (tone === 'success') {
    return {
      icon: 'bg-[var(--success-soft)] text-[var(--success)]',
      value: 'text-[var(--success)]',
    }
  }

  if (tone === 'warning') {
    return {
      icon: 'bg-[var(--warning-soft)] text-[var(--warning)]',
      value: 'text-[var(--warning)]',
    }
  }

  return {
    icon: 'bg-[var(--surface-muted)] text-[var(--text-soft)]',
    value: 'text-[var(--text)]',
  }
}

export function BalanceCard({ value }: BalanceCardProps) {
  return (
    <article className="surface-card relative overflow-hidden rounded-2xl p-6 sm:p-7 xl:col-span-2">
      <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[var(--primary-soft)] blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Current position</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] text-[var(--text)] sm:text-5xl">
              {value}
            </h2>
          </div>
          <div className="hidden h-12 w-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary-text)] sm:grid">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
          <span className="material-symbols-outlined text-[18px] text-[var(--primary-text)]">info</span>
          Positive balance means more money should return to you.
        </div>
      </div>
    </article>
  )
}

export function MetricCard({ label, value, icon, tone = 'neutral', note }: MetricCardProps) {
  const classes = getToneClasses(tone)

  return (
    <article className="surface-card rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${classes.icon}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <p className="mt-5 text-sm font-semibold text-[var(--muted)]">{label}</p>
      <p className={`mt-1.5 text-3xl font-bold tracking-[-0.04em] ${classes.value}`}>{value}</p>
      {note && <p className="mt-2 text-xs text-[var(--faint)]">{note}</p>}
    </article>
  )
}
