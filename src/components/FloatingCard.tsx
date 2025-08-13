import React from 'react'
import { cn } from '@/lib/utils'

interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glowIntensity?: 'low' | 'medium' | 'high'
  hoverEffect?: boolean
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  className = '',
  glowIntensity = 'medium',
  hoverEffect = true,
  ...props
}) => {
  const glowStyles = {
    low: 'shadow-[0_0_20px_rgba(0,246,255,0.1)]',
    medium: 'shadow-[0_0_40px_rgba(0,246,255,0.15)]',
    high: 'shadow-[0_0_60px_rgba(0,246,255,0.2)]'
  }

  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-6 lg:p-8',
        'transition-all duration-500 ease-out',
        glowStyles[glowIntensity],
        ...(hoverEffect ? [
          'hover:border-[#00F6FF]/30',
          'hover:shadow-[0_0_80px_rgba(0,246,255,0.3)]',
          'hover:-translate-y-2',
          'hover:scale-[1.02]'
        ] : []),
        className
      )}
      {...props}
    >
      {/* Animated glow background */}
      <div 
        className={cn(
          'absolute -inset-0.5 rounded-2xl opacity-0 transition-opacity duration-500',
          'bg-gradient-to-r from-[#00F6FF]/20 via-transparent to-[#00F6FF]/20',
          hoverEffect && 'group-hover:opacity-100'
        )}
        style={{
          background: 'linear-gradient(45deg, rgba(0,246,255,0.1), transparent, rgba(0,246,255,0.1))',
          filter: 'blur(10px)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
