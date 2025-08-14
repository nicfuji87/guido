import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from './useViewContext';

export const useConversasBadge = () => {
  const { currentCorretor } = useViewContext();
  const [count, setCount] = useState(0);

  const fetchPendingConversations = useCallback(async () => {
    if (!currentCorretor?.conta_id) {
      setCount(0);
      return;
    }

    try {
      // Buscar conversas com status AGUARDANDO_CORRETOR na conta do usuário
      const { data, error } = await supabase
        .from('conversas')
        .select('id, clientes!inner(conta_id)')
        .eq('status_conversa', 'AGUARDANDO_CORRETOR')
        .eq('clientes.conta_id', currentCorretor.conta_id);

      if (error) {
        setCount(0);
        return;
      }

      setCount(data?.length || 0);
    } catch (err) {
      setCount(0);
    }
  }, [currentCorretor?.conta_id]);

  useEffect(() => {
    fetchPendingConversations();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchPendingConversations, 30000);
    
    return () => clearInterval(interval);
  }, [fetchPendingConversations]);

  return count;
};
