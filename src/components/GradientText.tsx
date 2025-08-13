import React from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: 'primary' | 'secondary' | 'accent'
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  className = '',
  gradient = 'primary'
}) => {
  const gradients = {
    primary: 'bg-gradient-to-r from-[#00F6FF] via-[#0EA5E9] to-[#3B82F6]',
    secondary: 'bg-gradient-to-r from-white via-[#F0F6FC] to-[#E5E7EB]',
    accent: 'bg-gradient-to-r from-[#00F6FF] to-[#06B6D4]'
  }

  return (
    <span
      className={cn(
        'bg-clip-text text-transparent',
        gradients[gradient],
        className
      )}
    >
      {children}
    </span>
  )
}
