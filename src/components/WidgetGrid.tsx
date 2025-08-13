import React from 'react';
import { cn } from '@/lib/utils';

// AI dev note: Grid responsivo para widgets do dashboard
// Layout adapta baseado no tipo de usuário e quantidade de widgets

interface Widget {
  id: string;
  component: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  size: 'sm' | 'md' | 'lg' | 'xl';
  visible?: boolean;
}

interface WidgetGridProps {
  widgets: Widget[];
  className?: string;
}

export const WidgetGrid = ({ widgets, className }: WidgetGridProps) => {

  // Filtrar widgets visíveis
  const visibleWidgets = widgets.filter(widget => widget.visible !== false);

  // Separar widgets por prioridade
  const highPriorityWidgets = visibleWidgets.filter(w => w.priority === 'high');
  const mediumPriorityWidgets = visibleWidgets.filter(w => w.priority === 'medium');
  const lowPriorityWidgets = visibleWidgets.filter(w => w.priority === 'low');





  const getWidgetClasses = (size: Widget['size']) => {
    switch (size) {
      case 'sm':
        return 'col-span-1';
      case 'md':
        return 'col-span-1 md:col-span-1';
      case 'lg':
        return 'col-span-1 md:col-span-2';
      case 'xl':
        return 'col-span-1 md:col-span-2 lg:col-span-3';
      default:
        return 'col-span-1';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Widgets de alta prioridade - Layout principal */}
      {highPriorityWidgets.length > 0 && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {highPriorityWidgets.map((widget) => (
            <div 
              key={widget.id} 
              className={cn(
                getWidgetClasses(widget.size),
                'transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg'
              )}
            >
              {widget.component}
            </div>
          ))}
        </div>
      )}

      {/* Widgets de média prioridade - Seção secundária */}
      {mediumPriorityWidgets.length > 0 && (
        <div className="space-y-4">
          {mediumPriorityWidgets.map((widget) => (
            <div 
              key={widget.id} 
              className={cn(
                'transform transition-all duration-200 hover:shadow-lg',
                widget.size === 'xl' ? 'col-span-full' : ''
              )}
            >
              {widget.component}
            </div>
          ))}
        </div>
      )}

      {/* Widgets de baixa prioridade - Layout compacto */}
      {lowPriorityWidgets.length > 0 && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {lowPriorityWidgets.map((widget) => (
            <div 
              key={widget.id} 
              className="transform transition-all duration-200 hover:shadow-md"
            >
              {widget.component}
            </div>
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {visibleWidgets.length === 0 && (
        <div className="flex items-center justify-center h-64 text-center bg-white rounded-xl border border-gray-200">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Carregando dashboard...</p>
              <p className="text-sm text-gray-500 mt-1">
                Aguarde enquanto preparamos seus dados.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

