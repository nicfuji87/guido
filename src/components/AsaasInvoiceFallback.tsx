// AI dev note: Componente fallback para quando popup de fatura for bloqueado
import React from 'react';
import { ExternalLink, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AsaasInvoiceFallbackProps {
  invoiceUrl: string;
  onClose: () => void;
  className?: string;
}

export const AsaasInvoiceFallback: React.FC<AsaasInvoiceFallbackProps> = ({
  invoiceUrl,
  onClose,
  className = ''
}) => {
  const handleOpenInvoice = () => {
    // Tentar abrir novamente, desta vez o usuário já autorizou
    window.open(invoiceUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invoiceUrl);
      // Opcional: mostrar toast de sucesso
    } catch (error) {
      // Fallback para browsers mais antigos
      const textarea = document.createElement('textarea');
      textarea.value = invoiceUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  return (
    <Card className={`p-6 border-amber-200 bg-amber-50 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">
              Fatura Gerada com Sucesso!
            </h3>
            <p className="text-sm text-amber-700">
              O bloqueador de popup impediu a abertura automática. 
              Clique no botão abaixo para acessar sua fatura.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-amber-600 hover:text-amber-800"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white p-3 rounded-lg border border-amber-200 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Asaas Fatura
          </Badge>
          <span className="text-xs text-gray-500">Pagamento Seguro</span>
        </div>
        <p className="text-sm text-gray-600 break-all">
          {invoiceUrl}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleOpenInvoice}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir Fatura
        </Button>
        
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          Copiar Link
        </Button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          💡 <strong>Dica:</strong> Para evitar esse aviso no futuro, permita popups para este site nas configurações do seu navegador.
        </p>
      </div>
    </Card>
  );
};

export default AsaasInvoiceFallback;
