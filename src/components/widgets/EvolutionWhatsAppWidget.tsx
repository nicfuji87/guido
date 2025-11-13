import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Smartphone, CheckCircle, AlertCircle, Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';
import { connectWhatsApp, checkInstanceStatus, detectMobileDevice } from '@/services/uazapiService';
import { supabase } from '@/lib/supabaseClient';

// AI dev note: Widget para conectar WhatsApp via UAZapi Edge Functions
// Migrado de Evolution API para UAZapi
// Usa auth_user_id do usuário logado (não corretor_id)

export const EvolutionWhatsAppWidget = () => {
  // Pegar auth_user_id do usuário logado
  const authUser = supabase.auth.user();
  const authUserId = authUser?.id;
  const [status, setStatus] = useState<string>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [lastStatusCheck, setLastStatusCheck] = useState<Date | null>(null);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Verificar status inicial
  const loadInstanceStatus = useCallback(async (showLoading = true) => {
    if (!authUserId) {
      console.warn('[Widget] Aguardando autenticação...');
      return;
    }
    
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const result = await checkInstanceStatus(authUserId);
      
      if (result.success && result.data) {
        setStatus(result.data.status);
        setProfileName(result.data.profileName || null);
        setProfilePicUrl(result.data.profilePicUrl || null);
        setQrCode(result.data.qrcode || null);
        setPairCode(result.data.paircode || null);
        setLastStatusCheck(new Date());

        // Se conectou, parar polling
        if (result.data.status === 'connected' && result.data.loggedIn) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
      }
    } catch (err) {
      console.error('[Widget] Erro ao verificar status:', err);
      setError('Erro ao verificar status da conexão');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [authUserId]);

  // Carregar status inicial
  useEffect(() => {
    if (authUserId) {
      loadInstanceStatus();
    }
  }, [authUserId, loadInstanceStatus]);

  // Conectar WhatsApp
  const handleConnect = async () => {
    if (!authUserId) {
      setError('Usuário não autenticado');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const isMobile = detectMobileDevice();
      
      const result = await connectWhatsApp(authUserId, {
        isMobile,
        phone: undefined // Edge Function pega do banco
      });

      if (result.success && result.data) {
        setStatus(result.data.status);
        setQrCode(result.data.qrcode);
        setPairCode(result.data.paircode);
        
        // Iniciar polling se estiver conectando
        if (result.data.status === 'connecting') {
          startPolling();
        }
      } else {
        setError(result.error || 'Erro ao conectar');
      }
    } catch (err) {
      console.error('[Widget] Erro ao conectar:', err);
      setError('Erro ao conectar WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar polling
  const startPolling = useCallback(() => {
    // Parar polling existente
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    // Iniciar novo polling a cada 10 segundos
    pollIntervalRef.current = setInterval(() => {
      loadInstanceStatus(false);
    }, 10000);
  }, [loadInstanceStatus]);

  // Refresh manual
  const handleRefresh = () => {
    loadInstanceStatus();
  };

  // Determinar cor do status
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'disconnected':
      default:
        return 'text-gray-400';
    }
  };

  // Determinar ícone do status
  const StatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="w-5 h-5" />;
      case 'connecting':
        return <Wifi className="w-5 h-5 animate-pulse" />;
      case 'disconnected':
      default:
        return <WifiOff className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            WhatsApp
          </div>
          <div className={cn("flex items-center gap-2", getStatusColor())}>
            <StatusIcon />
            <span className="text-sm font-normal capitalize">{status}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-destructive font-medium">Erro</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {/* Disconnected State */}
            {status === 'disconnected' && !qrCode && !pairCode && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Conecte seu WhatsApp para começar a receber conversas
                </p>
                <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Conectar WhatsApp
                </Button>
              </div>
            )}

            {/* Connecting State - QR Code */}
            {status === 'connecting' && qrCode && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Escaneie o QR Code</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Abra o WhatsApp no seu celular e escaneie o código
                  </p>
                </div>
                <div className="flex justify-center bg-white p-4 rounded-lg">
                  <img src={qrCode} alt="QR Code WhatsApp" className="w-64 h-64" />
                </div>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Atualizar QR Code
                </Button>
                {lastStatusCheck && (
                  <p className="text-xs text-center text-muted-foreground">
                    Última atualização: {lastStatusCheck.toLocaleTimeString()}
                  </p>
                )}
              </div>
            )}

            {/* Connecting State - Pair Code */}
            {status === 'connecting' && pairCode && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Código de Pareamento</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Abra o WhatsApp no seu celular e digite este código
                  </p>
                </div>
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-3xl font-mono font-bold tracking-wider">{pairCode}</p>
                </div>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Gerar Novo Código
                </Button>
                {lastStatusCheck && (
                  <p className="text-xs text-center text-muted-foreground">
                    Última atualização: {lastStatusCheck.toLocaleTimeString()}
                  </p>
                )}
              </div>
            )}

            {/* Connected State */}
            {status === 'connected' && (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        WhatsApp Conectado
                      </p>
                      {profileName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {profileName}
                        </p>
                      )}
                    </div>
                    {profilePicUrl && (
                      <img
                        src={profilePicUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                  </div>
                </div>
                {lastStatusCheck && (
                  <p className="text-xs text-center text-muted-foreground">
                    Verificado em: {lastStatusCheck.toLocaleTimeString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
