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
        <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </p>
      )}
    </div>
  )
}
