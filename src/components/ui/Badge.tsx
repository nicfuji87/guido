import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-accent)] text-black',
  secondary: 'bg-white/10 text-white',
  destructive: 'bg-red-600 text-white',
  outline: 'border border-white/20 text-white',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium', VARIANT_CLASS[variant], className)}
      {...props}
    />
  )
}


