import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

// AI dev note: Componente Sidebar simplificado baseado no shadcn
// Implementação básica para o dashboard do Guido
// Funciona como overlay em mobile e sidebar tradicional em desktop

interface SidebarContextValue {
  expanded: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar deve ser usado dentro de SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const SidebarProvider = ({ children, defaultExpanded = true }: SidebarProviderProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => setExpanded(!expanded);

  return (
    <SidebarContext.Provider value={{ expanded, toggle }}>
      <div className="flex min-h-screen bg-background">
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar = ({ children, className }: SidebarProps) => {
  const { expanded, toggle } = useSidebar();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Backdrop em mobile quando sidebar está aberta */}
      {isMobile && expanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggle}
          aria-label="Fechar menu"
        />
      )}
      
      <aside className={cn(
        'bg-card border-r transition-all duration-300',
        isMobile ? (
          // Mobile: sidebar como drawer overlay
          expanded 
            ? 'fixed inset-y-0 left-0 z-50 w-64 shadow-2xl' 
            : 'fixed inset-y-0 left-0 z-50 -translate-x-full w-64'
        ) : (
          // Desktop: sidebar normal
          expanded ? 'w-64' : 'w-16'
        ),
        className
      )}>
        {children}
      </aside>
    </>
  );
};

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarHeader = ({ children, className }: SidebarHeaderProps) => (
  <div className={cn('p-4 border-b', className)}>
    {children}
  </div>
);

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarContent = ({ children, className }: SidebarContentProps) => (
  <div className={cn('flex-1 p-4', className)}>
    {children}
  </div>
);

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarFooter = ({ children, className }: SidebarFooterProps) => (
  <div className={cn('p-4 border-t', className)}>
    {children}
  </div>
);

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenu = ({ children, className }: SidebarMenuProps) => (
  <nav className={cn('space-y-2', className)}>
    {children}
  </nav>
);

interface SidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenuItem = ({ children, className }: SidebarMenuItemProps) => (
  <div className={cn('', className)}>
    {children}
  </div>
);

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SidebarMenuButtonProps
>(({ 
  children, 
  className, 
  isActive, 
  onClick,
  href,
  ...props
}, ref) => {
  const { expanded } = useSidebar();
  
  const baseClasses = cn(
    'flex items-center gap-3 w-full p-2 rounded-lg transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    isActive && 'bg-accent text-accent-foreground',
    !expanded && 'justify-center',
    className
  );

  if (href) {
    return (
      <a 
        href={href} 
        className={baseClasses}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={baseClasses}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...props}
    >
      {children}
    </button>
  );
});

SidebarMenuButton.displayName = 'SidebarMenuButton';

interface SidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarInset = ({ children, className }: SidebarInsetProps) => (
  <main className={cn('flex-1 flex flex-col', className)}>
    {children}
  </main>
);

