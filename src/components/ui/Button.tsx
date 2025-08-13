import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: 'bg-[var(--color-accent)] text-black hover:bg-cyan-300',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border bg-transparent hover:bg-white/10',
  secondary: 'bg-white/10 text-white hover:bg-white/20',
  ghost: 'hover:bg-white/10',
  link: 'underline underline-offset-4',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3 rounded-md',
  lg: 'h-10 px-6 rounded-md',
  icon: 'h-9 w-9 p-0',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: false
}

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none',
        'focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...props}
    />
  )
}


