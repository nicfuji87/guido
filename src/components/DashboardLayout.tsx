import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui';
import { AppSidebar } from './AppSidebar';
import { DashboardHeader } from './DashboardHeader';
import { ViewContextProvider } from '@/hooks/useViewContext';
import { WhatsAppConnectionBanner } from './WhatsAppConnectionBanner';
import { OnboardingModal } from './OnboardingModal';

// AI dev note: Layout principal do dashboard
// Combina sidebar, header e área de conteúdo em uma estrutura responsiva
// Sidebar inicia fechada em mobile e aberta em desktop
// AGORA com banner de conexão WhatsApp e modal de onboarding

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <ViewContextProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          {/* Sidebar */}
          <AppSidebar />
          
          {/* Área principal */}
          <SidebarInset className="flex flex-col w-full">
            {/* Banner WhatsApp (se desconectado) */}
            <WhatsAppConnectionBanner />
            
            {/* Header */}
            <DashboardHeader title={title} />
            
            {/* Conteúdo */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </div>

        {/* Modal de Onboarding (primeiro acesso) */}
        <OnboardingModal />
      </SidebarProvider>
    </ViewContextProvider>
  );
};

