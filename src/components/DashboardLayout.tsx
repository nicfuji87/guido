import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui';
import { AppSidebar } from './AppSidebar';
import { DashboardHeader } from './DashboardHeader';
import { ViewContextProvider } from '@/hooks/useViewContext';

// AI dev note: Layout principal do dashboard
// Combina sidebar, header e área de conteúdo em uma estrutura responsiva
// Sidebar inicia fechada em mobile e aberta em desktop

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  // Detectar se é mobile e iniciar sidebar fechada
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint do Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <ViewContextProvider>
      <SidebarProvider defaultExpanded={!isMobile}>
        <div className="min-h-screen flex w-full bg-background">
          {/* Sidebar */}
          <AppSidebar />
          
          {/* Área principal */}
          <SidebarInset className="flex flex-col w-full">
            {/* Header */}
            <DashboardHeader title={title} />
            
            {/* Conteúdo */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ViewContextProvider>
  );
};

