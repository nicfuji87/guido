import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AlertCircle, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { evolutionApi } from '@/lib/evolutionApi';
import { useViewContext } from '@/hooks/useViewContext';

// Banner de aviso para conectar WhatsApp
// Aparece em todas as páginas até que o corretor conecte o WhatsApp

export const WhatsAppConnectionBanner = () => {
  const history = useHistory();
  const { currentCorretor } = useViewContext();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  const instanceName = currentCorretor?.evolution_instance;
  const userApiKey = currentCorretor?.evolution_apikey;

  useEffect(() => {
    const checkConnection = async () => {
      if (!instanceName) {
        setIsLoading(false);
        return;
      }

      try {
        const status = await evolutionApi.getInstanceStatus(instanceName, userApiKey);
        setIsConnected(status.state === 'open');
      } catch (error) {
        console.error('[WhatsApp Banner] Erro ao verificar conexão:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [instanceName, userApiKey]);

  const handleGoToIntegrations = () => {
    history.push('/integrations');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Salvar no localStorage para não mostrar novamente nesta sessão
    sessionStorage.setItem('whatsapp_banner_dismissed', 'true');
  };

  // Não mostrar se:
  // 1. Está carregando
  // 2. WhatsApp já está conectado
  // 3. Usuário dispensou o banner nesta sessão
  // 4. Não tem instância Evolution
  if (
    isLoading || 
    isConnected || 
    isDismissed || 
    !instanceName ||
    sessionStorage.getItem('whatsapp_banner_dismissed') === 'true'
  ) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 border-b border-orange-700 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Ícone + Mensagem */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <div className="bg-white/20 rounded-full p-2">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-white" />
                <h3 className="text-white font-semibold text-sm">
                  WhatsApp não conectado
                </h3>
              </div>
              <p className="text-white/90 text-xs">
                Conecte seu WhatsApp Business para começar a receber e gerenciar conversas com seus clientes
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGoToIntegrations}
              size="sm"
              className="bg-white text-orange-600 hover:bg-white/90 font-semibold shadow-md"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Conectar Agora
            </Button>

            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10"
              title="Dispensar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
