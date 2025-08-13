import React from 'react'
import { cn } from '@/lib/utils'

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'blue'
  customSize?: boolean
}

export const GlowCard: React.FC<GlowCardProps> = ({ className, children, glowColor = 'cyan', customSize: _customSize, ...props }) => {
  const color = glowColor === 'blue' ? 'rgba(59,130,246,0.35)' : 'rgba(0,246,255,0.35)'
  return (
    <div className={cn('relative rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm', className)} {...props}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 -z-10 rounded-[22px] blur-xl"
        style={{ background: `radial-gradient(600px 200px at 50% 0%, ${color}, transparent 70%)` }}
      />
      {children}
    </div>
  )
}



