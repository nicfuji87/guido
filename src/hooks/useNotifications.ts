import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

// AI dev note: Hook para gerenciar notificações do sistema
// Integra com automações para mostrar alertas importantes ao usuário
// Inclui controle de leitura e persistência local

export interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  data_criacao: string;
  lida: boolean;
  acao_url?: string;
  acao_texto?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissNotification: (notificationId: string) => void;
  refetch: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Notificações que foram dispensadas localmente
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const logPrefix = '[useNotifications]';

  const fetchNotifications = useCallback(async () => {
    try {
      console.log(`${logPrefix} Buscando notificações`);

      // Buscar notificações dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .gte('data_criacao', thirtyDaysAgo.toISOString())
        .order('data_criacao', { ascending: false })
        .limit(50);

      if (error) {
        console.error(`${logPrefix} Erro ao buscar notificações:`, error);
        throw error;
      }

      console.log(`${logPrefix} Notificações encontradas:`, data?.length || 0);
      setNotifications(data || []);

    } catch (error) {
      console.error(`${logPrefix} Erro na busca:`, error);
      
      // Criar notificações locais baseadas no status da assinatura
      const localNotifications = await generateLocalNotifications();
      setNotifications(localNotifications);
    }
  }, []);

  // Gerar notificações locais quando não há tabela no banco
  const generateLocalNotifications = async (): Promise<Notification[]> => {
    try {
      // Buscar status da assinatura atual
      const { data: assinatura } = await supabase
        .from('assinaturas')
        .select(`
          *,
          plano:planos(nome_plano, preco_mensal)
        `)
        .in('status', ['TRIAL', 'ATIVO', 'PAUSADO', 'EXPIRADO'])
        .order('data_criacao', { ascending: false })
        .limit(1)
        .single();

      if (!assinatura) return [];

      const notifications: Notification[] = [];
      const agora = new Date();
      const fimTrial = new Date(assinatura.data_fim_trial);
      const diasRestantes = Math.ceil((fimTrial.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));

      // Notificação de trial expirando
      if (assinatura.status === 'TRIAL' && diasRestantes <= 2 && diasRestantes > 0) {
        notifications.push({
          id: `trial-expiring-${assinatura.id}`,
          titulo: '⏰ Trial Expirando',
          mensagem: `Seu trial expira em ${diasRestantes} dia${diasRestantes !== 1 ? 's' : ''}. Assine agora para continuar usando todos os recursos.`,
          tipo: diasRestantes === 1 ? 'error' : 'warning',
          data_criacao: new Date().toISOString(),
          lida: false,
          acao_url: '/upgrade',
          acao_texto: 'Assinar Agora',
          icon: '⏰',
          priority: diasRestantes === 1 ? 'urgent' : 'high'
        });
      }

      // Notificação de trial expirado
      if (assinatura.status === 'TRIAL' && diasRestantes <= 0) {
        notifications.push({
          id: `trial-expired-${assinatura.id}`,
          titulo: '❌ Trial Expirado',
          mensagem: 'Seu período de teste expirou. Reative sua conta para continuar vendendo mais com o Guido.',
          tipo: 'error',
          data_criacao: new Date().toISOString(),
          lida: false,
          acao_url: '/upgrade',
          acao_texto: 'Reativar Conta',
          icon: '❌',
          priority: 'urgent'
        });
      }

      // Notificação de conta pausada
      if (assinatura.status === 'PAUSADO') {
        notifications.push({
          id: `account-suspended-${assinatura.id}`,
          titulo: '🔒 Conta Suspensa',
          mensagem: 'Sua conta foi suspensa devido a problemas no pagamento. Regularize para reativar.',
          tipo: 'error',
          data_criacao: new Date().toISOString(),
          lida: false,
          acao_url: '/billing',
          acao_texto: 'Regularizar Pagamento',
          icon: '🔒',
          priority: 'urgent'
        });
      }

      // Notificação de pagamento próximo (3 dias antes)
      if (assinatura.status === 'ATIVO' && assinatura.data_proxima_cobranca) {
        const proximaCobranca = new Date(assinatura.data_proxima_cobranca);
        const diasParaCobranca = Math.ceil((proximaCobranca.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diasParaCobranca <= 3 && diasParaCobranca > 0) {
          notifications.push({
            id: `payment-reminder-${assinatura.id}`,
            titulo: '💳 Cobrança Próxima',
            mensagem: `Sua próxima cobrança será processada em ${diasParaCobranca} dia${diasParaCobranca !== 1 ? 's' : ''}. Verifique seus dados de pagamento.`,
            tipo: 'info',
            data_criacao: new Date().toISOString(),
            lida: false,
            acao_url: '/billing',
            acao_texto: 'Verificar Pagamento',
            icon: '💳',
            priority: 'medium'
          });
        }
      }

      // Notificação de boas-vindas para novos trials
      const diasDesdeCriacao = Math.floor((agora.getTime() - new Date(assinatura.data_criacao).getTime()) / (1000 * 60 * 60 * 24));
      if (assinatura.status === 'TRIAL' && diasDesdeCriacao <= 1) {
        notifications.push({
          id: `welcome-${assinatura.id}`,
          titulo: '🎉 Bem-vindo ao Guido!',
          mensagem: 'Sua conta está ativa! Aproveite seus 7 dias grátis para explorar todos os recursos.',
          tipo: 'success',
          data_criacao: new Date().toISOString(),
          lida: false,
          acao_url: '/dashboard',
          acao_texto: 'Começar',
          icon: '🎉',
          priority: 'medium'
        });
      }

      return notifications;

    } catch (error) {
      console.error(`${logPrefix} Erro ao gerar notificações locais:`, error);
      return [];
    }
  };

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      console.log(`${logPrefix} Marcando como lida:`, notificationId);

      // Tentar marcar no banco (se existir tabela)
      const { error } = await supabase
        .from('user_notifications')
        .update({ lida: true })
        .eq('id', notificationId);

      if (error) {
        console.warn(`${logPrefix} Falha ao marcar no banco (tabela pode não existir):`, error);
      }

      // Marcar localmente
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, lida: true }
            : notif
        )
      );

    } catch (error) {
      console.error(`${logPrefix} Erro ao marcar como lida:`, error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      console.log(`${logPrefix} Marcando todas como lidas`);

      // Tentar marcar no banco
      const { error } = await supabase
        .from('user_notifications')
        .update({ lida: true })
        .eq('lida', false);

      if (error) {
        console.warn(`${logPrefix} Falha ao marcar todas no banco:`, error);
      }

      // Marcar localmente
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, lida: true }))
      );

    } catch (error) {
      console.error(`${logPrefix} Erro ao marcar todas como lidas:`, error);
    }
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    console.log(`${logPrefix} Dispensando notificação:`, notificationId);
    
    setDismissedIds(prev => new Set([...prev, notificationId]));
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchNotifications();
    setIsLoading(false);
  }, [fetchNotifications]);

  // Fetch inicial
  useEffect(() => {
    fetchNotifications().finally(() => setIsLoading(false));
  }, [fetchNotifications]);

  // Refetch periódico (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Filtrar notificações dispensadas
  const filteredNotifications = notifications.filter(
    notif => !dismissedIds.has(notif.id)
  );

  const unreadCount = filteredNotifications.filter(notif => !notif.lida).length;

  return {
    notifications: filteredNotifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    refetch
  };
};
