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
      <Overlay className="fixed inset-0 z-40 bg-[#111c2d]/40 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className,
        )}
        {...props}
      >
        {children}
        <Close className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4648d4]/15">
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
  return <Title className={cn('text-xl font-bold tracking-[-0.03em]', className)} {...props} />
}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return <Description className={cn('mt-1 text-sm text-slate-500', className)} {...props} />
}
