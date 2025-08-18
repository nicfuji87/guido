// AI dev note: Exemplo de como usar o PaymentStatusBanner na aplicação
import React from 'react';
import PaymentStatusBanner from '../PaymentStatusBanner';

interface PaymentStatusExampleProps {
  userId?: string;
}

export const PaymentStatusExample: React.FC<PaymentStatusExampleProps> = ({ userId }) => {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold text-gray-900">
        Status de Pagamento
      </h2>
      
      {/* Banner condicional baseado no status do usuário */}
      <PaymentStatusBanner 
        userId={userId}
        className="max-w-2xl"
      />
      
      <div className="text-sm text-gray-500">
        <p>O banner aparece automaticamente baseado no campo <code>id_assinatura_asaas</code>:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>id_assinatura_asaas = null:</strong> Banner azul "Ativar Assinatura"</li>
          <li><strong>id_assinatura_asaas ≠ null:</strong> Banner vermelho "Regularizar Pagamento"</li>
        </ul>
        <p className="mt-2 text-xs">
          <strong>Lógica:</strong> Se tem ID da assinatura no Asaas = tem faturas = precisa regularizar.<br/>
          Se não tem ID = não tem assinatura ativa = precisa ativar.
        </p>
      </div>
    </div>
  );
};

export default PaymentStatusExample;
