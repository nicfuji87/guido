// AI dev note: Componente para mostrar mensagens condicionais baseadas no status de pagamento/Asaas
import React from 'react';
import { AlertTriangle, CreditCard, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

interface PaymentStatusBannerProps {
  userId?: string;
  className?: string;
}

export const PaymentStatusBanner: React.FC<PaymentStatusBannerProps> = ({ 
  userId, 
  className = '' 
}) => {
  const paymentStatus = usePaymentStatus(userId);

  // Não mostrar nada se estiver carregando
  if (paymentStatus.isLoading || !userId) {
    return null;
  }

  // Se NÃO tem id_assinatura_asaas - Mostrar botão para ativar assinatura
  if (!paymentStatus.hasAsaasSubscription) {
    return (
      <Card className={`p-4 border-blue-200 bg-blue-50 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-blue-100">
            <UserPlus className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">
              Ative sua assinatura
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Configure sua forma de pagamento para garantir acesso contínuo ao Guido após o período de teste.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  // TODO: Implementar lógica para ativar assinatura
                  // console.log('Ativar assinatura no Asaas');
                }}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Ativar Assinatura
              </Button>
              {paymentStatus.planoNome && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {paymentStatus.planoNome}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Se TEM id_assinatura_asaas - Mostrar botão para regularizar pagamento
  if (paymentStatus.hasAsaasSubscription) {
    return (
      <Card className={`p-4 border-red-200 bg-red-50 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-red-100">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">
              🚨 Pagamento Atrasado!
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Sua assinatura está com pagamento em atraso. Regularize agora para manter o acesso completo.
            </p>
            {paymentStatus.proximaCobranca && (
              <p className="text-xs text-red-600 mt-1">
                Vencimento: {new Date(paymentStatus.proximaCobranca).toLocaleDateString('pt-BR')}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  // TODO: Implementar lógica para regularizar pagamento
                  // console.log('Regularizar pagamento');
                }}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Regularizar Pagamento
              </Button>
              {paymentStatus.planoNome && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {paymentStatus.planoNome} - R$ {paymentStatus.valorMensal.toFixed(2)}/mês
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Fallback - não deveria acontecer
  return null;
};

export default PaymentStatusBanner;
