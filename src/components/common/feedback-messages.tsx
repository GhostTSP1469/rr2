type FeedbackMessagesProps = {
  error: string
  message: string
}

export function FeedbackMessages({ error, message }: FeedbackMessagesProps) {
  if (!error && !message) {
    return null
  }

  return (
    <div className="mb-6 grid gap-3 lg:grid-cols-2">
      {error && (
        <p className="rounded-xl border border-[color-mix(in_srgb,var(--danger)_18%,transparent)] bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl border border-[color-mix(in_srgb,var(--success)_18%,transparent)] bg-[var(--success-soft)] px-4 py-3 text-sm font-semibold text-[var(--success)]">
          {message}
        </p>
      )}
    </div>
  )
}
