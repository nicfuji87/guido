// AI dev note: Componente para exibir fatura fixa na página Planos & Cobrança
import React from 'react';
import { ExternalLink, FileText, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface InvoiceDisplayProps {
  invoiceUrl: string;
  status: 'TRIAL' | 'ATIVO' | 'PAGAMENTO_PENDENTE' | 'CANCELADO';
  valor: number;
  dataVencimento?: string;
  planoNome: string;
  className?: string;
}

export const InvoiceDisplay: React.FC<InvoiceDisplayProps> = ({
  invoiceUrl,
  status,
  valor,
  dataVencimento,
  planoNome,
  className = ''
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'ATIVO':
        return {
          icon: CheckCircle,
          color: 'bg-green-900/20 text-green-300 border-green-700/50',
          label: 'Pagamento em Dia',
          description: 'Sua assinatura está ativa e em dia',
          iconColor: 'text-green-400',
          bgIcon: 'bg-green-800/30'
        };
      case 'PAGAMENTO_PENDENTE':
        return {
          icon: AlertTriangle,
          color: 'bg-red-900/20 text-red-300 border-red-700/50',
          label: 'Pagamento Pendente',
          description: 'Sua assinatura está com pagamento em atraso',
          iconColor: 'text-red-400',
          bgIcon: 'bg-red-800/30'
        };
      case 'TRIAL':
        return {
          icon: Clock,
          color: 'bg-blue-900/20 text-blue-300 border-blue-700/50',
          label: 'Período de Teste',
          description: 'Aproveite seu teste grátis',
          iconColor: 'text-blue-400',
          bgIcon: 'bg-blue-800/30'
        };
      case 'CANCELADO':
        return {
          icon: AlertTriangle,
          color: 'bg-gray-800/20 text-gray-300 border-gray-600/50',
          label: 'Cancelado',
          description: 'Assinatura cancelada',
          iconColor: 'text-gray-400',
          bgIcon: 'bg-gray-700/30'
        };
      default:
        return {
          icon: FileText,
          color: 'bg-gray-800/20 text-gray-300 border-gray-600/50',
          label: 'Status Desconhecido',
          description: '',
          iconColor: 'text-gray-400',
          bgIcon: 'bg-gray-700/30'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleOpenInvoice = () => {
    window.open(invoiceUrl, '_blank', 'noopener,noreferrer');
  };

  const isVencida = dataVencimento && new Date(dataVencimento) < new Date();

  return (
    <Card className={cn(`p-4 ${statusInfo.color}`, className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg", statusInfo.bgIcon)}>
            <StatusIcon className={cn("w-5 h-5", statusInfo.iconColor)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">Fatura Atual</h3>
              <Badge variant="outline" className={`${statusInfo.color} border-current/30`}>
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              {statusInfo.description}
            </p>
            <div className="text-sm space-y-1 text-gray-200">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-400">Plano:</span>
                <span className="text-white">{planoNome}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-400">Valor:</span>
                <span className="font-semibold text-green-400">{formatCurrency(valor)}</span>
              </div>
              {dataVencimento && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="font-medium text-gray-400">Vencimento:</span>
                  <span className={cn(
                    "font-medium",
                    isVencida ? 'text-red-400' : 'text-gray-200'
                  )}>
                    {formatDate(dataVencimento)} {isVencida && '(Vencida)'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            onClick={handleOpenInvoice}
            className={cn(
              status === 'PAGAMENTO_PENDENTE' ? 
                'bg-red-600 hover:bg-red-700 text-white' :
                'bg-blue-600 hover:bg-blue-700 text-white'
            )}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {status === 'PAGAMENTO_PENDENTE' ? 'Pagar Agora' : 'Ver Fatura'}
          </Button>
        </div>
      </div>



    </Card>
  );
};

export default InvoiceDisplay;
