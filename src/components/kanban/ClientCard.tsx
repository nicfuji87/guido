import React from 'react';
import { Phone, Mail, Clock, Target, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { KanbanClient } from '@/types/kanban';
import { URGENCIA_CONFIG } from '@/lib/kanbanConfig';
import { cn } from '@/lib/utils';
import { useHistory } from 'react-router-dom';

// AI dev note: Card individual de cliente no Kanban
// Mostra informações essenciais e status de urgência

interface ClientCardProps {
  client: KanbanClient;
  isDragging?: boolean;
  onClick?: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  isDragging = false,
  onClick: _onClick
}) => {
  const history = useHistory();
  const urgenciaConfig = URGENCIA_CONFIG[client.urgencia || 'baixa'];
  
  const handleCardClick = () => {
    // Adicionar parâmetro para indicar que veio do Kanban
    history.push(`/clientes/${client.id}?from=kanban`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-700",
        "bg-gray-800 hover:bg-gray-750",
        isDragging && "opacity-50 rotate-2 shadow-2xl",
        urgenciaConfig.color === 'bg-red-500' && "ring-1 ring-red-500/30"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header com nome e urgência */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white text-sm truncate">
              {client.nome}
            </h3>
            {client.telefone && (
              <div className="flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400 truncate">
                  {client.telefone}
                </span>
              </div>
            )}
          </div>
          
          {/* Badge de urgência */}
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2",
            urgenciaConfig.color,
            urgenciaConfig.textColor
          )}>
            {client.tempoNaEtapa || 0}d
          </div>
        </div>

        {/* Próxima ação */}
        {client.proximaAcao && (
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="text-xs text-gray-300 truncate">
              {client.proximaAcao}
            </span>
          </div>
        )}

        {/* Footer com último contato e ações */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">
              {formatDate(client.ultimoContato || client.updated_at)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {client.telefone && (
              <button 
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Abrir WhatsApp Web
                  window.open(`https://wa.me/${client.telefone?.replace(/\D/g, '')}`, '_blank');
                }}
                title="Abrir WhatsApp"
              >
                <MessageCircle className="w-3 h-3 text-green-400" />
              </button>
            )}
            
            {client.email && (
              <button 
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`mailto:${client.email}`, '_blank');
                }}
                title="Enviar e-mail"
              >
                <Mail className="w-3 h-3 text-blue-400" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
