import React from 'react';
import { useHistory } from 'react-router-dom';
import { WidgetGrid } from './WidgetGrid';
import { LoadingDashboard } from './LoadingDashboard';
import { ConversasPrioritariasWidget } from './widgets/ConversasPrioritariasWidget';
import { LembretesHojeWidget } from './widgets/LembretesHojeWidget';
import { MetricasPessoaisWidget } from './widgets/MetricasPessoaisWidget';
import { useViewContext } from '@/hooks/useViewContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui';
import { AlertCircle, TrendingUp, Users, Clock } from 'lucide-react';

// AI dev note: Conteúdo principal do dashboard
// Organiza widgets baseado no tipo de usuário e dados carregados

export const DashboardContent = () => {
  const history = useHistory();
  const viewContext = useViewContext();
  const { data, isLoading, error } = useDashboardData(viewContext);

  // Estado de loading inicial com componente moderno
  if (isLoading && !data) {
    return <LoadingDashboard message="Carregando dashboard..." />;
  }

  // Handlers para ações dos widgets
  const handleOpenConversation = (conversaId: string) => {
    // Encontrar a conversa nos dados para obter o cliente_id
    const conversa = data?.conversasPrioritarias?.find(c => c.id === conversaId) ||
                     data?.conversasRisco?.find(c => c.id === conversaId);
    
    if (conversa?.cliente?.id) {
      // Navegar para a página de detalhes do cliente
      history.push(`/clientes/${conversa.cliente.id}`);
    } else {
      // Fallback: navegar para a página de conversas
      history.push('/conversations');
    }
  };

  const handleToggleReminder = (lembreteId: string, completed: boolean) => {
    // TODO: Implementar update do lembrete
    void lembreteId;
    void completed;
  };

  const handleCreateReminder = () => {
    // TODO: Implementar modal de criação
  };

  // Estado de erro moderno
  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-black">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Erro ao carregar dados</h3>
              <p className="text-gray-300 leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Widgets para Corretor (AGENTE ou visão individual)
  const getCorretorWidgets = () => {
    if (!data) return [];

    return [
      {
        id: 'conversas-prioritarias',
        component: (
          <ConversasPrioritariasWidget
            conversas={data.conversasPrioritarias}
            isLoading={isLoading}
            onOpenConversation={handleOpenConversation}
          />
        ),
        priority: 'high' as const,
        size: 'lg' as const,
        visible: true
      },
      {
        id: 'lembretes-hoje',
        component: (
          <LembretesHojeWidget
            lembretes={data.lembretesHoje}
            isLoading={isLoading}
            onToggleComplete={handleToggleReminder}
            onCreateReminder={handleCreateReminder}
          />
        ),
        priority: 'high' as const,
        size: 'md' as const,
        visible: true
      },
      {
        id: 'metricas-pessoais',
        component: (
          <MetricasPessoaisWidget
            metricas={data.metricasPessoais}
            isLoading={isLoading}
            timeRange={viewContext.timeRange}
          />
        ),
        priority: 'medium' as const,
        size: 'xl' as const,
        visible: true
      }
    ];
  };

  // Widgets para Gestor (visão de equipe)
  const getGestorWidgets = () => {
    if (!data) return [];

    const widgets = [
      // Métricas da equipe
      {
        id: 'metricas-equipe',
        component: (
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Métricas da Equipe</h3>
            </div>
            {data.metricasEquipe ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg border border-blue-700">
                  <div className="text-3xl font-bold text-blue-300 mb-1">{data.metricasEquipe.totalNovosClientes}</div>
                  <div className="text-sm font-medium text-blue-400">Novos Clientes</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-900 to-green-800 rounded-lg border border-green-700">
                  <div className="text-3xl font-bold text-green-300 mb-1">{data.metricasEquipe.tempoMedioResposta.toFixed(1)}h</div>
                  <div className="text-sm font-medium text-green-400">Tempo Médio</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg border border-purple-700">
                  <div className="text-3xl font-bold text-purple-300 mb-1">{data.metricasEquipe.negociosFechados}</div>
                  <div className="text-sm font-medium text-purple-400">Fechados</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg border border-orange-700">
                  <div className="text-3xl font-bold text-orange-300 mb-1">{data.metricasEquipe.taxaSucesso.toFixed(1)}%</div>
                  <div className="text-sm font-medium text-orange-400">Taxa Sucesso</div>
                </div>
              </div>
            ) : (
              <Skeleton className="h-20 w-full" />
            )}
          </div>
        ),
        priority: 'high' as const,
        size: 'xl' as const,
        visible: true
      },
      // Conversas de risco
      {
        id: 'conversas-risco',
        component: (
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-900 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Conversas que Exigem Atenção</h3>
            </div>
            {data.conversasRisco ? (
              data.conversasRisco.length > 0 ? (
                <div className="space-y-3">
                  {data.conversasRisco.map(conversa => (
                    <div key={conversa.id} className="p-4 bg-gradient-to-r from-red-900 to-orange-900 border border-red-700 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-white">{conversa.cliente.nome}</div>
                          <div className="text-sm text-gray-300 flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {conversa.waitingTime}h sem resposta • {conversa.plataforma}
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-red-700 text-red-200 rounded-full text-xs font-medium">
                          Urgente
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-gray-200 font-medium">Nenhuma conversa em risco</p>
                  <p className="text-sm text-gray-400">Sua equipe está em dia!</p>
                </div>
              )
            ) : (
              <Skeleton className="h-20 w-full" />
            )}
          </div>
        ),
        priority: 'high' as const,
        size: 'lg' as const,
        visible: true
      },
      // Ranking da equipe
      {
        id: 'ranking-equipe',
        component: (
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Ranking da Equipe</h3>
            </div>
            {data.rankingEquipe ? (
              data.rankingEquipe.length > 0 ? (
                <div className="space-y-3">
                  {data.rankingEquipe.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-gray-600">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-700 text-yellow-200' :
                          index === 1 ? 'bg-gray-600 text-gray-200' :
                          index === 2 ? 'bg-orange-700 text-orange-200' :
                          'bg-blue-700 text-blue-200'
                        }`}>
                          #{index + 1}
                        </div>
                        <span className="font-semibold text-white">{item.corretor.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-white">{item.pontuacao}</span>
                        <span className="text-sm text-gray-300">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-200 font-medium">Dados insuficientes para ranking</p>
                  <p className="text-sm text-gray-400">Continue trabalhando para aparecer aqui!</p>
                </div>
              )
            ) : (
              <Skeleton className="h-32 w-full" />
            )}
          </div>
        ),
        priority: 'medium' as const,
        size: 'md' as const,
        visible: true
      }
    ];

    return widgets;
  };

  // Determinar quais widgets mostrar baseado no contexto
  const getWidgets = () => {
    if (viewContext.viewMode === 'team' && viewContext.canManageTeam) {
      return [...getGestorWidgets(), ...getCorretorWidgets()];
    } else {
      return getCorretorWidgets();
    }
  };

  const widgets = getWidgets();

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 to-black">
      {/* Indicador de loading global refinado */}
      {isLoading && data && (
        <div className="w-full h-1 bg-gray-800 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse w-2/3 rounded-r-full"></div>
        </div>
      )}

      {/* Container principal com design moderno */}
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header elegante */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              {viewContext.viewMode === 'self' ? 
                `Olá, ${viewContext.currentCorretor?.nome?.split(' ')[0] || 'Corretor'}! 👋` : 
               viewContext.viewMode === 'team' ? 'Dashboard da Equipe' : 'Dashboard do Corretor'}
            </h1>
            <p className="text-gray-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          

        </div>

        {/* Grid de widgets modernizado */}
        <WidgetGrid widgets={widgets} className="grid gap-6" />
      </div>
    </div>
  );
};

