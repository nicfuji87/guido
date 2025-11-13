import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { checkInstanceStatus } from '@/services/uazapiService';

// AI dev note: Hook para verificar status do WhatsApp via UAZapi (migrado de Evolution)
// Usado na sidebar para mostrar status da conexão
// Usa auth_user_id do usuário logado (não mais evolution_instance)

export interface WhatsAppSystemStatus {
  isOnline: boolean;
  status: 'connected' | 'connecting' | 'disconnected' | 'unknown';
  statusText: string;
  lastCheck: Date | null;
}

export const useWhatsAppStatus = () => {
  const [systemStatus, setSystemStatus] = useState<WhatsAppSystemStatus>({
    isOnline: false,
    status: 'unknown',
    statusText: 'Verificando...',
    lastCheck: null
  });

  // Pegar auth_user_id do usuário logado
  const authUser = supabase.auth.user();
  const authUserId = authUser?.id;

  const checkWhatsAppStatus = useCallback(async () => {
    if (!authUserId) {
      setSystemStatus({
        isOnline: false,
        status: 'unknown',
        statusText: 'Aguardando autenticação...',
        lastCheck: new Date()
      });
      return;
    }

    try {
      const result = await checkInstanceStatus(authUserId);
      
      if (result.success && result.data) {
        const isConnected = result.data.status === 'connected' && result.data.loggedIn;
        const isConnecting = result.data.status === 'connecting';
        
        setSystemStatus({
          isOnline: isConnected,
          status: isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected',
          statusText: isConnected ? 'Tudo funcionando' : isConnecting ? 'Conectando...' : 'WhatsApp desconectado',
          lastCheck: new Date()
        });
      } else {
        setSystemStatus({
          isOnline: false,
          status: 'disconnected',
          statusText: 'WhatsApp não configurado',
          lastCheck: new Date()
        });
      }
    } catch (error) {
      console.error('[WhatsApp Status] Erro ao verificar:', error);
      setSystemStatus({
        isOnline: false,
        status: 'unknown',
        statusText: 'Erro na verificação',
        lastCheck: new Date()
      });
    }
  }, [authUserId]);

  // Verificar status a cada 30 segundos
  useEffect(() => {
    if (!authUserId) {
      return;
    }

    // Verificação inicial
    checkWhatsAppStatus();

    // Configurar polling
    const interval = setInterval(checkWhatsAppStatus, 30000);

    return () => clearInterval(interval);
  }, [checkWhatsAppStatus, authUserId]);

  return {
    systemStatus,
    checkWhatsAppStatus
  };
};
