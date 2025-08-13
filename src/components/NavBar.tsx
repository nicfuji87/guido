import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface NavItem {
  name: string
  href: string
  // Relax icon typing to support lucide-react forwardRef types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any> | React.ForwardRefExoticComponent<any>
  external?: boolean // Para links externos (não scroll interno)
}

export interface NavBarProps {
  items: NavItem[]
  className?: string
  logoSrc?: string
  fixed?: boolean
  showLogin?: boolean // Para mostrar botão de login
}

// Modern/minimal pill navbar with scroll‑spy and animated "lamp" indicator
export function NavBar({ items, className, logoSrc, fixed = true, showLogin = true }: NavBarProps) {
  const [active, setActive] = useState(items[0]?.name || '')
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.5)
      // Scroll spy
      const ids = items.map((i) => i.href.replace('#', ''))
      let current = items[0]?.name || ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= window.innerHeight * 0.5 && r.bottom >= window.innerHeight * 0.5) {
          const m = items.find((i) => i.href === `#${id}`)
          if (m) current = m.name
          break
        }
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  const scrollTo = (href: string, name: string, external = false) => {
    if (external) {
      // Para links externos, redireciona normalmente
      window.location.href = href
      return
    }
    
    setActive(name)
    if (href.charAt(0) === '#') {
      const el = document.querySelector(href)
      if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      aria-label="Primary"
      className={cn(
        fixed ? 'fixed left-1/2 top-0 z-50 -translate-x-1/2 pt-6' : 'relative mx-auto mt-8',
        className,
      )}
    >
      <div
        className={cn(
          'relative flex w-fit items-center rounded-full px-3 py-2 backdrop-blur-xl',
          // Borda transparente + sombras suaves para um look premium
          'border border-transparent bg-white/5 shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.04)]',
          isScrolled ? 'gap-0' : 'gap-1 md:gap-3 md:px-8',
        )}
      >
        {fixed && isScrolled && logoSrc ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            src={logoSrc}
            alt="Guido"
            className="ml-1 mr-2 h-5 w-auto md:h-6"
          />
        ) : null}
        {items.map((item) => {
          const Icon = item.icon
          const isActive = active === item.name
          return (
            <button
              key={item.name}
              onClick={() => scrollTo(item.href, item.name, item.external)}
              className={cn(
                'relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-300 md:px-6 md:py-2',
                'text-white/75 hover:text-white',
                isScrolled && 'px-2',
              )}
            >
              <span
                className={cn(
                  'hidden md:inline',
                  isActive ? 'text-[var(--color-accent)]' : undefined,
                )}
              >
                {item.name}
              </span>
              {isMobile && Icon ? <Icon size={16} strokeWidth={2.5} /> : null}
              {isActive && !item.external && (
                <>
                  {/* active dark pill */}
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 -z-10 rounded-full bg-white/8"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                  {/* neon lamp bar on top */}
                  <motion.div
                    layoutId="nav-lamp-bar"
                    className="absolute -top-2 left-1/2 h-[6px] w-12 -translate-x-1/2 rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(0,246,255,0.9) 0%, rgba(255,255,255,0.95) 50%, rgba(0,246,255,0.9) 100%)',
                      boxShadow:
                        '0 0 10px rgba(0,246,255,0.65), 0 0 18px rgba(0,246,255,0.35), 0 0 26px rgba(0,246,255,0.22)',
                    }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                  {/* glow difuso extra para efeito neon */}
                  <motion.div
                    layoutId="nav-lamp-glow"
                    className="pointer-events-none absolute -top-4 left-1/2 h-10 w-24 -translate-x-1/2 rounded-full blur-2xl"
                    style={{ backgroundColor: 'rgba(0,246,255,0.18)' }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                </>
              )}
            </button>
          )
        })}
        
        {/* Login Button */}
        {showLogin && (
          <button
            onClick={() => scrollTo('/login', 'Login', true)}
            className={cn(
              'relative ml-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 md:px-6 md:py-2',
              'bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent)]/90',
              'shadow-[0_4px_14px_0_rgba(0,246,255,0.39)]',
              isScrolled && 'px-2 md:px-4',
            )}
          >
            <span className="hidden md:inline">Login</span>
            <span className="md:hidden">→</span>
          </button>
        )}
      </div>
    </nav>
  )
}


