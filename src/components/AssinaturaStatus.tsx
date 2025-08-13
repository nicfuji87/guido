import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Crown,
  Calendar,
  CreditCard,
  Users
} from 'lucide-react';
import { useAssinatura } from '../hooks/useAssinatura';
import { ModalUpgrade } from './ModalUpgrade';

// AI dev note: Componente para dashboard - mostra status detalhado da assinatura
// Inclui métricas importantes e próximas ações
// Integrado com ModalUpgrade para fluxo completo de upgrade

interface AssinaturaStatusProps {
  showDetails?: boolean;
  onUpgrade?: () => void;
  onManageSubscription?: () => void;
}

export const AssinaturaStatus: React.FC<AssinaturaStatusProps> = ({
  showDetails = true,
  onUpgrade,
  onManageSubscription
}) => {
  const { assinatura, status, isLoading } = useAssinatura();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!assinatura || !status) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Sem Assinatura</h3>
            <p className="text-red-700">Nenhuma assinatura encontrada para esta conta.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = () => {
    switch (assinatura.status) {
      case 'ATIVO':
        return {
          icon: Check,
          title: 'Assinatura Ativa',
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-900',
          iconColor: 'text-green-600'
        };
      case 'TRIAL':
        if (status.isTrialExpirado) {
          return {
            icon: XCircle,
            title: 'Trial Expirado',
            color: 'red',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-900',
            iconColor: 'text-red-600'
          };
        } else if (status.isTrialExpirando) {
          return {
            icon: AlertTriangle,
            title: 'Trial Expirando',
            color: 'amber',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-900',
            iconColor: 'text-amber-600'
          };
        } else {
          return {
            icon: Clock,
            title: 'Período de Teste',
            color: 'blue',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-900',
            iconColor: 'text-blue-600'
          };
        }
      case 'PAUSADO':
        return {
          icon: Clock,
          title: 'Assinatura Pausada',
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-900',
          iconColor: 'text-yellow-600'
        };
      case 'CANCELADO':
      case 'EXPIRADO':
        return {
          icon: XCircle,
          title: 'Assinatura Expirada',
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          iconColor: 'text-red-600'
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Status Desconhecido',
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          iconColor: 'text-gray-600'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'Gratuito';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-6`}>
      {/* Header com Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <statusConfig.icon className={`h-6 w-6 ${statusConfig.iconColor}`} />
          <div>
            <h3 className={`text-lg font-semibold ${statusConfig.textColor}`}>
              {statusConfig.title}
            </h3>
            <p className={`text-sm ${statusConfig.textColor} opacity-75`}>
              {assinatura.plano.nome_plano}
            </p>
          </div>
        </div>

        {/* Badge do Status */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusConfig.color === 'green' ? 'bg-green-100 text-green-800' :
          statusConfig.color === 'blue' ? 'bg-blue-100 text-blue-800' :
          statusConfig.color === 'amber' ? 'bg-amber-100 text-amber-800' :
          statusConfig.color === 'red' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {assinatura.status}
        </span>
      </div>

      {/* Informações de Trial */}
      {assinatura.status === 'TRIAL' && (
        <div className={`${statusConfig.textColor} mb-4`}>
          {status.temAcesso ? (
            <p className="text-sm">
              <strong>{status.diasRestantes} dia{status.diasRestantes !== 1 ? 's' : ''} restante{status.diasRestantes !== 1 ? 's' : ''}</strong> do período de teste.
              {status.isTrialExpirando && (
                <span className="block text-xs mt-1 opacity-75">
                  Assine antes de {formatDate(assinatura.data_fim_trial)} para continuar usando.
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm font-medium">
              Período de teste expirado em {formatDate(assinatura.data_fim_trial)}
            </p>
          )}
        </div>
      )}

      {/* Detalhes da Assinatura */}
      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className={`h-4 w-4 ${statusConfig.iconColor}`} />
              <span className={statusConfig.textColor}>
                <span className="opacity-75">Início:</span> {formatDate(assinatura.data_inicio)}
              </span>
            </div>
            
            {assinatura.data_proxima_cobranca && (
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className={`h-4 w-4 ${statusConfig.iconColor}`} />
                <span className={statusConfig.textColor}>
                  <span className="opacity-75">Próxima cobrança:</span> {formatDate(assinatura.data_proxima_cobranca)}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Crown className={`h-4 w-4 ${statusConfig.iconColor}`} />
              <span className={statusConfig.textColor}>
                <span className="opacity-75">Valor:</span> {formatCurrency(assinatura.valor_atual)}
                {assinatura.ciclo_cobranca === 'MONTHLY' ? '/mês' : '/ano'}
              </span>
            </div>
            
            {assinatura.plano.limite_corretores > 1 && (
              <div className="flex items-center gap-2 text-sm">
                <Users className={`h-4 w-4 ${statusConfig.iconColor}`} />
                <span className={statusConfig.textColor}>
                  <span className="opacity-75">Corretores:</span> até {assinatura.plano.limite_corretores === 999999 ? 'ilimitados' : assinatura.plano.limite_corretores}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-3">
        {status.precisaUpgrade && (
          <button
            onClick={() => {
              setIsUpgradeModalOpen(true);
              onUpgrade?.();
            }}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              statusConfig.color === 'red' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
              statusConfig.color === 'amber' ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' :
              'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            <Crown className="h-4 w-4 mr-2" />
            {status.isTrialExpirado ? 'Assinar Agora' : 'Escolher Plano'}
          </button>
        )}
        
        {assinatura.status === 'ATIVO' && onManageSubscription && (
          <button
            onClick={onManageSubscription}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${statusConfig.textColor} ${statusConfig.borderColor} hover:bg-white/50 focus:ring-blue-500`}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Gerenciar Assinatura
          </button>
        )}
      </div>
      </div>

      {/* Modal de Upgrade */}
      <ModalUpgrade
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSuccess={(result) => {
          console.log('[AssinaturaStatus] Upgrade realizado com sucesso:', result);
          // Refresh da página ou callback específico se necessário
        }}
        planoSugerido={null} // Deixar o usuário escolher
      />
    </>
  );
};
