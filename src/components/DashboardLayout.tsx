import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui';
import { AppSidebar } from './AppSidebar';
import { DashboardHeader } from './DashboardHeader';
import { ViewContextProvider } from '@/hooks/useViewContext';

// AI dev note: Layout principal do dashboard
// Combina sidebar, header e área de conteúdo em uma estrutura responsiva

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <ViewContextProvider>
      <SidebarProvider defaultExpanded={true}>
        <div className="min-h-screen flex w-full bg-background">
          {/* Sidebar */}
          <AppSidebar />
          
          {/* Área principal */}
          <SidebarInset className="flex flex-col">
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

