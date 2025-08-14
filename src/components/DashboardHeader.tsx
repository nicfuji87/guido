import React from 'react';
import { UpdateConversationsButton } from './UpdateConversationsButton';

// AI dev note: Header simplificado do dashboard
// Mostra o título da página atual e botão de atualizar conversas quando relevante

interface DashboardHeaderProps {
  title?: string;
}

export const DashboardHeader = ({ title = 'Dashboard' }: DashboardHeaderProps) => {
  // Mostrar botão de atualizar conversas nas páginas relevantes
  const shouldShowUpdateButton = [
    'Dashboard',
    'Conversas', 
    'Clientes'
  ].includes(title);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      {shouldShowUpdateButton && (
        <div className="flex items-center gap-2">
          <UpdateConversationsButton />
        </div>
      )}
    </header>
  );
};