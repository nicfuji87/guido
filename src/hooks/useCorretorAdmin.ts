import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';
import { performSoftDelete, restoreSoftDelete, isSoftDeleted } from '@/utils/softDeleteHelper';
import type { Corretor } from '@/types/api';

// AI dev note: Hook administrativo para gerenciar corretores com soft delete
// Permite aos administradores deletar/restaurar corretores e visualizar histórico

interface UseCorretorAdminResult {
  // Estados
  isLoading: boolean;
  error: string | null;
  
  // Funções principais
  softDeleteCorretor: (corretorId: string, motivo?: string) => Promise<{ success: boolean; error?: string }>;
  restaurarCorretor: (corretorId: string) => Promise<{ success: boolean; error?: string }>;
  listarCorretoresDeletados: (contaId: string) => Promise<Corretor[]>;
  verificarStatusCorretor: (corretorId: string) => Promise<{ isDeleted: boolean; deletedAt?: string }>;
  
  // Utilitários
  clearError: () => void;
}

export const useCorretorAdmin = (): UseCorretorAdminResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI dev note: Soft delete de corretor com validações de segurança
  const softDeleteCorretor = useCallback(async (
    corretorId: string, 
    motivo?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validações antes do soft delete
      const { data: corretor, error: fetchError } = await supabase
        .from('corretores')
        .select('id, nome, email, funcao, conta_id, deleted_at')
        .eq('id', corretorId)
        .single();

      if (fetchError || !corretor) {
        throw new Error('Corretor não encontrado');
      }

      if (corretor.deleted_at) {
        throw new Error('Corretor já foi removido');
      }

      // Não permitir deletar o último DONO da conta
      if (corretor.funcao === 'DONO') {
        const { data: outrosDonos, error: donosError } = await supabase
          .from('corretores')
          .select('id')
          .eq('conta_id', corretor.conta_id)
          .eq('funcao', 'DONO')
          .is('deleted_at', null)
          .neq('id', corretorId);

        if (donosError) {
          log.error('Erro ao verificar outros donos', 'useCorretorAdmin', donosError);
        }

        if (!outrosDonos || outrosDonos.length === 0) {
          throw new Error('Não é possível remover o último administrador da conta. Promova outro corretor primeiro.');
        }
      }

      // Realizar soft delete
      const result = await performSoftDelete.corretor(corretorId);
      
      if (result.error) {
        throw new Error(`Erro ao remover corretor: ${result.error.message}`);
      }

      // Log da ação administrativa
      log.info('Corretor removido via soft delete', 'useCorretorAdmin', {
        corretorId: corretor.id,
        nome: corretor.nome,
        email: corretor.email,
        motivo: motivo || 'Não informado'
      });

      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro interno ao remover corretor';
      setError(errorMessage);
      log.error('Erro no soft delete de corretor', 'useCorretorAdmin', { error: err });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // AI dev note: Restaurar corretor soft-deleted
  const restaurarCorretor = useCallback(async (
    corretorId: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar se o corretor existe e está deletado
      const isDeleted = await isSoftDeleted.corretor(corretorId);
      
      if (!isDeleted) {
        throw new Error('Corretor não está removido ou não existe');
      }

      // Buscar dados do corretor para logs
      const { data: corretor, error: fetchError } = await supabase
        .from('corretores')
        .select('id, nome, email, conta_id')
        .eq('id', corretorId)
        .single();

      if (fetchError || !corretor) {
        throw new Error('Dados do corretor não encontrados');
      }

      // Verificar se a conta ainda existe e está ativa
      const { data: conta, error: contaError } = await supabase
        .from('contas')
        .select('id, nome_conta')
        .eq('id', corretor.conta_id)
        .single();

      if (contaError || !conta) {
        throw new Error('Conta associada não encontrada ou inativa');
      }

      // Restaurar corretor
      const result = await restoreSoftDelete.corretor(corretorId);
      
      if (result.error) {
        throw new Error(`Erro ao restaurar corretor: ${result.error.message}`);
      }

      // Log da ação administrativa
      log.info('Corretor restaurado', 'useCorretorAdmin', {
        corretorId: corretor.id,
        nome: corretor.nome,
        email: corretor.email,
        contaNome: conta.nome_conta
      });

      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro interno ao restaurar corretor';
      setError(errorMessage);
      log.error('Erro ao restaurar corretor', 'useCorretorAdmin', { error: err });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // AI dev note: Listar corretores soft-deleted para auditoria
  const listarCorretoresDeletados = useCallback(async (contaId: string): Promise<Corretor[]> => {
    try {
      const { data, error } = await supabase
        .from('corretores')
        .select('*')
        .eq('conta_id', contaId)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) {
        log.error('Erro ao listar corretores deletados', 'useCorretorAdmin', error);
        return [];
      }

      return data || [];

    } catch (err) {
      log.error('Erro ao listar corretores deletados', 'useCorretorAdmin', { error: err });
      return [];
    }
  }, []);

  // AI dev note: Verificar status de soft delete de um corretor
  const verificarStatusCorretor = useCallback(async (
    corretorId: string
  ): Promise<{ isDeleted: boolean; deletedAt?: string }> => {
    try {
      const { data, error } = await supabase
        .from('corretores')
        .select('deleted_at')
        .eq('id', corretorId)
        .single();

      if (error || !data) {
        return { isDeleted: false };
      }

      return {
        isDeleted: !!data.deleted_at,
        deletedAt: data.deleted_at
      };

    } catch (err) {
      log.error('Erro ao verificar status do corretor', 'useCorretorAdmin', { error: err });
      return { isDeleted: false };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading,
    error,
    softDeleteCorretor,
    restaurarCorretor,
    listarCorretoresDeletados,
    verificarStatusCorretor,
    clearError
  };
};
