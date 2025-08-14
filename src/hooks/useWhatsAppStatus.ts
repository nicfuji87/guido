import { useState, useEffect, useCallback } from 'react';
import { evolutionApi } from '@/lib/evolutionApi';
import { EvolutionInstance } from '@/types/evolution';
import { useViewContext } from '@/hooks/useViewContext';

// AI dev note: Hook para monitorar status da instância WhatsApp
// Usado no sidebar para mostrar status real do sistema

export interface WhatsAppSystemStatus {
  isOnline: boolean;
  status: 'connected' | 'disconnected' | 'connecting' | 'unknown';
  statusText: string;
  lastCheck: Date | null;
}

export const useWhatsAppStatus = () => {
  const { currentCorretor } = useViewContext();
  const [systemStatus, setSystemStatus] = useState<WhatsAppSystemStatus>({
    isOnline: false,
    status: 'unknown',
    statusText: 'Verificando...',
    lastCheck: null
  });

  const instanceName = currentCorretor?.evolution_instance;
  const userApiKey = currentCorretor?.evolution_apikey;

  const checkWhatsAppStatus = useCallback(async () => {
    if (!instanceName) {
      setSystemStatus({
        isOnline: false,
        status: 'unknown',
        statusText: 'WhatsApp não configurado',
        lastCheck: new Date()
      });
      return;
    }

    try {
      const instance: EvolutionInstance = await evolutionApi.getInstanceStatus(instanceName, userApiKey);
      
      const isConnected = instance.state === 'open';
      const isConnecting = instance.state === 'connecting';
      
      setSystemStatus({
        isOnline: isConnected,
        status: isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected',
        statusText: isConnected ? 'Tudo funcionando' : isConnecting ? 'Conectando...' : 'WhatsApp desconectado',
        lastCheck: new Date()
      });
    } catch (error) {
      setSystemStatus({
        isOnline: false,
        status: 'unknown',
        statusText: 'Erro na verificação',
        lastCheck: new Date()
      });
    }
  }, [instanceName, userApiKey]);

  // Verificar status a cada 30 segundos
  useEffect(() => {
    if (!currentCorretor?.evolution_instance) {
      return;
    }

    // Verificação inicial
    checkWhatsAppStatus();

    // Configurar polling
    const interval = setInterval(checkWhatsAppStatus, 30000);

    return () => clearInterval(interval);
  }, [checkWhatsAppStatus, currentCorretor?.evolution_instance]);

  return {
    systemStatus,
    checkWhatsAppStatus
  };
};
