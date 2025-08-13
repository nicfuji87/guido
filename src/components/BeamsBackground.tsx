import React from 'react'

export interface BeamsBackgroundProps {
  className?: string
  intensity?: 'subtle' | 'bold'
}

export const BeamsBackground: React.FC<BeamsBackgroundProps> = ({ className = '', intensity = 'subtle' }) => {
  const opacity = intensity === 'bold' ? 0.18 : 0.10
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
      style={{
        background:
          `
          radial-gradient(800px 400px at 85% 20%, rgba(0,246,255,${opacity}), transparent 60%),
          radial-gradient(600px 300px at 15% 25%, rgba(255,255,255,${opacity * 0.8}), transparent 60%),
          radial-gradient(900px 450px at 50% 80%, rgba(0,246,255,${opacity * 0.6}), transparent 70%)
        `,
        maskImage:
          'radial-gradient(1200px 600px at 50% 20%, rgba(0,0,0,0.9), transparent), linear-gradient(#000, #000)',
        WebkitMaskImage:
          'radial-gradient(1200px 600px at 50% 20%, rgba(0,0,0,0.9), transparent), linear-gradient(#000, #000)',
        backgroundColor: '#0D1117',
      }}
    />
  )
}



