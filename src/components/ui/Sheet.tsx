import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  side?: 'right' | 'left';
}

export function Sheet({ open, onOpenChange, title, description, children, side = 'right' }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            'fixed top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface-0 shadow-xl outline-none',
            side === 'right' ? 'right-0 border-l border-ink-200' : 'left-0 border-r border-ink-200',
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-ink-200 p-6">
            <div>
              {title && (
                <Dialog.Title className="text-lg font-semibold text-ink-900">{title}</Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-1 text-sm text-ink-500">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="rounded-md p-1 text-ink-500 hover:bg-surface-100 hover:text-ink-900"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
