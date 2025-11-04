import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AlertCircle, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useWhatsAppStatus } from '@/hooks/useWhatsAppStatus';
import { cn } from '@/lib/utils';

// AI dev note: Banner persistente que aparece quando WhatsApp não está conectado
// Fica no topo de todas as páginas (exceto página de Integrações)
// Não é intrusivo, mas sempre visível para lembrar o usuário

export const WhatsAppConnectionBanner = () => {
  const history = useHistory();
  const location = useLocation();
  const { systemStatus } = useWhatsAppStatus();
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Não mostrar na página de integrações
  const isIntegrationsPage = location.pathname.includes('/integrations');
  
  // Não mostrar se WhatsApp está conectado
  const isConnected = systemStatus.isOnline && systemStatus.status === 'connected';
  
  // Não mostrar se foi dispensado (apenas nesta sessão)
  if (isConnected || isIntegrationsPage || isDismissed) {
    return null;
  }

  // Determinar estilo baseado no status
  const isConnecting = systemStatus.status === 'connecting';
  const bannerColor = isConnecting 
    ? 'bg-yellow-900/20 border-yellow-700/50' 
    : 'bg-orange-900/20 border-orange-700/50';
  
  const textColor = isConnecting ? 'text-yellow-200' : 'text-orange-200';
  const subtextColor = isConnecting ? 'text-yellow-400/80' : 'text-orange-400/80';
  const iconColor = isConnecting ? 'text-yellow-400' : 'text-orange-400';
  const buttonColor = isConnecting 
    ? 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500' 
    : 'bg-orange-600 hover:bg-orange-700 border-orange-500';

  return (
    <div className={cn(
      'border-b px-4 py-3 animate-in slide-in-from-top duration-300',
      bannerColor
    )}>
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertCircle className={cn('w-5 h-5 flex-shrink-0', iconColor)} />
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-medium', textColor)}>
              {isConnecting ? 'WhatsApp conectando...' : 'WhatsApp não conectado'}
            </p>
            <p className={cn('text-xs', subtextColor)}>
              {isConnecting 
                ? 'Aguarde enquanto estabelecemos a conexão com seu WhatsApp'
                : 'Conecte seu WhatsApp para usar todas as funcionalidades do Guido'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isConnecting && (
            <Button
              size="sm"
              onClick={() => history.push('/integrations')}
              className={cn('text-white font-medium', buttonColor)}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Conectar Agora
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            title="Dispensar (até recarregar a página)"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

