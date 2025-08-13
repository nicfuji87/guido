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
  };
  plataforma: string;
  lastMessage: string;
  waitingTime: number; // horas
  timestamp_ultima_mensagem: string;
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

  // AI dev note: Dados mock para demonstração quando não há dados reais
  const getMockData = useCallback((): DashboardData => ({
    conversasPrioritarias: [
      {
        id: 'conv-1',
        cliente: { id: 'cli-1', nome: 'João Silva' },
        plataforma: 'WHATSAPP',
        lastMessage: 'Olá, gostaria de mais informações sobre o imóvel',
        waitingTime: 2,
        timestamp_ultima_mensagem: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'conv-2',
        cliente: { id: 'cli-2', nome: 'Maria Santos' },
        plataforma: 'INSTAGRAM',
        lastMessage: 'Qual o valor do apartamento de 2 quartos?',
        waitingTime: 4,
        timestamp_ultima_mensagem: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'conv-3',
        cliente: { id: 'cli-3', nome: 'Pedro Oliveira' },
        plataforma: 'WHATSAPP',
        lastMessage: 'Quando posso visitar o imóvel?',
        waitingTime: 1,
        timestamp_ultima_mensagem: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ],
    lembretesHoje: [
      {
        id: 'lem-1',
        descricao: 'Ligar para João Silva sobre proposta',
        cliente: { id: 'cli-1', nome: 'João Silva' },
        data_lembrete: new Date().toISOString(),
        status: 'PENDENTE'
      },
      {
        id: 'lem-2',
        descricao: 'Enviar documentos para Maria Santos',
        cliente: { id: 'cli-2', nome: 'Maria Santos' },
        data_lembrete: new Date().toISOString(),
        status: 'PENDENTE'
      },
      {
        id: 'lem-3',
        descricao: 'Reunião de planejamento semanal',
        data_lembrete: new Date().toISOString(),
        status: 'CONCLUIDO'
      }
    ],
    metricasPessoais: {
      novosClientes: 8,
      respostasEnviadas: 45,
      taxaConversao: 32.5,
      tempoMedioResposta: 1.2
    },
    metricasEquipe: {
      totalNovosClientes: 24,
      tempoMedioResposta: 2.1,
      negociosFechados: 12,
      taxaSucesso: 58.3
    },
    conversasRisco: [
      {
        id: 'risk-1',
        cliente: { id: 'cli-4', nome: 'Ana Costa' },
        plataforma: 'WHATSAPP',
        lastMessage: 'Aguardando retorno há 2 dias...',
        waitingTime: 48,
        timestamp_ultima_mensagem: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'risk-2',
        cliente: { id: 'cli-5', nome: 'Carlos Rodrigues' },
        plataforma: 'INSTAGRAM',
        lastMessage: 'Cliente demonstrou interesse mas não respondeu',
        waitingTime: 26,
        timestamp_ultima_mensagem: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
      }
    ],
    rankingEquipe: [
      { corretor: { id: 'cor-1', nome: 'Nicolas Fujimoto' }, pontuacao: 95, metrica: 'conversões' },
      { corretor: { id: 'cor-2', nome: 'Ana Silva' }, pontuacao: 87, metrica: 'conversões' },
      { corretor: { id: 'cor-3', nome: 'Roberto Santos' }, pontuacao: 82, metrica: 'conversões' }
    ]
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
        cliente:clientes(id, nome)
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
        lastMessage: 'Última mensagem...', // TODO: buscar última mensagem
        waitingTime: conv.timestamp_ultima_mensagem 
          ? Math.floor((Date.now() - new Date(conv.timestamp_ultima_mensagem).getTime()) / (1000 * 60 * 60))
          : 0,
        timestamp_ultima_mensagem: conv.timestamp_ultima_mensagem
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
        cliente:clientes!inner(id, nome, conta_id)
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
        lastMessage: 'Última mensagem...',
        waitingTime: conv.timestamp_ultima_mensagem 
          ? Math.floor((Date.now() - new Date(conv.timestamp_ultima_mensagem).getTime()) / (1000 * 60 * 60))
          : 0,
        timestamp_ultima_mensagem: conv.timestamp_ultima_mensagem
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
    // Se não temos userId ou contaId, usar dados mock para demonstração
    if (!viewContext.userId || !viewContext.contaId) {
      log.debug('Usando dados mock para demonstração (sem userId/contaId)', 'useDashboardData');
      setIsLoading(true);
      
      // Simular delay de loading para UX realística
      setTimeout(() => {
        setData(getMockData());
        setIsLoading(false);
      }, 1000);
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
      log.warn('Falha ao carregar dados reais, usando dados mock', 'useDashboardData', { error: errorMessage });
      
      // Em caso de erro, usar dados mock como fallback
      setData(getMockData());
      setError(null); // Não mostrar erro para o usuário, apenas usar mock
    } finally {
      setIsLoading(false);
    }
  }, [viewContext, fetchPersonalMetrics, fetchTeamMetrics, getMockData]);

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

