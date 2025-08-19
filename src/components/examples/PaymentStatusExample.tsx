// AI dev note: Exemplo de como usar o PaymentStatusBanner na aplicação
import React from 'react';
import PaymentStatusBanner from '../PaymentStatusBanner';
// Tipo simples para status de pagamento no exemplo
type SimplePaymentStatus = 'OVERDUE' | 'PENDING' | 'PAID' | 'NONE';

const PaymentStatusExample: React.FC = () => {
  const statuses: SimplePaymentStatus[] = ['OVERDUE', 'PENDING', 'PAID', 'NONE'];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Exemplos de Status de Pagamento</h1>
      
      {statuses.map(status => (
        <div key={status as string} className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            Status: <span className={`font-mono ${
              status === 'PAID' ? 'text-green-500' :
              status === 'PENDING' ? 'text-yellow-500' :
              status === 'OVERDUE' ? 'text-red-500' :
              'text-gray-500'
            }`}>{status}</span>
          </h2>
          <PaymentStatusBanner 
            userId="example-user-id"
          />
        </div>
      ))}
    </div>
  );
};

export default PaymentStatusExample;
