import React from 'react';

// AI dev note: Header simplificado do dashboard
// Mostra apenas o título da página atual

interface DashboardHeaderProps {
  title?: string;
}

export const DashboardHeader = ({ title = 'Dashboard' }: DashboardHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
    </header>
  );
};