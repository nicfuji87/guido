import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';

// AI dev note: Hook para gerenciar histórico de faturas
// Filtra automaticamente pelo assinatura_id para garantir isolamento de dados

export interface Fatura {
  id: string;
  assinatura_id: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO' | 'FALHOU' | 'REEMBOLSADO';
  data_vencimento: string;
  data_pagamento?: string;
  url_documento?: string;
  id_gateway_pagamento?: string;
  created_at: string;
  updated_at: string;
}

interface UseFaturasReturn {
  faturas: Fatura[];
  isLoading: boolean;
  error: string | null;
  refetchFaturas: () => Promise<void>;
}

export const useFaturas = (assinaturaId?: string): UseFaturasReturn => {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaturas = useCallback(async (): Promise<void> => {
    if (!assinaturaId) {
      log.debug('[useFaturas] AssinaturaId não fornecido');
      setFaturas([]);
      setIsLoading(false);
      return;
    }

    try {
      log.debug('[useFaturas] Buscando faturas para assinatura:', assinaturaId);
      
      const { data, error } = await supabase
        .from('faturas')
        .select(`
          *,
          assinaturas!inner(deleted_at)
        `)
        .eq('assinatura_id', assinaturaId)
        .is('assinaturas.deleted_at', null)
        .order('data_vencimento', { ascending: false }); // Mais recentes primeiro

      if (error) {
        log.error('Erro ao buscar faturas', 'useFaturas', { error });
        throw error;
      }

      log.debug(`[useFaturas] Faturas encontradas: ${data?.length || 0}`);
      
      setFaturas(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      log.error('[useFaturas] Erro na busca:', errorMessage);
      setError(errorMessage);
      setFaturas([]);
    }
  }, [assinaturaId]);

  const refetchFaturas = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await fetchFaturas();
    setIsLoading(false);
  }, [fetchFaturas]);

  // Efeito principal - buscar dados quando assinaturaId muda
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      await fetchFaturas();
      
      setIsLoading(false);
    };

    loadData();
  }, [assinaturaId, fetchFaturas]);

  // Log de mudanças importantes para debug
  useEffect(() => {
    if (faturas.length > 0) {
      log.debug('Faturas carregadas', 'useFaturas', {
        assinaturaId,
        totalFaturas: faturas.length,
        statusDistribuition: faturas.reduce((acc, fatura) => {
          acc[fatura.status] = (acc[fatura.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
    }
  }, [faturas, assinaturaId]);

  return {
    faturas,
    isLoading,
    error,
    refetchFaturas
  };
};
