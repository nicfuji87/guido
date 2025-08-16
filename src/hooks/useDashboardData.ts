import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ViewContext } from './useViewContext';
import { log } from '@/utils/logger';

// AI dev note: Hook para buscar dados do dashboard baseados no contexto de visualização
// Implementa queries otimizadas e cache inteligente

export interface ConversaPrioritaria {
  id: string;
  cliente: {
    id: string;
    nome: string;
    profilePicUrl?: string;
  };
  plataforma: string;
  lastMessage: string;
  waitingTime: number; // horas
  timestamp_ultima_mensagem: string;
  prioridade?: string;
  sentimento_geral?: string;
  status_contorno_objecao?: string;
  inteligencia_tendencia_sentimento_cliente?: string;
}

export interface LembreteHoje {
  id: string;
  descricao: string;
  cliente?: {
    id: string;
    nome: string;
  };
  data_lembrete: string;
  status: 'PENDENTE' | 'CONCLUIDO';
}

export interface MetricasPessoais {
  novosClientes: number;
  respostasEnviadas: number;
  taxaConversao: number;
  tempoMedioResposta: number;
}

export interface MetricasEquipe {
  totalNovosClientes: number;
  tempoMedioResposta: number;
  negociosFechados: number;
  taxaSucesso: number;
}

export interface DashboardData {
  // Dados do Corretor
  conversasPrioritarias: ConversaPrioritaria[];
  lembretesHoje: LembreteHoje[];
  metricasPessoais: MetricasPessoais;
  
  // Dados do Gestor
  metricasEquipe?: MetricasEquipe;
  conversasRisco?: ConversaPrioritaria[];
  rankingEquipe?: Array<{
    corretor: {
      id: string;
      nome: string;
    };
    pontuacao: number;
    metrica: string;
  }>;
}

