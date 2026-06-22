import { ComponentProps } from 'react'
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog'
import { cn } from '../../lib/utils'

type DialogContentProps = ComponentProps<typeof Content>
type DialogTitleProps = ComponentProps<typeof Title>
type DialogDescriptionProps = ComponentProps<typeof Description>

export const Dialog = Root
export const DialogTrigger = Trigger
export const DialogClose = Close

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <Portal>
      <Overlay className="fixed inset-0 z-40 bg-[#080b12]/60 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-5 text-[var(--text)] shadow-[var(--shadow-lg)] outline-none sm:p-6 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className,
        )}
        {...props}
      >
        {children}
        <Close className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5557d9]/20 sm:right-5 sm:top-5">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </Close>
      </Content>
    </Portal>
  )
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mb-5 pr-10', className)} {...props} />
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <Title className={cn('text-xl font-bold tracking-[-0.025em] text-[var(--text)]', className)} {...props} />
}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return <Description className={cn('mt-1.5 text-sm leading-6 text-[var(--muted)]', className)} {...props} />
}
