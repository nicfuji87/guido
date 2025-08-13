import React, { useEffect, useRef } from 'react'

export interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      // Fallback: mostra conteúdo imediatamente
      if (ref.current) ref.current.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target
            if (!target.classList.contains('visible')) {
              setTimeout(() => target.classList.add('visible'), Math.max(0, delay))
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    const el = ref.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`fade-in-up ${className}`}>
      {children}
    </div>
  )
}


