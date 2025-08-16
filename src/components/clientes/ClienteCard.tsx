import React from 'react';
import { useHistory } from 'react-router-dom';
import { Phone, MessageCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ClienteWithConversa } from '@/hooks/useClientesData';

// AI dev note: Card individual do cliente na listagem
// Mostra informações principais e permite navegar para detalhamento

interface ClienteCardProps {
  cliente: ClienteWithConversa;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'NOVO_LEAD':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'CONTATO_INICIAL':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'INTERESSE_GERADO':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'VISITA_AGENDADA':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'PROPOSTA_ENVIADA':
      return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    case 'FECHAMENTO':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'PERDIDO':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const getSentimentColor = (sentiment?: string) => {
  switch (sentiment) {
    case 'MUITO_POSITIVO':
      return 'text-green-400';
    case 'POSITIVO':
      return 'text-emerald-400';
    case 'NEUTRO':
      return 'text-yellow-400';
    case 'NEGATIVO':
      return 'text-orange-400';
    case 'MUITO_NEGATIVO':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

const formatStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'NOVO_LEAD': 'Novo Lead',
    'CONTATO_INICIAL': 'Contato Inicial',
    'INTERESSE_GERADO': 'Interesse Gerado',
    'VISITA_AGENDADA': 'Visita Agendada',
    'PROPOSTA_ENVIADA': 'Proposta Enviada',
    'FECHAMENTO': 'Fechamento',
    'PERDIDO': 'Lead Perdido'
  };
  return statusMap[status] || status;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Não informado';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  
  return date.toLocaleDateString('pt-BR');
};

export const ClienteCard: React.FC<ClienteCardProps> = ({ cliente }) => {
  const history = useHistory();

  const handleCardClick = () => {
    history.push(`/clientes/${cliente.id}`);
  };

  const conversa = cliente.conversa;

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:bg-gray-800/50 hover:border-gray-600 bg-gray-900/50 border-gray-700"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-gray-600/50">
              {cliente.profilePicUrl && (
                <AvatarImage 
                  src={cliente.profilePicUrl} 
                  alt={cliente.nome}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                {cliente.nome.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-white">{cliente.nome}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                {cliente.telefone}
              </div>
            </div>
          </div>
          
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border",
            getStatusColor(cliente.status_funil)
          )}>
            {formatStatusText(cliente.status_funil)}
          </div>
        </div>

        {conversa && (
          <div className="space-y-3">
            {/* Resumo da conversa */}
            {conversa.resumo_gerado && (
              <p className="text-sm text-gray-300 line-clamp-2">
                {conversa.resumo_gerado}
              </p>
            )}

            {/* Métricas da conversa */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                {/* Plataforma */}
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {conversa.plataforma}
                </div>
                
                {/* Total de mensagens */}
                {conversa.total_mensagens && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {conversa.total_mensagens} msgs
                  </div>
                )}
                
                {/* Última interação */}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(conversa.timestamp_ultima_mensagem)}
                </div>
              </div>

              {/* Sentimento */}
              {conversa.sentimento_geral && (
                <div className={cn(
                  "font-medium",
                  getSentimentColor(conversa.sentimento_geral)
                )}>
                  {conversa.sentimento_geral}
                </div>
              )}
            </div>

            {/* Orçamento */}
            {conversa.inteligencia_budget_declarado && (
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <DollarSign className="w-3 h-3" />
                {conversa.inteligencia_budget_declarado}
              </div>
            )}

            {/* Tags */}
            {conversa.tags_conversa && conversa.tags_conversa.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {conversa.tags_conversa.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {conversa.tags_conversa.length > 3 && (
                  <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                    +{conversa.tags_conversa.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Próxima ação */}
            {conversa.proxima_acao_recomendada && (
              <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                <div className="text-xs text-blue-400 font-medium mb-1">Próxima Ação:</div>
                <div className="text-xs text-gray-300">{conversa.proxima_acao_recomendada}</div>
                {conversa.data_limite_proxima_acao && (
                  <div className="text-xs text-gray-400 mt-1">
                    Até: {formatDate(conversa.data_limite_proxima_acao)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!conversa && (
          <div className="text-center py-4 text-gray-500">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma conversa registrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
