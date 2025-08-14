import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Smartphone, QrCode, CheckCircle, AlertCircle, Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Skeleton } from '@/components/ui';
import { evolutionApi } from '@/lib/evolutionApi';
import { EvolutionInstance, EvolutionQRCode } from '@/types/evolution';
import { useViewContext } from '@/hooks/useViewContext';
import { cn } from '@/lib/utils';

// AI dev note: Widget para conectar WhatsApp via Evolution API
// Permite gerar QR code e monitorar status da conexão

export const EvolutionWhatsAppWidget = () => {
  const { currentCorretor } = useViewContext();
  const [instance, setInstance] = useState<EvolutionInstance | null>(null);
  const [qrCode, setQrCode] = useState<EvolutionQRCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastStatusCheck, setLastStatusCheck] = useState<Date | null>(null);
  
  const pollIntervalRef = useRef<any>();

  // Usar dados da Evolution do usuário atual ou fallback para dados antigos
  const instanceName = currentCorretor?.evolution_instance || (currentCorretor ? `guido_${currentCorretor.id}` : 'guido_default');
  const userApiKey = currentCorretor?.evolution_apikey;

  console.log('🔍 [DEBUG] EvolutionWhatsAppWidget montado', {
    currentCorretor: currentCorretor ? {
      id: currentCorretor.id,
      nome: currentCorretor.nome,
      evolution_instance: currentCorretor.evolution_instance,
      evolution_apikey: currentCorretor.evolution_apikey ? 'definido' : 'undefined'
    } : 'undefined',
    instanceName,
    userApiKey: userApiKey ? 'definido' : 'undefined'
  });

  const loadInstanceStatus = useCallback(async (showLoading = true) => {
    if (!instanceName) {
      console.log('🔍 [DEBUG] loadInstanceStatus: instanceName vazio', { instanceName });
      return;
    }
    
    console.log('🔍 [DEBUG] loadInstanceStatus iniciado', { 
      instanceName, 
      userApiKey: userApiKey ? 'definido' : 'undefined',
      showLoading 
    });
    
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const status = await evolutionApi.getInstanceStatus(instanceName, userApiKey);
      console.log('🔍 [DEBUG] Status retornado da API:', status);
      
      setInstance(status);
      setLastStatusCheck(new Date());
    } catch (err) {
      console.error('🔍 [DEBUG] Erro ao carregar status da instância:', err);
      setError('Erro ao verificar status da conexão');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [instanceName, userApiKey]);

  const createInstance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await evolutionApi.createInstance({
        instanceName,
        qrcode: true,
      });
      
      // Após criar, gerar QR code
      await generateQRCode();
    } catch (err) {
      // console.error('Erro ao criar instância:', err);
      setError('Erro ao criar instância WhatsApp');
      setIsLoading(false);
    }
  };

  const generateQRCode = async () => {
    if (!instanceName) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const qr = await evolutionApi.connectInstance(instanceName, userApiKey);
      setQrCode(qr);
      
      // Atualizar status
      await loadInstanceStatus(false);
    } catch (err) {
      // console.error('Erro ao gerar QR code:', err);
      setError('Erro ao gerar QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const restartInstance = async () => {
    if (!instanceName) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await evolutionApi.restartInstance(instanceName, userApiKey);
      setQrCode(null);
      
      // Aguardar um pouco e verificar status
      setTimeout(() => loadInstanceStatus(false), 2000);
    } catch (err) {
      // console.error('Erro ao reiniciar instância:', err);
      setError('Erro ao reiniciar instância');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWhatsApp = async () => {
    if (!instanceName) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await evolutionApi.logoutInstance(instanceName, userApiKey);
      setInstance(null);
      setQrCode(null);
    } catch (err) {
      // console.error('Erro ao desconectar:', err);
      setError('Erro ao desconectar WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  // Polling de status a cada minuto
  useEffect(() => {
    if (!instanceName) return;
    
    // Carregar status inicial
    loadInstanceStatus();
    
    // Configurar polling a cada 60 segundos
    pollIntervalRef.current = setInterval(() => {
      loadInstanceStatus(false); // Não mostrar loading no polling
    }, 60000);
    
    // Cleanup
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [instanceName, loadInstanceStatus]);

  const getStatusIcon = () => {
    console.log('🔍 [DEBUG] getStatusIcon chamado', { 
      instance: instance,
      state: instance?.state 
    });
    
    if (!instance) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    
    switch (instance.state) {
      case 'open':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'connecting':
        return <Wifi className="w-5 h-5 text-yellow-400 animate-pulse" />;
      default:
        return <WifiOff className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusText = () => {
    console.log('🔍 [DEBUG] getStatusText chamado', { 
      instance: instance,
      state: instance?.state 
    });
    
    if (!instance) return 'Não configurado';
    
    switch (instance.state) {
      case 'open':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      default:
        return 'Desconectado';
    }
  };

  const getStatusColor = () => {
    if (!instance) return 'text-gray-400';
    
    switch (instance.state) {
      case 'open':
        return 'text-green-400';
      case 'connecting':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-white">WhatsApp Business</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon()}
                <span className={cn('text-sm font-medium', getStatusColor())}>
                  {getStatusText()}
                </span>
                {lastStatusCheck && (
                  <span className="text-xs text-gray-500 ml-2">
                    • {lastStatusCheck.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {instance && (
              <Button
                variant="outline"
                size="sm"
                onClick={restartInstance}
                disabled={isLoading}
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
                title="Reiniciar instância"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
            
            {instance?.state === 'open' && (
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWhatsApp}
                disabled={isLoading}
                className="border-red-600 text-red-400 hover:bg-red-900/20"
              >
                Desconectar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* QR Code Section */}
        {(!instance || instance.state !== 'open') && (
          <div className="space-y-4">
            {qrCode ? (
              <div className="text-center space-y-4">
                <div className="inline-block p-4 bg-white rounded-lg">
                  <img 
                    src={`data:image/png;base64,${qrCode.base64}`}
                    alt="QR Code WhatsApp"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">Escaneie o QR Code</p>
                  <p className="text-gray-400 text-sm">
                    Abra o WhatsApp no seu celular, vá em <strong>Dispositivos conectados</strong> e escaneie este código.
                  </p>
                  {instanceName && (
                    <p className="text-xs text-cyan-400 font-mono bg-gray-900 px-2 py-1 rounded">
                      Instância: {instanceName}
                    </p>
                  )}
                </div>
                <Button
                  onClick={generateQRCode}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-900/20"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Gerar Novo QR Code
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
                  <QrCode className="w-12 h-12 text-gray-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">Conectar WhatsApp</p>
                  <p className="text-gray-400 text-sm">
                    Clique no botão abaixo para gerar um QR code e conectar seu WhatsApp.
                  </p>
                </div>
                <Button
                  onClick={instance ? generateQRCode : createInstance}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Skeleton className="w-4 h-4 mr-2" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 mr-2" />
                      Conectar WhatsApp
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Connected Status */}
        {instance?.state === 'open' && (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-green-900 rounded-lg flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">WhatsApp Conectado</p>
              <p className="text-gray-400 text-sm">
                Seu WhatsApp está conectado e pronto para receber mensagens no Guido.
              </p>
              {instanceName && (
                <p className="text-xs text-green-400 font-mono bg-gray-900 px-2 py-1 rounded">
                  Instância: {instanceName}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Status verificado automaticamente a cada minuto
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
