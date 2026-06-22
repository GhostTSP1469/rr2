import { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'outline' | 'danger' | 'dark' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
}

const variants = {
  primary:
    'bg-[var(--primary)] text-white shadow-[0_8px_22px_color-mix(in_srgb,var(--primary)_22%,transparent)] hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]',
  outline:
    'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-soft)] shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]',
  danger:
    'border border-transparent bg-[var(--danger-soft)] text-[var(--danger)] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--danger)_20%,transparent)]',
  dark:
    'bg-[var(--text)] text-[var(--app-bg)] shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:opacity-90',
  ghost: 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]',
}

const sizes = {
  default: 'h-11 px-5 py-3',
  sm: 'h-9 px-4 py-2 text-sm',
  icon: 'h-9 w-9 p-0',
}

export function Button({
  className,
  variant = 'primary',
  size = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[0.85rem] text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5557d9]/20 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  )
}