export const useDashboardData = (viewContext: ViewContext) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados vazios quando não há dados reais
  const getEmptyData = useCallback((): DashboardData => ({
    conversasPrioritarias: [],
    lembretesHoje: [],
    metricasPessoais: {
      novosClientes: 0,
      respostasEnviadas: 0,
      taxaConversao: 0,
      tempoMedioResposta: 0
    },
    metricasEquipe: {
      totalNovosClientes: 0,
      tempoMedioResposta: 0,
      negociosFechados: 0,
      taxaSucesso: 0
    },
    conversasRisco: [],
    rankingEquipe: []
  }), []);

  const fetchPersonalMetrics = useCallback(async (userId: string, timeRange: string) => {
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - daysBack);

    // Conversas prioritárias (aguardando corretor)
    const { data: conversas } = await supabase
      .from('conversas')
      .select(`
        id,
        plataforma,
        timestamp_ultima_mensagem,
        ultima_interacao_content,
        prioridade,
        sentimento_geral,
        status_contorno_objecao,
        inteligencia_tendencia_sentimento_cliente,
        cliente:clientes(id, nome, profilePicUrl)
      `)
      .eq('status_conversa', 'AGUARDANDO_CORRETOR')
      .order('timestamp_ultima_mensagem', { ascending: true })
      .limit(10);

    // Lembretes de hoje
    const hoje = new Date().toISOString().split('T')[0];
    const { data: lembretes } = await supabase
      .from('lembretes')
      .select(`
        id,
        descricao,
        data_lembrete,
        status,
        cliente:clientes(id, nome)
      `)
      .eq('corretor_id', userId)
      .gte('data_lembrete', hoje)
      .lt('data_lembrete', `${hoje}T23:59:59`)
      .order('data_lembrete');

    // Métricas pessoais
    const { data: metricas } = await supabase.rpc('get_personal_metrics', {
      p_corretor_id: userId,
      p_days_back: daysBack
    });

    return {
      conversasPrioritarias: conversas?.map(conv => ({
        id: conv.id,
        cliente: conv.cliente,
        plataforma: conv.plataforma,
        lastMessage: conv.ultima_interacao_content || 'Sem mensagem',
        waitingTime: conv.timestamp_ultima_mensagem 
          ? Math.floor((Date.now() - new Date(conv.timestamp_ultima_mensagem).getTime()) / (1000 * 60 * 60))
          : 0,
        timestamp_ultima_mensagem: conv.timestamp_ultima_mensagem,
        prioridade: conv.prioridade,
        sentimento_geral: conv.sentimento_geral,
        status_contorno_objecao: conv.status_contorno_objecao,
        inteligencia_tendencia_sentimento_cliente: conv.inteligencia_tendencia_sentimento_cliente
      })) || [],
      lembretesHoje: lembretes || [],
      metricasPessoais: metricas?.[0] || {
        novosClientes: 0,
        respostasEnviadas: 0,
        taxaConversao: 0,
        tempoMedioResposta: 0
      }
    };
  }, []);

  const fetchTeamMetrics = useCallback(async (contaId: string, timeRange: string) => {
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

    // Conversas de risco (toda a equipe)
    const { data: conversasRisco } = await supabase
      .from('conversas')
      .select(`
        id,
        plataforma,
        timestamp_ultima_mensagem,
        ultima_interacao_content,
        prioridade,
        sentimento_geral,
        status_contorno_objecao,
        inteligencia_tendencia_sentimento_cliente,
        cliente:clientes!inner(id, nome, conta_id, profilePicUrl)
      `)
      .eq('clientes.conta_id', contaId)
      .eq('status_conversa', 'AGUARDANDO_CORRETOR')
      .lt('timestamp_ultima_mensagem', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp_ultima_mensagem', { ascending: true })
      .limit(10);

    // Métricas da equipe
    const { data: metricas } = await supabase.rpc('get_team_metrics', {
      p_conta_id: contaId,
      p_days_back: daysBack
    });

    // Ranking da equipe
    const { data: ranking } = await supabase.rpc('get_team_ranking', {
      p_conta_id: contaId,
      p_days_back: daysBack
    });

    return {
      conversasRisco: conversasRisco?.map(conv => ({
        id: conv.id,
        cliente: conv.cliente,
        plataforma: conv.plataforma,
        lastMessage: conv.ultima_interacao_content || 'Sem mensagem',
        waitingTime: conv.timestamp_ultima_mensagem 
          ? Math.floor((Date.now() - new Date(conv.timestamp_ultima_mensagem).getTime()) / (1000 * 60 * 60))
          : 0,
        timestamp_ultima_mensagem: conv.timestamp_ultima_mensagem,
        prioridade: conv.prioridade,
        sentimento_geral: conv.sentimento_geral,
        status_contorno_objecao: conv.status_contorno_objecao,
        inteligencia_tendencia_sentimento_cliente: conv.inteligencia_tendencia_sentimento_cliente
      })) || [],
      metricasEquipe: metricas?.[0] || {
        totalNovosClientes: 0,
        tempoMedioResposta: 0,
        negociosFechados: 0,
        taxaSucesso: 0
      },
      rankingEquipe: ranking || []
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    // Se não temos userId ou contaId, aguardar dados ou mostrar vazio
    if (!viewContext.userId || !viewContext.contaId) {
      log.debug('Aguardando dados de usuário/conta', 'useDashboardData');
      setData(getEmptyData());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let dashboardData: DashboardData;

      if (viewContext.viewMode === 'self') {
        // Dados pessoais
        const personalData = await fetchPersonalMetrics(viewContext.userId, viewContext.timeRange);
        dashboardData = personalData;
      } else if (viewContext.viewMode === 'team') {
        // Dados da equipe + dados pessoais do admin
        const [personalData, teamData] = await Promise.all([
          fetchPersonalMetrics(viewContext.userId, viewContext.timeRange),
          fetchTeamMetrics(viewContext.contaId, viewContext.timeRange)
        ]);
        dashboardData = { ...personalData, ...teamData };
      } else if (viewContext.viewMode === 'corretor_specific' && viewContext.selectedCorretor) {
        // Dados de corretor específico
        const corretorData = await fetchPersonalMetrics(viewContext.selectedCorretor, viewContext.timeRange);
        dashboardData = corretorData;
      } else {
        throw new Error('Configuração de visualização inválida');
      }

      setData(dashboardData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard';
      log.error('Falha ao carregar dados do dashboard', 'useDashboardData', { error: errorMessage });
      
      // Em caso de erro, mostrar dados vazios
      setData(getEmptyData());
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [viewContext, fetchPersonalMetrics, fetchTeamMetrics, getEmptyData]);

  // Fetch inicial e quando contexto muda
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refetch periódico (a cada 2 minutos)
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboardData
  };
};

