import * as RxSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SelectProps {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
  ariaLabel?: string;
  prefix?: ReactNode;
}

export function Select({ value, onValueChange, options, placeholder, className, size = 'md', ariaLabel, prefix }: SelectProps) {
  return (
    <RxSelect.Root value={value} onValueChange={onValueChange}>
      <RxSelect.Trigger
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center justify-between gap-2 rounded-md border border-ink-200 bg-surface-0 text-sm text-ink-900 hover:border-ink-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-integrata-500',
          size === 'sm' ? 'h-8 px-2.5' : 'h-10 px-3',
          className,
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {prefix}
          <RxSelect.Value placeholder={placeholder} />
        </span>
        <RxSelect.Icon>
          <ChevronDown className="h-4 w-4 text-ink-500" />
        </RxSelect.Icon>
      </RxSelect.Trigger>
      <RxSelect.Portal>
        <RxSelect.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-ink-200 bg-surface-0 shadow-card-hover"
        >
          <RxSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RxSelect.Item
                key={opt.value}
                value={opt.value}
                className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 pr-8 text-sm text-ink-800 outline-none data-[highlighted]:bg-integrata-100 data-[highlighted]:text-integrata-900 data-[state=checked]:font-medium"
              >
                <RxSelect.ItemText>{opt.label}</RxSelect.ItemText>
                <RxSelect.ItemIndicator className="absolute right-2 inline-flex">
                  <Check className="h-4 w-4 text-integrata-700" />
                </RxSelect.ItemIndicator>
              </RxSelect.Item>
            ))}
          </RxSelect.Viewport>
        </RxSelect.Content>
      </RxSelect.Portal>
    </RxSelect.Root>
  );
}
