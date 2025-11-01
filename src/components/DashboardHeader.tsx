import React from 'react';
import { Menu } from 'lucide-react';
import { UpdateConversationsButton } from './UpdateConversationsButton';
import { useSidebar } from '@/components/ui';
import { Button } from '@/components/ui';

// AI dev note: Header simplificado do dashboard
// Mostra o título da página atual e botão de atualizar conversas quando relevante
// Inclui botão hamburger para mobile

interface DashboardHeaderProps {
  title?: string;
}

export const DashboardHeader = ({ title = 'Dashboard' }: DashboardHeaderProps) => {
  const { toggle } = useSidebar();
  
  // Mostrar botão de atualizar conversas nas páginas relevantes
  const shouldShowUpdateButton = [
    'Dashboard',
    'Conversas', 
    'Clientes'
  ].includes(title);

  return (
    <header className="flex h-14 md:h-16 shrink-0 items-center justify-between border-b bg-background px-3 md:px-6 overflow-x-hidden">
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        {/* Botão hamburger visível apenas em mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="lg:hidden p-2 h-9 w-9 hover:bg-accent rounded-lg flex-shrink-0"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className="text-base md:text-xl font-semibold truncate">{title}</h1>
      </div>
      
      {shouldShowUpdateButton && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <UpdateConversationsButton />
        </div>
      )}
    </header>
  );
};