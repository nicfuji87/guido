// AI dev note: Componente placeholder quando não há fatura gerada ainda
import React from 'react';
import { FileText, CreditCard, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface InvoicePlaceholderProps {
  status: 'TRIAL' | 'ATIVO' | 'PAGAMENTO_PENDENTE' | 'CANCELADO';
  planoNome: string;
  onGenerateInvoice?: () => void;
  isGenerating?: boolean;
  className?: string;
}

export const InvoicePlaceholder: React.FC<InvoicePlaceholderProps> = ({
  status,
  planoNome,
  onGenerateInvoice,
  isGenerating = false,
  className = ''
}) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'TRIAL':
        return {
          title: 'Período de Teste Ativo',
          description: 'Você está em período de teste gratuito. A fatura será gerada quando necessário.',
          showButton: false,
          badgeColor: 'bg-blue-900/20 text-blue-300 border-blue-700/50',
          icon: Info,
          iconColor: 'text-blue-400',
          bgIcon: 'bg-blue-800/30'
        };
      case 'PAGAMENTO_PENDENTE':
        return {
          title: 'Fatura Pendente',
          description: 'Clique em "Gerar Fatura" para criar sua cobrança no Asaas.',
          showButton: true,
          buttonText: 'Gerar Fatura',
          badgeColor: 'bg-red-900/20 text-red-300 border-red-700/50',
          icon: CreditCard,
          iconColor: 'text-red-400',
          bgIcon: 'bg-red-800/30'
        };
      case 'ATIVO':
        return {
          title: 'Assinatura Ativa',
          description: 'Sua assinatura está ativa. A próxima fatura será gerada automaticamente.',
          showButton: false,
          badgeColor: 'bg-green-900/20 text-green-300 border-green-700/50',
          icon: Info,
          iconColor: 'text-green-400',
          bgIcon: 'bg-green-800/30'
        };
      default:
        return {
          title: 'Status da Fatura',
          description: 'Informações sobre faturamento não disponíveis.',
          showButton: false,
          badgeColor: 'bg-gray-800/20 text-gray-300 border-gray-600/50',
          icon: FileText,
          iconColor: 'text-gray-400',
          bgIcon: 'bg-gray-700/30'
        };
    }
  };

  const statusInfo = getStatusMessage();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className={`p-4 border-dashed border-2 ${statusInfo.badgeColor} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg", statusInfo.bgIcon)}>
            <StatusIcon className={cn("w-5 h-5", statusInfo.iconColor)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">Fatura</h3>
              <Badge variant="outline" className={`${statusInfo.badgeColor} border-current/30`}>
                {statusInfo.title}
              </Badge>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              {statusInfo.description}
            </p>
            <div className="text-sm text-gray-200">
              <span className="font-medium text-gray-400">Plano:</span> <span className="text-white">{planoNome}</span>
            </div>
          </div>
        </div>
        {statusInfo.showButton && onGenerateInvoice && (
          <Button
            size="sm"
            onClick={onGenerateInvoice}
            disabled={isGenerating}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isGenerating ? 'Gerando...' : statusInfo.buttonText}
          </Button>
        )}
      </div>

      {/* Mensagem informativa */}
      <div className="mt-3 pt-3 border-t border-gray-600/30">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FileText className="w-3 h-3" />
          <span>
            {status === 'TRIAL' 
              ? 'Fatura será gerada ao final do período de teste'
              : 'A fatura aparecerá aqui após ser gerada'
            }
          </span>
        </div>
      </div>
    </Card>
  );
};

export default InvoicePlaceholder;
