import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from './useViewContext';
import { Lembrete, CreateLembreteData, UpdateLembreteData } from '@/types/lembretes';

export const useLembretes = () => {
  const { currentCorretor } = useViewContext();
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLembretes = useCallback(async () => {
    if (!currentCorretor?.id) {
      setLembretes([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('lembretes')
        .select(`
          *,
          cliente:clientes(id, nome, telefone)
        `)
        .eq('corretor_id', currentCorretor.id)
        .order('data_lembrete', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setLembretes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [currentCorretor?.id]);

  useEffect(() => {
    fetchLembretes();
  }, [fetchLembretes]);

  const createLembrete = async (data: CreateLembreteData): Promise<boolean> => {
    if (!currentCorretor?.id) {
      setError('Usuário não encontrado');
      return false;
    }

    try {
      setError(null);
      const { error: insertError } = await supabase
        .from('lembretes')
        .insert({
          ...data,
          corretor_id: currentCorretor.id,
          status: 'PENDENTE'
        });

      if (insertError) {
        throw insertError;
      }

      await fetchLembretes(); // Recarregar lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar lembrete');
      return false;
    }
  };

  const updateLembrete = async (id: string, data: UpdateLembreteData): Promise<boolean> => {
    try {
      setError(null);
      const updateData: UpdateLembreteData & { data_conclusao?: string } = { ...data };
      
      // Se estiver marcando como concluído, adicionar data_conclusao
      if (data.status === 'CONCLUIDO') {
        updateData.data_conclusao = new Date().toISOString();
      }
      
      const { error: updateError } = await supabase
        .from('lembretes')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      await fetchLembretes(); // Recarregar lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar lembrete');
      return false;
    }
  };

  const deleteLembrete = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('lembretes')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchLembretes(); // Recarregar lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir lembrete');
      return false;
    }
  };

  const duplicateLembrete = async (lembrete: Lembrete): Promise<boolean> => {
    // Duplicar lembrete adicionando 1 dia à data original
    const novaData = new Date(lembrete.data_lembrete);
    novaData.setDate(novaData.getDate() + 1);

    const duplicateData: CreateLembreteData = {
      cliente_id: lembrete.cliente_id,
      titulo: `${lembrete.titulo} (cópia)`,
      descricao: lembrete.descricao,
      data_lembrete: novaData.toISOString(),
      tipo_lembrete: lembrete.tipo_lembrete,
      prioridade: lembrete.prioridade
    };

    try {
      setError(null);
      const { error: insertError } = await supabase
        .from('lembretes')
        .insert({
          ...duplicateData,
          corretor_id: currentCorretor?.id,
          status: 'PENDENTE',
          lembrete_original_id: lembrete.id
        });

      if (insertError) {
        throw insertError;
      }

      await fetchLembretes(); // Recarregar lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao duplicar lembrete');
      return false;
    }
  };

  const prorrogarLembrete = async (id: string, horas: number): Promise<boolean> => {
    const lembrete = lembretes.find(l => l.id === id);
    if (!lembrete) {
      setError('Lembrete não encontrado');
      return false;
    }

    const novaData = new Date(lembrete.data_lembrete);
    novaData.setHours(novaData.getHours() + horas);

    return updateLembrete(id, {
      data_lembrete: novaData.toISOString()
    });
  };

  const marcarComoConcluido = async (id: string): Promise<boolean> => {
    return updateLembrete(id, { status: 'CONCLUIDO' });
  };

  const marcarComoPendente = async (id: string): Promise<boolean> => {
    return updateLembrete(id, { status: 'PENDENTE', data_conclusao: undefined });
  };

  // Filtros úteis
  const lembretesPendentes = lembretes.filter(l => l.status === 'PENDENTE');
  const lembretesConcluidos = lembretes.filter(l => l.status === 'CONCLUIDO');
  const lembretesUrgentes = lembretes.filter(l => {
    const agora = new Date();
    const dataLembrete = new Date(l.data_lembrete);
    return l.status === 'PENDENTE' && dataLembrete <= agora;
  });
  const lembretesProximos = lembretes.filter(l => {
    const agora = new Date();
    const dataLembrete = new Date(l.data_lembrete);
    const proximasHoras = new Date(agora.getTime() + (24 * 60 * 60 * 1000)); // Próximas 24h
    return l.status === 'PENDENTE' && dataLembrete > agora && dataLembrete <= proximasHoras;
  });

  return {
    lembretes,
    lembretesPendentes,
    lembretesConcluidos,
    lembretesUrgentes,
    lembretesProximos,
    isLoading,
    error,
    createLembrete,
    updateLembrete,
    deleteLembrete,
    duplicateLembrete,
    prorrogarLembrete,
    marcarComoConcluido,
    marcarComoPendente,
    refetch: fetchLembretes
  };
};
