import React from 'react';
import { cn } from '@/lib/utils';

// AI dev note: Componente de loading moderno e elegante para o dashboard
// Com skeleton cards que seguem o layout real dos widgets

interface LoadingCardProps {
  className?: string;
}

const LoadingCard = ({ className }: LoadingCardProps) => (
  <div className={cn(
    "bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4 animate-pulse", 
    className
  )}>
    <div className="flex items-center justify-between">
      <div className="h-6 bg-gray-200 rounded-lg w-32"></div>
      <div className="h-5 w-5 bg-gray-200 rounded"></div>
    </div>
    
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      <div className="h-4 bg-gray-200 rounded w-3/5"></div>
    </div>
    
    <div className="flex justify-between items-center pt-2">
      <div className="h-3 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
    </div>
  </div>
);

const LoadingMetricsCard = ({ className }: LoadingCardProps) => (
  <div className={cn(
    "bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 animate-pulse",
    className
  )}>
    <div className="h-6 bg-gray-200 rounded-lg w-40"></div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center space-y-2">
          <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

interface LoadingDashboardProps {
  message?: string;
}

export const LoadingDashboard = ({ message = "Carregando seus dados..." }: LoadingDashboardProps) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Barra de progresso sutil no topo */}
      <div className="w-full h-1 bg-gray-200 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse w-1/3 rounded-r-full"></div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header de loading */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">{message}</span>
          </div>
        </div>

        {/* Layout dos widgets em skeleton */}
        <div className="grid gap-6">
          {/* Primeira linha - Widgets principais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LoadingCard className="lg:col-span-2" />
            <LoadingCard />
          </div>
          
          {/* Segunda linha - Métricas */}
          <LoadingMetricsCard className="col-span-full" />
          
          {/* Terceira linha - Widgets secundários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LoadingCard />
            <LoadingCard />
          </div>
        </div>

        {/* Indicador central discreto */}
        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600 font-medium">
              Preparando seu dashboard personalizado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
