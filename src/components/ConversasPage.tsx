import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { KanbanBoard } from './kanban/KanbanBoard';

// AI dev note: Página principal de Conversas com Kanban
// Integra o funil de vendas no layout do dashboard

export const ConversasPage = () => {
  return (
    <DashboardLayout title="Conversas">
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-black">
        <div className="p-6 h-full">
          <KanbanBoard />
        </div>
      </div>
    </DashboardLayout>
  );
};
