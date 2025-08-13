import React, { useState } from 'react';
import { AlertTriangle, Clock, Crown, X } from 'lucide-react';
import { useAssinatura } from '../hooks/useAssinatura';
import { ModalUpgrade } from './ModalUpgrade';

// AI dev note: Componente crítico para conversão de trials
// Mostra status e urgência da assinatura com CTAs estratégicos
// Integrado com ModalUpgrade para fluxo completo de upgrade

interface TrialBannerProps {
  onUpgrade?: () => void;
  onClose?: () => void;
  compact?: boolean; // Versão compacta para header
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ 
  onUpgrade, 
  onClose, 
  compact = false 
}) => {
  const { assinatura, status, isLoading } = useAssinatura();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Não mostrar se carregando ou se tem acesso ativo sem precisar upgrade
  if (isLoading || !status || (status.temAcesso && !status.precisaUpgrade)) {
    return null;
  }

  const getBannerConfig = () => {
    if (status.isTrialExpirado) {
      return {
        variant: 'expired' as const,
        icon: AlertTriangle,
        title: 'Trial Expirado',
        message: 'Seu período de teste terminou. Assine agora para continuar usando.',
        buttonText: 'Assinar Agora',
        bgColor: 'bg-red-50 border-red-200',
        textColor: 'text-red-900',
        iconColor: 'text-red-600',
        buttonColor: 'bg-red-600 hover:bg-red-700 text-white'
      };
    }

    if (status.isTrialExpirando) {
      return {
        variant: 'expiring' as const,
        icon: Clock,
        title: 'Trial Expirando',
        message: `Restam apenas ${status.diasRestantes} dia${status.diasRestantes !== 1 ? 's' : ''} do seu período de teste.`,
        buttonText: 'Assinar Agora',
        bgColor: 'bg-amber-50 border-amber-200',
        textColor: 'text-amber-900',
        iconColor: 'text-amber-600',
        buttonColor: 'bg-amber-600 hover:bg-amber-700 text-white'
      };
    }

    if (status.precisaUpgrade && status.temAcesso) {
      return {
        variant: 'trial' as const,
        icon: Crown,
        title: 'Período de Teste',
        message: `${status.diasRestantes} dia${status.diasRestantes !== 1 ? 's' : ''} restante${status.diasRestantes !== 1 ? 's' : ''} do trial gratuito.`,
        buttonText: 'Ver Planos',
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-900',
        iconColor: 'text-blue-600',
        buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    }

    return null;
  };

  const config = getBannerConfig();
  if (!config) return null;

  const handleUpgrade = () => {
    // Iniciando processo de upgrade
    setIsUpgradeModalOpen(true);
    onUpgrade?.();
  };

  const handleUpgradeSuccess = (result: unknown) => {
    void result; // Upgrade realizado com sucesso
    onClose?.(); // Fechar banner após upgrade
  };

  if (compact) {
    return (
      <>
        <div className={`${config.bgColor} border-l-4 border-l-current px-3 py-2 flex items-center justify-between text-sm`}>
          <div className="flex items-center gap-2">
            <config.icon className={`h-4 w-4 ${config.iconColor}`} />
            <span className={`font-medium ${config.textColor}`}>
              {config.title}: {status.diasRestantes > 0 ? `${status.diasRestantes} dias` : 'Expirado'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpgrade}
              className={`px-3 py-1 rounded text-xs font-medium ${config.buttonColor} transition-colors`}
            >
              {config.buttonText}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className={`p-1 rounded hover:bg-white/20 ${config.textColor}`}
                aria-label="Fechar"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Modal de Upgrade */}
        <ModalUpgrade
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          onSuccess={handleUpgradeSuccess}
          planoSugerido={null}
        />
      </>
    );
  }

  return (
    <>
      <div className={`${config.bgColor} border rounded-lg p-4 mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <config.icon className={`h-5 w-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`font-semibold ${config.textColor} mb-1`}>
              {config.title}
            </h3>
            <p className={`${config.textColor} mb-3`}>
              {config.message}
            </p>
            
            {/* Informações adicionais do plano atual */}
            {assinatura?.plano && (
              <div className={`text-sm ${config.textColor} opacity-75 mb-3`}>
                Plano atual: <span className="font-medium">{assinatura.plano.nome_plano}</span>
                {status.diasRestantes > 0 && (
                  <span className="ml-2">
                    • Trial até {new Date(assinatura.data_fim_trial).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={handleUpgrade}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${config.buttonColor} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <Crown className="h-4 w-4 mr-2" />
              {config.buttonText}
            </button>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-white/20 ${config.textColor} ml-2`}
            aria-label="Fechar banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>

      {/* Modal de Upgrade */}
      <ModalUpgrade
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSuccess={handleUpgradeSuccess}
        planoSugerido={null} // Deixar o usuário escolher livremente
      />
    </>
  );
};
