import React, { useState } from 'react';
import { Phone, Mail, Clock, Target, MessageCircle, MoreVertical, X } from 'lucide-react';
import { Card, CardContent, Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
import { KanbanClient } from '@/types/kanban';
import { URGENCIA_CONFIG } from '@/lib/kanbanConfig';
import { cn } from '@/lib/utils';
import { useHistory } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

// AI dev note: Card individual de cliente no Kanban
// Mostra informações essenciais e status de urgência

interface ClientCardProps {
  client: KanbanClient;
  isDragging?: boolean;
  onClick?: () => void;
  onClientUpdate?: () => void; // Callback para recarregar dados
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  isDragging = false,
  onClick: _onClick,
  onClientUpdate
}) => {
  const history = useHistory();
  const urgenciaConfig = URGENCIA_CONFIG[client.urgencia || 'baixa'];
  const [showMenu, setShowMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleCardClick = () => {
    // Adicionar parâmetro para indicar que veio do Kanban
    history.push(`/clientes/${client.id}?from=kanban`);
  };

  const handleMarkAsLost = async () => {
    if (!window.confirm(`Tem certeza que deseja marcar "${client.nome}" como lead perdido?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('clientes')
        .update({ 
          status_funil: 'PERDIDO',
          updated_at: new Date().toISOString()
        })
        .eq('id', client.id);

      if (error) {
        throw error;
      }

      setShowMenu(false);
      onClientUpdate?.(); // Recarregar dados do Kanban
      
    } catch (error) {
      alert('Erro ao marcar cliente como perdido. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
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

  // Fechar menu ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-700",
        "bg-gray-800 hover:bg-gray-750",
        isDragging && "opacity-50 rotate-2 shadow-2xl",
        urgenciaConfig.color === 'bg-red-500' && "ring-1 ring-red-500/30",
        isUpdating && "opacity-75 pointer-events-none"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header com avatar, nome e urgência */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Avatar className="w-8 h-8 shrink-0">
              {client.profilePicUrl && (
                <AvatarImage 
                  src={client.profilePicUrl} 
                  alt={client.nome}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-medium">
                {client.nome.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
          </div>
          
          {/* Badge de urgência e menu */}
          <div className="flex items-center gap-1">
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium shrink-0",
              urgenciaConfig.color,
              urgenciaConfig.textColor
            )}>
              {client.tempoNaEtapa || 0}d
            </div>
            
            {/* Menu dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                disabled={isUpdating}
              >
                <MoreVertical className="w-3 h-3 text-gray-400" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 min-w-[150px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsLost();
                    }}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <X className="w-3 h-3" />
                    Marcar como Perdido
                  </button>
                </div>
              )}
            </div>
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
