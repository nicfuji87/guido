import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, Mail, MessageCircle, Clock, DollarSign, 
  TrendingUp, Calendar, AlertCircle, CheckCircle, XCircle, 
  Target, Brain, Lightbulb
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ClienteWithConversa, useClientesData } from '@/hooks/useClientesData';

// AI dev note: Página de detalhamento completo do cliente
// Mostra todos os dados de IA e análises da conversa

interface ClienteDetailParams {
  clienteId: string;
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
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const formatStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'NOVO_LEAD': 'Novo Lead',
    'CONTATO_INICIAL': 'Contato Inicial',
    'INTERESSE_GERADO': 'Interesse Gerado',
    'VISITA_AGENDADA': 'Visita Agendada',
    'PROPOSTA_ENVIADA': 'Proposta Enviada',
    'FECHAMENTO': 'Fechamento'
  };
  return statusMap[status] || status;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Não informado';
  return new Date(dateString).toLocaleString('pt-BR');
};

export const ClienteDetailPage: React.FC = () => {
  const history = useHistory();
  const { clienteId } = useParams<ClienteDetailParams>();
  const { getClienteById } = useClientesData();
  
  const [cliente, setCliente] = useState<ClienteWithConversa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCliente = async () => {
      if (!clienteId) return;
      
      setIsLoading(true);
      try {
        const clienteData = await getClienteById(clienteId);
        if (clienteData) {
          setCliente(clienteData);
        } else {
          setError('Cliente não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar dados do cliente');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [clienteId, getClienteById]);

  const handleBack = () => {
    history.push('/clientes');
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Carregando...">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 bg-gray-700" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 bg-gray-700" />
              <Skeleton className="h-64 bg-gray-700" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 bg-gray-700" />
              <Skeleton className="h-40 bg-gray-700" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !cliente) {
    return (
      <DashboardLayout title="Erro">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Cliente não encontrado</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Voltar para lista
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const conversa = cliente.conversa;

  return (
    <DashboardLayout title={cliente.nome}>
      <div className="space-y-6">
        {/* Header com navegação */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{cliente.nome}</h1>
              <div className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
                getStatusColor(cliente.status_funil)
              )}>
                {formatStatusText(cliente.status_funil)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informações básicas */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Telefone</p>
                      <p className="text-white">{cliente.telefone}</p>
                    </div>
                  </div>
                  
                  {cliente.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">E-mail</p>
                        <p className="text-white">{cliente.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Cliente desde</p>
                      <p className="text-white">{formatDate(cliente.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Última atualização</p>
                      <p className="text-white">{formatDate(cliente.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {conversa ? (
              <>
                {/* Resumo da conversa */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Resumo da Conversa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {conversa.resumo_gerado || 'Nenhum resumo disponível'}
                    </p>
                    
                    {conversa.tags_conversa && conversa.tags_conversa.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Tags:</p>
                        <div className="flex gap-2 flex-wrap">
                          {conversa.tags_conversa.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Análise de IA */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Análise de IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Perfil comportamental */}
                    {conversa.contato_perfil_comportamental && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Perfil Comportamental</h4>
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {conversa.contato_perfil_comportamental}
                        </Badge>
                      </div>
                    )}

                    {/* Emoção predominante */}
                    {conversa.contato_emocao_predominante && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Emoção Predominante</h4>
                        <p className="text-gray-300">{conversa.contato_emocao_predominante}</p>
                      </div>
                    )}

                    {/* Motivação principal */}
                    {conversa.inteligencia_motivacao_principal && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Motivação Principal</h4>
                        <p className="text-gray-300">{conversa.inteligencia_motivacao_principal}</p>
                      </div>
                    )}

                    {/* Necessidades */}
                    {conversa.necessidade && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Necessidades</h4>
                        <p className="text-gray-300">{conversa.necessidade}</p>
                      </div>
                    )}

                    {/* Perfil detalhado */}
                    {conversa.perfil && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Perfil Detalhado</h4>
                        <p className="text-gray-300">{conversa.perfil}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Insights estratégicos */}
                {conversa.principal_insight_estrategico && (
                  <Card className="bg-yellow-900/10 border-yellow-700/30">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Insight Estratégico
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{conversa.principal_insight_estrategico}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhuma conversa registrada</h3>
                  <p className="text-gray-400">
                    Este cliente ainda não possui uma conversa registrada no sistema.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {conversa && (
              <>
                {/* Métricas da conversa */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Métricas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{conversa.total_mensagens || 0}</div>
                        <div className="text-xs text-gray-400">Mensagens</div>
                      </div>
                      
                      <div className="text-center p-3 bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-400">
                          {conversa.sentimento_geral || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Sentimento</div>
                      </div>
                      
                      <div className="text-center p-3 bg-purple-900/20 rounded-lg">
                        <div className="text-sm font-bold text-purple-400">
                          {conversa.plataforma || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Plataforma</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Orçamento */}
                {conversa.inteligencia_budget_declarado && (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Orçamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-400 font-semibold text-lg">
                        {conversa.inteligencia_budget_declarado}
                      </p>
                    </CardContent>
                  </Card>
                )}



                {/* Próxima ação */}
                {conversa.proxima_acao_recomendada && (
                  <Card className="bg-blue-900/20 border-blue-700/30">
                    <CardHeader>
                      <CardTitle className="text-blue-400 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Próxima Ação
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-3">{conversa.proxima_acao_recomendada}</p>
                      {conversa.data_limite_proxima_acao && (
                        <div className="text-sm text-blue-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Até: {formatDate(conversa.data_limite_proxima_acao)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Status de follow-up */}
                {conversa.status_followup && (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Follow-up
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {conversa.status_followup === 'Concluído' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : conversa.status_followup === 'Pendente' ? (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-white">{conversa.status_followup}</span>
                        </div>
                        
                        {conversa.motivo_followup && (
                          <p className="text-sm text-gray-400">{conversa.motivo_followup}</p>
                        )}
                        
                        {conversa.data_proximo_followup && (
                          <p className="text-sm text-blue-400">
                            Próximo: {formatDate(conversa.data_proximo_followup)}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
