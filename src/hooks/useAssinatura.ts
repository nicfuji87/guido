import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { log } from '@/utils/logger';

// Temporary user interface until proper auth is implemented
interface User {
  conta_id?: string;
  corretor_id?: string;
}

// Temporary auth hook - will be replaced with proper auth implementation
const useAuth = (): { user: User | null } => {
  // For now, return null - this will be replaced when auth is properly implemented
  return { user: null };
};

// AI dev note: Hook crítico para todo o sistema de assinaturas
// Gerencia estado da assinatura do usuário logado com cache inteligente
// Inclui logs estratégicos para debug de problemas de cobrança

export interface Plano {
  id: number;
  nome_plano: string;
  codigo_externo: string;
  descricao?: string;
  preco_mensal: number;
  preco_anual?: number;
  limite_corretores: number;
  tipo_plano: 'INDIVIDUAL' | 'IMOBILIARIA';
  recursos: Record<string, boolean | number | string>;
  is_ativo: boolean;
}

export interface Assinatura {
  id: string;
  conta_id: string;
  plano_id: number;
  status: 'TRIAL' | 'ATIVO' | 'PAUSADO' | 'CANCELADO' | 'EXPIRADO';
  id_assinatura_asaas?: string;
  data_inicio: string;
  data_fim_trial: string;
  data_proxima_cobranca?: string;
  data_cancelamento?: string;
  valor_atual?: number;
  ciclo_cobranca: 'MONTHLY' | 'YEARLY';
  responsavel_pagamento: 'CONTA_PROPRIA' | 'ADMIN_CONTA';
  tentativas_cobranca: number;
  data_criacao: string;
  data_atualizacao: string;
  plano: Plano;
}

export interface AssinaturaStatus {
  temAcesso: boolean;
  diasRestantes: number;
  isTrialExpirando: boolean; // Menos de 2 dias
  isTrialExpirado: boolean;
  precisaUpgrade: boolean;
}

interface UseAssinaturaReturn {
  assinatura: Assinatura | null;
  status: AssinaturaStatus | null;
  planos: Plano[];
  isLoading: boolean;
  error: string | null;
  refetchAssinatura: () => Promise<void>;
  refetchPlanos: () => Promise<void>;
}

export const useAssinatura = (): UseAssinaturaReturn => {
  const { user } = useAuth();
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [status, setStatus] = useState<AssinaturaStatus | null>(null);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calcularStatus = (assinatura: Assinatura | null): AssinaturaStatus => {
    if (!assinatura) {
      return {
        temAcesso: false,
        diasRestantes: 0,
        isTrialExpirando: false,
        isTrialExpirado: true,
        precisaUpgrade: true
      };
    }

    const agora = new Date();
    const fimTrial = new Date(assinatura.data_fim_trial);
    const diasRestantes = Math.max(0, Math.ceil((fimTrial.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)));

    const temAcesso = assinatura.status === 'ATIVO' || 
      (assinatura.status === 'TRIAL' && diasRestantes > 0);

    const isTrialExpirando = assinatura.status === 'TRIAL' && diasRestantes <= 2 && diasRestantes > 0;
    const isTrialExpirado = assinatura.status === 'TRIAL' && diasRestantes <= 0;
    const precisaUpgrade = assinatura.status === 'TRIAL' || 
      assinatura.status === 'EXPIRADO' || 
      assinatura.status === 'CANCELADO';

    return {
      temAcesso,
      diasRestantes,
      isTrialExpirando,
      isTrialExpirado,
      precisaUpgrade
    };
  };

  const fetchAssinatura = useCallback(async (): Promise<void> => {
    if (!user?.conta_id) {
      log.debug('[useAssinatura] User não encontrado ou conta_id ausente');
      setAssinatura(null);
      setStatus(calcularStatus(null));
      setIsLoading(false);
      return;
    }

    try {
      log.debug('[useAssinatura] Buscando assinatura para conta:', user.conta_id);
      
      const { data, error } = await supabase
        .from('assinaturas')
        .select(`
          *,
          plano:planos(*)
        `)
        .eq('conta_id', user.conta_id)
        .order('data_criacao', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        log.error('Erro ao buscar assinatura', 'useAssinatura', { error });
        throw error;
      }

      log.debug('[useAssinatura] Assinatura encontrada:', data?.status || 'Nenhuma');
      
      setAssinatura(data);
      setStatus(calcularStatus(data));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      log.error('[useAssinatura] Erro na busca:', errorMessage);
      setError(errorMessage);
      setAssinatura(null);
      setStatus(calcularStatus(null));
    }
  }, [user?.conta_id]);

  const fetchPlanos = async (): Promise<void> => {
    try {
      log.debug('[useAssinatura] Buscando planos disponíveis');
      
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('is_ativo', true)
        .order('preco_mensal', { ascending: true });

      if (error) {
        log.error('Erro ao buscar planos', 'useAssinatura', { error });
        throw error;
      }

      log.debug('Planos encontrados', 'useAssinatura', { count: data?.length || 0 });
      setPlanos(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar planos';
      log.error('[useAssinatura] Erro ao buscar planos:', errorMessage);
      setError(errorMessage);
    }
  };

  const refetchAssinatura = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await fetchAssinatura();
    setIsLoading(false);
  }, [fetchAssinatura]);

  const refetchPlanos = async (): Promise<void> => {
    await fetchPlanos();
  };

  // Efeito principal - buscar dados quando user muda
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      await Promise.all([
        fetchAssinatura(),
        fetchPlanos()
      ]);
      
      setIsLoading(false);
    };

    loadData();
  }, [user?.conta_id, fetchAssinatura]);

  // Revalidação automática quando status muda para expired
  useEffect(() => {
    if (status?.isTrialExpirado && assinatura?.status === 'TRIAL') {
      log.debug('[useAssinatura] Trial expirado detectado, revalidando...');
      setTimeout(() => {
        refetchAssinatura();
      }, 1000);
    }
  }, [status?.isTrialExpirado, assinatura?.status, refetchAssinatura]);

  // Log de mudanças importantes para debug
  useEffect(() => {
    if (assinatura) {
      log.debug('Status da assinatura atualizado', 'useAssinatura', {
        id: assinatura.id,
        status: assinatura.status,
        diasRestantes: status?.diasRestantes,
        temAcesso: status?.temAcesso,
        precisaUpgrade: status?.precisaUpgrade
      });
    }
  }, [assinatura, status]);

  return {
    assinatura,
    status,
    planos,
    isLoading,
    error,
    refetchAssinatura,
    refetchPlanos
  };
};
