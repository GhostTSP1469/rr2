import { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'outline' | 'danger' | 'dark' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
}

const variants = {
  primary:
    'bg-[#4648d4] text-white shadow-lg shadow-[#4648d4]/15 hover:-translate-y-0.5 hover:bg-[#3f41c6]',
  outline:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-950',
  danger:
    'border border-red-100 bg-white text-red-600 shadow-sm hover:-translate-y-0.5 hover:bg-red-50',
  dark:
    'bg-[#111c2d] text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-[#1e293b]',
  ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
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
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4648d4]/15 disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  )
}
