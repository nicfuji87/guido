import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Smartphone, CheckCircle, AlertCircle, Wifi, WifiOff, RotateCcw, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';
import { connectWhatsApp, checkInstanceStatus, detectMobileDevice, resetInstanceData } from '@/services/uazapiService';
import { supabase } from '@/lib/supabaseClient';
import { ProcessingConversationsModal } from '@/components/ProcessingConversationsModal';

// AI dev note: Widget para conectar WhatsApp via UAZapi Edge Functions
// Migrado de Evolution API para UAZapi
// Usa auth_user_id do usuário logado (não corretor_id)
// Exibe modal de processamento após primeira conexão bem-sucedida

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
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [primeiroAcessoAnterior, setPrimeiroAcessoAnterior] = useState<boolean | null>(null);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatusRef = useRef<string>('disconnected');

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
      
      // Buscar primeiro_acesso ANTES de chamar checkInstanceStatus
      const { data: usuarioAntes } = await supabase
        .from('usuarios')
        .select('primeiro_acesso')
        .eq('auth_user_id', authUserId)
        .single();
      
      const primeiroAcessoAntes = usuarioAntes?.primeiro_acesso ?? null;
      
      // Se é a primeira vez que carrega, guardar o valor inicial
      if (primeiroAcessoAnterior === null && primeiroAcessoAntes !== null) {
        setPrimeiroAcessoAnterior(primeiroAcessoAntes);
      }
      
      const result = await checkInstanceStatus(authUserId);
      
      if (result.success && result.data) {
        const newStatus = result.data.status;
        
        setStatus(newStatus);
        setProfileName(result.data.profileName || null);
        setProfilePicUrl(result.data.profilePicUrl || null);
        setQrCode(result.data.qrcode || null);
        setPairCode(result.data.paircode || null);
        setLastStatusCheck(new Date());

        // Buscar primeiro_acesso DEPOIS de chamar checkInstanceStatus
        const { data: usuarioDepois } = await supabase
          .from('usuarios')
          .select('primeiro_acesso')
          .eq('auth_user_id', authUserId)
          .single();
        
        const primeiroAcessoDepois = usuarioDepois?.primeiro_acesso ?? null;

        // AI dev note: Modal aparece APENAS quando primeiro_acesso muda de FALSE → TRUE
        // Isso acontece apenas na primeira conexão do WhatsApp
        // Depois sempre fica TRUE, mesmo se a instância desconectar
        if (
          primeiroAcessoAnterior === false && 
          primeiroAcessoDepois === true &&
          newStatus === 'connected'
        ) {
          console.log('[Widget] 🎉 PRIMEIRA CONEXÃO detectada! primeiro_acesso mudou de FALSE → TRUE');
          setShowProcessingModal(true);
          setPrimeiroAcessoAnterior(true); // Atualizar para não mostrar novamente
        }

        // Atualizar status anterior para próxima verificação
        previousStatusRef.current = newStatus;

        // Se conectou, parar polling
        if (newStatus === 'connected' && result.data.loggedIn) {
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
  }, [authUserId, primeiroAcessoAnterior]);

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

  // Resetar conexão (em caso de erro)
  const handleReset = async () => {
    if (!authUserId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await resetInstanceData(authUserId);
      
      // Tentar carregar status novamente (vai vir como disconnected)
      setStatus('disconnected');
      setQrCode(null);
      setPairCode(null);
      
      // Forçar refresh
      loadInstanceStatus();
      
    } catch (err) {
      console.error('[Widget] Erro ao resetar:', err);
      setError('Erro ao restaurar conexão');
    } finally {
      setIsLoading(false);
    }
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
    <>
      {/* Modal de Processamento - aparece após primeira conexão */}
      <ProcessingConversationsModal 
        isOpen={showProcessingModal}
        onClose={() => setShowProcessingModal(false)}
      />

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
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-destructive font-medium">Erro</p>
                    <p className="text-sm text-muted-foreground break-words">{error}</p>
                  </div>
                </div>
                
                {/* Botão de Reset se for erro de autenticação ou outro erro persistente */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="self-end text-xs border-destructive/30 hover:bg-destructive/10 text-destructive"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Restaurar Conexão
                </Button>
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
                  
                  {/* Instruções passo a passo para mobile */}
                  <div className="text-left bg-muted/50 p-3 rounded-lg mb-4 text-xs text-muted-foreground space-y-2">
                    <p className="font-medium text-foreground">Como conectar:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Abra o WhatsApp e vá em <strong>Configurações</strong> (ou 3 pontinhos)</li>
                      <li>Toque em <strong>Aparelhos conectados</strong> &gt; <strong>Conectar dispositivo</strong></li>
                      <li>Na tela do QR Code, toque em <strong>Conectar com número de telefone</strong></li>
                    </ol>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-muted p-6 rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-colors group"
                       onClick={() => {
                         navigator.clipboard.writeText(pairCode);
                         // Feedback visual poderia ser adicionado aqui
                       }}>
                    <p className="text-3xl font-mono font-bold tracking-wider break-all">{pairCode}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(pairCode);
                    // Opcional: feedback visual temporário
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Código
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="w-full text-xs"
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Gerar Novo
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Resetar
                  </Button>
                </div>

                {lastStatusCheck && (
                  <p className="text-[10px] text-center text-muted-foreground">
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
    </>
  );
};
