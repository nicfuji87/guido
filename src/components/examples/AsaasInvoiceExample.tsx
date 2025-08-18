// AI dev note: Exemplo de como usar a funcionalidade de fatura Asaas em outros componentes
import React from 'react';
import { CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAsaasInvoice } from '@/hooks/useAsaasInvoice';
import AsaasInvoiceFallback from '@/components/AsaasInvoiceFallback';

interface AsaasInvoiceExampleProps {
  className?: string;
}

export const AsaasInvoiceExample: React.FC<AsaasInvoiceExampleProps> = ({ 
  className = '' 
}) => {
  const { openInvoice, invoiceUrl, clearInvoiceUrl } = useAsaasInvoice();

  // Exemplo de URL de fatura (normalmente viria do webhook)
  const exampleInvoiceUrl = "https://www.asaas.com/i/7aker5to0nd0asqi";

  const handleOpenExampleInvoice = () => {
    openInvoice(exampleInvoiceUrl, {
      newTab: true,
      showFallback: true
    });
  };

  const simulateWebhookResponse = async () => {
    // Simular resposta de webhook com URL da fatura
    const webhookResponse = {
      response: exampleInvoiceUrl
    };

    // Detectar se é URL do Asaas e abrir
    if (webhookResponse.response && webhookResponse.response.startsWith('https://www.asaas.com/')) {
      const result = openInvoice(webhookResponse.response, {
        newTab: true,
        showFallback: true
      });
      
      if (result.success) {
        // console.log('✅ Fatura aberta com sucesso!');
      } else if (result.error === 'popup_blocked') {
        // console.log('⚠️ Popup bloqueado - mostrando fallback');
      }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🧾 Exemplo: Integração com Fatura Asaas
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Cenário 1: Abertura Direta
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Tenta abrir diretamente em nova guaba. Se o popup for bloqueado, não mostra fallback.
            </p>
            <Button
              onClick={() => openInvoice(exampleInvoiceUrl, { newTab: true, showFallback: false })}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Fatura (Sem Fallback)
            </Button>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">
              Cenário 2: Com Fallback (Recomendado)
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Tenta abrir em nova guaba. Se bloqueado, mostra banner de fallback abaixo.
            </p>
            <Button
              onClick={handleOpenExampleInvoice}
              className="bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Abrir Fatura (Com Fallback)
            </Button>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">
              Cenário 3: Simular Webhook
            </h3>
            <p className="text-sm text-purple-700 mb-3">
              Simula recebimento de resposta do webhook com URL da fatura.
            </p>
            <Button
              onClick={simulateWebhookResponse}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Simular Webhook Response
            </Button>
          </div>
        </div>

        <div className="mt-6 p-3 bg-gray-100 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">📋 URL de Exemplo:</h4>
          <code className="text-sm text-gray-600 break-all">
            {exampleInvoiceUrl}
          </code>
        </div>
      </Card>

      {/* Banner de fallback quando popup é bloqueado */}
      {invoiceUrl && (
        <AsaasInvoiceFallback 
          invoiceUrl={invoiceUrl} 
          onClose={clearInvoiceUrl}
        />
      )}

      <Card className="p-4 bg-yellow-50">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Como Usar em Outros Componentes:</h3>
        <div className="text-sm text-yellow-800 space-y-2">
          <p><strong>1. Import:</strong> <code>import {'{ useAsaasInvoice }'} from '@/hooks/useAsaasInvoice';</code></p>
          <p><strong>2. Hook:</strong> <code>const {'{ openInvoice, invoiceUrl, clearInvoiceUrl }'} = useAsaasInvoice();</code></p>
          <p><strong>3. Abrir:</strong> <code>openInvoice(url, {'{ newTab: true, showFallback: true }'})</code></p>
          <p><strong>4. Fallback:</strong> <code>{'<AsaasInvoiceFallback invoiceUrl={invoiceUrl} onClose={clearInvoiceUrl} />'}</code></p>
        </div>
      </Card>
    </div>
  );
};

export default AsaasInvoiceExample;
