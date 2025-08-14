import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from '@/hooks/useViewContext';
import { KanbanClient, KanbanColumn, FunilStage, KanbanStats } from '@/types/kanban';
import { KANBAN_COLUMNS, PROXIMAS_ACOES } from '@/lib/kanbanConfig';
import { log } from '@/utils/logger';

// AI dev note: Hook para gerenciar dados do Kanban de funil de vendas
// Busca clientes, agrupa por estágio e fornece funções para movimentação

export const useKanbanData = () => {
  const { contaId } = useViewContext();
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [stats, setStats] = useState<KanbanStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular urgência baseada no tempo na etapa
  const calculateUrgency = (updatedAt: string): 'alta' | 'media' | 'baixa' => {
    const now = new Date();
    const lastUpdate = new Date(updatedAt);
    const daysDiff = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 3) return 'alta';
    if (daysDiff >= 1) return 'media';
    return 'baixa';
  };

  // Buscar dados dos clientes
  const loadKanbanData = useCallback(async () => {
    if (!contaId) {
      log.debug('Conta ID não disponível para carregar Kanban', 'useKanbanData');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      log.debug('Carregando dados do Kanban', 'useKanbanData', { contaId });

      const { data: clientes, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .eq('conta_id', contaId)
        .neq('status_funil', 'PERDIDO') // Não mostrar leads perdidos no Kanban
        .order('updated_at', { ascending: false });

      if (clientesError) {
        throw clientesError;
      }

      if (!clientes) {
        setColumns([]);
        return;
      }

      // Processar clientes e adicionar campos calculados
      const processedClients: KanbanClient[] = clientes.map(cliente => ({
        ...cliente,
        tempoNaEtapa: Math.floor((new Date().getTime() - new Date(cliente.updated_at).getTime()) / (1000 * 60 * 60 * 24)),
        proximaAcao: PROXIMAS_ACOES[cliente.status_funil as FunilStage],
        urgencia: calculateUrgency(cliente.updated_at),
        ultimoContato: cliente.updated_at
      }));

      // Agrupar clientes por estágio
      const clientesPorEstagio = processedClients.reduce((acc, cliente) => {
        const stage = cliente.status_funil as FunilStage;
        if (!acc[stage]) acc[stage] = [];
        acc[stage].push(cliente);
        return acc;
      }, {} as Record<FunilStage, KanbanClient[]>);

      // Calcular taxas de conversão entre etapas
      const calculateConversionRate = (currentStage: FunilStage, nextStage: FunilStage) => {
        const currentCount = clientesPorEstagio[currentStage]?.length || 0;
        const nextCount = clientesPorEstagio[nextStage]?.length || 0;
        
        if (currentCount === 0) return { rate: 0, count: "0/0", status: 'low' as const };
        
        const rate = Math.round((nextCount / currentCount) * 100);
        const status: 'high' | 'medium' | 'low' = rate >= 60 ? 'high' : rate >= 40 ? 'medium' : 'low';
        
        return {
          rate,
          count: `${nextCount}/${currentCount}`,
          status
        };
      };

      // Criar colunas do Kanban com métricas de conversão
      const kanbanColumns: KanbanColumn[] = KANBAN_COLUMNS.map((colConfig, index) => {
        const nextStage = KANBAN_COLUMNS[index + 1]?.id;
        let conversionData = null;
        
        if (nextStage) {
          conversionData = calculateConversionRate(colConfig.id, nextStage);
        }
        
        return {
          ...colConfig,
          clients: clientesPorEstagio[colConfig.id] || [],
          conversionRate: conversionData?.rate,
          conversionCount: conversionData?.count,
          conversionStatus: conversionData?.status
        };
      });

      setColumns(kanbanColumns);

      // Calcular estatísticas
      const totalClientes = processedClients.length;
      const clientesPorEtapa = KANBAN_COLUMNS.reduce((acc, col) => {
        acc[col.id] = clientesPorEstagio[col.id]?.length || 0;
        return acc;
      }, {} as Record<FunilStage, number>);

      const fechamentos = clientesPorEstagio['FECHAMENTO']?.length || 0;
      
      // Calcular conversão baseada em clientes efetivamente trabalhados (excluindo NOVO_LEAD)
      const clientesTrabalhados = processedClients.filter(cliente => 
        cliente.status_funil !== 'NOVO_LEAD'
      ).length;
      
      const taxaConversao = clientesTrabalhados > 0 ? (fechamentos / clientesTrabalhados) * 100 : 0;

      const statsData: KanbanStats = {
        totalClientes,
        taxaConversao: Number(taxaConversao.toFixed(1)),
        tempoMedioFunil: 15, // TODO: Calcular baseado em dados reais
        valorPipeline: 1500000, // TODO: Integrar com dados de valor
        metaMensal: 75,
        clientesPorEtapa
      };

      setStats(statsData);

      log.info('Dados do Kanban carregados com sucesso', 'useKanbanData', {
        totalClientes,
        colunas: kanbanColumns.map(col => ({ id: col.id, count: col.clients.length }))
      });

    } catch (err) {
      log.error('Erro ao carregar dados do Kanban', 'useKanbanData', err);
      setError('Erro ao carregar dados do funil de vendas');
    } finally {
      setIsLoading(false);
    }
  }, [contaId]);

  // Mover cliente entre estágios
  const moveClient = useCallback(async (clienteId: string, newStage: FunilStage) => {
    try {
      log.debug('Movendo cliente entre estágios', 'useKanbanData', { clienteId, newStage });

      const { error: updateError } = await supabase
        .from('clientes')
        .update({ 
          status_funil: newStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', clienteId);

      if (updateError) {
        throw updateError;
      }

      // Recarregar dados após movimentação
      await loadKanbanData();

      log.info('Cliente movido com sucesso', 'useKanbanData', { clienteId, newStage });

    } catch (err) {
      log.error('Erro ao mover cliente', 'useKanbanData', err);
      setError('Erro ao atualizar estágio do cliente');
      throw err;
    }
  }, [loadKanbanData]);

  // Carregar dados quando o hook é montado
  useEffect(() => {
    loadKanbanData();
  }, [loadKanbanData]);

  return {
    columns,
    stats,
    isLoading,
    error,
    moveClient,
    refreshData: loadKanbanData
  };
};
