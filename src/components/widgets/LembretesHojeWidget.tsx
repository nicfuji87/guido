import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Plus, User, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Skeleton } from '@/components/ui';
import { LembreteHoje } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

// AI dev note: Widget para lembretes dos próximos dias (não só hoje)
// Mostra máximo 5 lembretes com botão "Ver mais"

interface LembretesHojeWidgetProps {
  lembretes: LembreteHoje[];
  isLoading?: boolean;
  onToggleComplete?: (lembreteId: string, completed: boolean) => void;
  onCreateReminder?: () => void;
  onViewMore?: () => void;
}

const ReminderItem = ({ 
  lembrete, 
  onToggle 
}: { 
  lembrete: LembreteHoje; 
  onToggle?: (id: string, completed: boolean) => void;
}) => {
  const [isCompleted, setIsCompleted] = useState(lembrete.status === 'CONCLUIDO');
  
  const handleToggle = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    onToggle?.(lembrete.id, newStatus);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const reminderDate = new Date(date);
    reminderDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((reminderDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let dateText = '';
    if (diffDays === 0) {
      dateText = 'Hoje';
    } else if (diffDays === 1) {
      dateText = 'Amanhã';
    } else if (diffDays === -1) {
      dateText = 'Ontem';
    } else if (diffDays > 0) {
      dateText = `+${diffDays}d`;
    } else {
      dateText = `${diffDays}d`;
    }
    
    const timeText = date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `${dateText} ${timeText}`;
  };

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg border transition-all',
      'hover:bg-muted/50 cursor-pointer',
      isCompleted && 'opacity-60 bg-muted/20'
    )}>
      <button
        onClick={handleToggle}
        className="shrink-0 mt-0.5 hover:scale-105 transition-transform"
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className={cn(
            'font-medium text-sm',
            isCompleted && 'line-through text-muted-foreground'
          )}>
            {lembrete.descricao}
          </p>
          <Badge variant="outline" className="text-xs shrink-0">
            {formatDateTime(lembrete.data_lembrete)}
          </Badge>
        </div>
        
        {lembrete.cliente && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{lembrete.cliente.nome}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-start gap-3 p-3">
        <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

export const LembretesHojeWidget = ({ 
  lembretes, 
  isLoading, 
  onToggleComplete,
  onCreateReminder,
  onViewMore
}: LembretesHojeWidgetProps) => {
  const pendingCount = lembretes.filter(l => l.status === 'PENDENTE').length;
  const completedCount = lembretes.filter(l => l.status === 'CONCLUIDO').length;
  const completionRate = lembretes.length > 0 ? (completedCount / lembretes.length) * 100 : 0;

  // Limitar a 5 lembretes para exibição
  const MAX_DISPLAY_ITEMS = 5;
  const displayLembretes = lembretes.slice(0, MAX_DISPLAY_ITEMS);
  const hasMoreItems = lembretes.length > MAX_DISPLAY_ITEMS;

  // Separar lembretes por status (apenas os que serão exibidos)
  const pendingReminders = displayLembretes.filter(l => l.status === 'PENDENTE');
  const completedReminders = displayLembretes.filter(l => l.status === 'CONCLUIDO');

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Lembretes Próximos</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCreateReminder}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Novo
          </Button>
        </div>
        
        <CardDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {lembretes.length === 0 ? 
              'Nenhum lembrete próximo' :
              `${pendingCount} ${pendingCount === 1 ? 'pendente' : 'pendentes'} de ${lembretes.length}`
            }
            {hasMoreItems && (
              <span className="text-xs text-muted-foreground">
                (mostrando {MAX_DISPLAY_ITEMS})
              </span>
            )}
          </div>
          {lembretes.length > 0 && (
            <Badge variant={completionRate === 100 ? 'default' : 'secondary'}>
              {Math.round(completionRate)}% completo
            </Badge>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <LoadingSkeleton />
        ) : lembretes.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground mb-2">
              Nenhum lembrete próximo
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Crie lembretes para não esquecer tarefas importantes
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCreateReminder}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar Primeiro Lembrete
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {/* Lembretes pendentes */}
            {pendingReminders.length > 0 && (
              <div className="space-y-2">
                {pendingReminders.map((lembrete) => (
                  <ReminderItem
                    key={lembrete.id}
                    lembrete={lembrete}
                    onToggle={onToggleComplete}
                  />
                ))}
              </div>
            )}

            {/* Lembretes concluídos */}
            {completedReminders.length > 0 && (
              <div className="space-y-2">
                {pendingReminders.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">Concluídos</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
                {completedReminders.map((lembrete) => (
                  <ReminderItem
                    key={lembrete.id}
                    lembrete={lembrete}
                    onToggle={onToggleComplete}
                  />
                ))}
              </div>
            )}

            {/* Botão Ver mais */}
            {hasMoreItems && (
              <div className="pt-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onViewMore}
                  className="w-full gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="h-4 w-4" />
                  Ver mais {lembretes.length - MAX_DISPLAY_ITEMS} lembrete{lembretes.length - MAX_DISPLAY_ITEMS !== 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Progress bar */}
        {lembretes.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso geral</span>
              <span className="font-medium">{completedCount}/{lembretes.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-all duration-500',
                  completionRate === 100 ? 'bg-green-500' : 
                  completionRate >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                )}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

