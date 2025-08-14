import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from './useViewContext';

export const useLembretesBadge = () => {
  const { currentCorretor } = useViewContext();
  const [count, setCount] = useState(0);

  const fetchUrgentReminders = useCallback(async () => {
    if (!currentCorretor?.id) {
      setCount(0);
      return;
    }

    try {
      const agora = new Date();
      const proximasDuasHoras = new Date(agora.getTime() + (2 * 60 * 60 * 1000)); // Próximas 2 horas

      // Buscar lembretes pendentes que são urgentes (vencidos ou nas próximas 2 horas)
      const { data, error } = await supabase
        .from('lembretes')
        .select('id, data_lembrete')
        .eq('corretor_id', currentCorretor.id)
        .eq('status', 'PENDENTE')
        .lte('data_lembrete', proximasDuasHoras.toISOString());

      if (error) {
        setCount(0);
        return;
      }

      setCount(data?.length || 0);
    } catch (err) {
      setCount(0);
    }
  }, [currentCorretor?.id]);

  useEffect(() => {
    fetchUrgentReminders();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchUrgentReminders, 30000);
    
    return () => clearInterval(interval);
  }, [fetchUrgentReminders]);

  return count;
};
