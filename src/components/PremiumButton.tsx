import React from 'react'
import { cn } from '@/lib/utils'

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  shimmer?: boolean
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  shimmer = false,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out transform'
  
  const variants = {
    primary: [
      'bg-gradient-to-r from-[#00F6FF] to-[#0EA5E9]',
      'text-[#0D1117] rounded-xl',
      'shadow-[0_0_30px_rgba(0,246,255,0.3)]',
      'hover:shadow-[0_0_50px_rgba(0,246,255,0.5)]',
      'hover:scale-105',
      'active:scale-95'
    ],
    secondary: [
      'bg-white/10 border border-white/20 text-white rounded-xl',
      'backdrop-blur-sm',
      'hover:bg-white/15 hover:border-white/30',
      'hover:scale-105',
      'active:scale-95'
    ],
    outline: [
      'border-2 border-[#00F6FF] text-[#00F6FF] rounded-xl',
      'bg-transparent',
      'hover:bg-[#00F6FF]/10',
      'hover:shadow-[0_0_30px_rgba(0,246,255,0.3)]',
      'hover:scale-105',
      'active:scale-95'
    ]
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm sm:px-4',
    md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
    lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg'
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Shimmer effect */}
      {shimmer && (
        <div className="absolute inset-0 -top-1 -bottom-1 rounded-xl opacity-60">
          <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
    </button>
  )
}
