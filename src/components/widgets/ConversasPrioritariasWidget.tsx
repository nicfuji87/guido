import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Avatar, AvatarFallback, Skeleton } from '@/components/ui';
import { ConversaPrioritaria } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

// AI dev note: Widget para mostrar conversas que aguardam resposta do corretor
// Priorizado por tempo de espera e urgência

interface ConversasPrioritariasWidgetProps {
  conversas: ConversaPrioritaria[];
  isLoading?: boolean;
  onOpenConversation?: (conversaId: string) => void;
}

const ConversationItem = ({ 
  conversa, 
  onOpen 
}: { 
  conversa: ConversaPrioritaria; 
  onOpen?: (id: string) => void;
}) => {
  const isUrgent = conversa.waitingTime > 24; // Mais de 24 horas
  const isVeryUrgent = conversa.waitingTime > 72; // Mais de 3 dias

  const formatWaitingTime = (hours: number) => {
    if (hours < 1) return 'Agora mesmo';
    if (hours < 24) return `${Math.floor(hours)}h atrás`;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    return `${days}d ${remainingHours}h atrás`;
  };

  const getBadgeVariant = () => {
    if (isVeryUrgent) return 'destructive';
    if (isUrgent) return 'secondary';
    return 'outline';
  };

  return (
    <div 
      className={cn(
        'p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm group',
        'bg-gray-800 hover:bg-gray-700/80 border-gray-700',
        isVeryUrgent && 'border-red-700 bg-red-900/40 hover:bg-red-900/60',
        isUrgent && 'border-amber-700 bg-amber-900/40 hover:bg-amber-900/60'
      )}
      onClick={() => onOpen?.(conversa.id)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-gray-600">
          <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {conversa.cliente.nome.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="font-semibold text-sm text-white truncate">
              {conversa.cliente.nome}
            </h4>
            <Badge 
              variant={getBadgeVariant()} 
              className={cn(
                "text-xs font-medium shrink-0",
                isVeryUrgent && "bg-red-800 text-red-200 border-red-600",
                isUrgent && "bg-amber-800 text-amber-200 border-amber-600",
                !isVeryUrgent && !isUrgent && "bg-gray-700 text-gray-300 border-gray-600"
              )}
            >
              {formatWaitingTime(conversa.waitingTime)}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-300 truncate mb-3 leading-relaxed">
            {conversa.lastMessage}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2.5 h-2.5 rounded-full',
                isVeryUrgent ? 'bg-red-500' : isUrgent ? 'bg-amber-500' : 'bg-green-500'
              )} />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {conversa.plataforma}
              </span>
            </div>
            
            <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-start gap-3 p-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-32" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ConversasPrioritariasWidget = ({ 
  conversas, 
  isLoading, 
  onOpenConversation 
}: ConversasPrioritariasWidgetProps) => {
  const urgentCount = conversas.filter(c => c.waitingTime > 24).length;
  const veryUrgentCount = conversas.filter(c => c.waitingTime > 72).length;

  return (
    <Card className="h-full bg-white border-0 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              veryUrgentCount > 0 ? 'bg-red-900 text-red-400' : 
              urgentCount > 0 ? 'bg-amber-900 text-amber-400' : 'bg-blue-900 text-blue-400'
            )}>
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                Conversas Prioritárias
              </CardTitle>
              <CardDescription className="text-sm text-gray-300 mt-1">
                {conversas.length === 0 ? 
                  'Nenhuma conversa aguardando' :
                  `${conversas.length} ${conversas.length === 1 ? 'conversa aguardando' : 'conversas aguardando'} resposta`
                }
              </CardDescription>
            </div>
          </div>
          
          {(urgentCount > 0 || veryUrgentCount > 0) && (
            <Badge 
              variant={veryUrgentCount > 0 ? 'destructive' : 'secondary'}
              className="px-2 py-1 text-xs font-medium"
            >
              {veryUrgentCount > 0 ? `${veryUrgentCount} críticas` : `${urgentCount} urgentes`}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <LoadingSkeleton />
        ) : conversas.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-lg font-medium text-white mb-2">
              Tudo em dia! 🎉
            </p>
            <p className="text-sm text-gray-300">
              Todas as conversas foram respondidas
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {conversas.map((conversa) => (
              <ConversationItem
                key={conversa.id}
                conversa={conversa}
                onOpen={onOpenConversation}
              />
            ))}
          </div>
        )}

        {conversas.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <Button 
              variant="outline" 
              className="w-full h-10 text-sm font-medium hover:bg-gray-700 border-gray-600 text-gray-300 hover:text-white"
              size="sm"
            >
              Ver Todas as Conversas
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

