import React, { useState } from 'react';
import { MessageCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Avatar, AvatarImage, AvatarFallback, Skeleton } from '@/components/ui';
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
    if (hours < 1) {
      const minutes = Math.floor((Date.now() - new Date(conversa.timestamp_ultima_mensagem).getTime()) / (1000 * 60));
      if (minutes < 1) return 'Agora mesmo';
      return `${minutes}min atrás`;
    }
    if (hours < 24) return `${Math.floor(hours)}h atrás`;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    return `${days}d ${remainingHours}h atrás`;
  };

  const truncateMessage = (message: string, maxLength: number = 120) => {
    if (!message || message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const getBadgeVariant = () => {
    if (isVeryUrgent) return 'destructive';
    if (isUrgent) return 'secondary';
    return 'outline';
  };

  const getPriorityColor = (prioridade?: string) => {
    switch (prioridade?.toUpperCase()) {
      case 'URGENTE': return 'bg-red-500';
      case 'ALTA': return 'bg-orange-500';
      case 'NORMAL': return 'bg-blue-500';
      case 'BAIXA': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentIcon = (sentimento?: string) => {
    if (!sentimento) return null;
    const lower = sentimento.toLowerCase();
    if (lower.includes('positiv') || lower.includes('interesse')) return '😊';
    if (lower.includes('negativ') || lower.includes('irritad') || lower.includes('impacient')) return '😠';
    if (lower.includes('dúvid') || lower.includes('incert')) return '🤔';
    if (lower.includes('neutro') || lower.includes('cordial')) return '😐';
    return '💬';
  };

  return (
    <div 
      className={cn(
        'p-2 sm:p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm group',
        'bg-gray-800 hover:bg-gray-700/80 border-gray-700',
        isVeryUrgent && 'border-red-700 bg-red-900/40 hover:bg-red-900/60',
        isUrgent && 'border-amber-700 bg-amber-900/40 hover:bg-amber-900/60'
      )}
      onClick={() => onOpen?.(conversa.id)}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 ring-2 ring-gray-600">
          {conversa.cliente.profilePicUrl && (
            <AvatarImage 
              src={conversa.cliente.profilePicUrl} 
              alt={conversa.cliente.nome}
              className="object-cover"
            />
          )}
          <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {conversa.cliente.nome.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <h4 className="font-semibold text-xs sm:text-sm text-white truncate">
              {conversa.cliente.nome}
            </h4>
              {conversa.sentimento_geral && (
                <span className="text-xs shrink-0" title={conversa.sentimento_geral}>
                  {getSentimentIcon(conversa.sentimento_geral)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {conversa.prioridade && (
                <div 
                  className={cn('w-2 h-2 rounded-full', getPriorityColor(conversa.prioridade))}
                  title={`Prioridade: ${conversa.prioridade}`}
                />
              )}
            <Badge 
              variant={getBadgeVariant()} 
              className={cn(
                "text-[10px] sm:text-xs font-medium shrink-0 px-1.5 sm:px-2 py-0.5",
                isVeryUrgent && "bg-red-800 text-red-200 border-red-600",
                isUrgent && "bg-amber-800 text-amber-200 border-amber-600",
                !isVeryUrgent && !isUrgent && "bg-gray-700 text-gray-300 border-gray-600"
              )}
            >
              {formatWaitingTime(conversa.waitingTime)}
            </Badge>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3 leading-relaxed" style={{ wordBreak: 'break-word' }}>
            {truncateMessage(conversa.lastMessage, 80)}
          </p>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="flex items-center gap-1">
              <div className={cn(
                'w-2.5 h-2.5 rounded-full',
                isVeryUrgent ? 'bg-red-500' : isUrgent ? 'bg-amber-500' : 'bg-green-500'
              )} />
              <span className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wide">
                {conversa.plataforma}
              </span>
              </div>
              
              {conversa.status_contorno_objecao && conversa.status_contorno_objecao !== '' && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  <span className="text-[10px] sm:text-xs text-yellow-400" title={`Objeção: ${conversa.status_contorno_objecao}`}>
                    Objeção
                  </span>
                </div>
              )}
            </div>
            
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 group-hover:text-gray-300 transition-colors shrink-0" />
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

export const ConversasPrioritariasWidget: React.FC<ConversasPrioritariasWidgetProps> = ({ 
  conversas, 
  isLoading, 
  onOpenConversation 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const urgentCount = conversas.filter(c => c.waitingTime > 24).length;
  const veryUrgentCount = conversas.filter(c => c.waitingTime > 72).length;
  
  const INITIAL_VISIBLE_COUNT = 3;
  const conversasToShow = isExpanded ? conversas : conversas.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMoreConversas = conversas.length > INITIAL_VISIBLE_COUNT;
  const shouldShowButton = conversas.length > 0; // Sempre mostrar se há conversas

  return (
    <Card className="h-full bg-white border-0 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={cn(
            'p-1.5 sm:p-2 rounded-lg shrink-0',
            veryUrgentCount > 0 ? 'bg-red-900 text-red-400' : 
            urgentCount > 0 ? 'bg-amber-900 text-amber-400' : 'bg-blue-900 text-blue-400'
          )}>
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <CardDescription className="text-xs sm:text-sm text-gray-300">
              {conversas.length === 0 ? 
                'Nenhuma conversa aguardando' :
                `${conversas.length} ${conversas.length === 1 ? 'conversa aguardando' : 'conversas aguardando'} resposta`
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
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
          <div className="space-y-2 sm:space-y-3">
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
              {conversasToShow.map((conversa) => (
              <ConversationItem
                key={conversa.id}
                conversa={conversa}
                onOpen={onOpenConversation}
              />
            ))}
          </div>

            {shouldShowButton && (
              <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-700">
            <Button 
              variant="outline" 
                  className="w-full h-8 sm:h-10 text-xs sm:text-sm font-medium hover:bg-gray-700 border-gray-600 text-gray-300 hover:text-white transition-colors"
              size="sm"
                  onClick={() => {
                    if (hasMoreConversas) {
                      setIsExpanded(!isExpanded);
                    } else {
                      // Navegar para página de conversas quando há poucas conversas
                      window.location.href = '/conversations';
                    }
                  }}
                >
                  {hasMoreConversas ? (
                    isExpanded ? (
                      <>
                        Ver Menos
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Ver Todas as Conversas ({conversas.length - INITIAL_VISIBLE_COUNT} mais)
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )
                  ) : (
                    <>
              Ver Todas as Conversas
              <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  )}
            </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

