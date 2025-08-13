import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { DashboardContent } from './DashboardContent';

// AI dev note: Template completo da página de dashboard
// Combina layout e conteúdo em uma única página

export const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

