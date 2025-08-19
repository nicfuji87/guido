import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

import { useFaturas } from '@/hooks/useFaturas';

// AI dev note: Modal para exibir histórico completo de faturas de uma assinatura
// Implementa tabela responsiva com estados de carregamento e vazio

interface HistoricoFaturasModalProps {
  isOpen: boolean;
  onClose: () => void;
  assinaturaId: string;
  planoNome?: string;
}

export const HistoricoFaturasModal: React.FC<HistoricoFaturasModalProps> = ({
  isOpen,
  onClose,
  assinaturaId,
  planoNome: _planoNome = 'Plano'
}) => {
  const { faturas, isLoading } = useFaturas(assinaturaId);











  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Histórico de Faturas</DialogTitle>
          <DialogDescription>
            Aqui está o histórico completo de suas faturas.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <p>Carregando...</p>
          ) : faturas.length === 0 ? (
            <p>Nenhuma fatura encontrada.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-white">
                    Vencimento
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                    Valor
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-4 pr-4 sm:pr-6">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900">
                {faturas.map((fatura) => (
                  <tr key={fatura.id}>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-300">
                      {new Date(fatura.data_vencimento).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                      {`R$ ${fatura.valor.toFixed(2)}`}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          fatura.status === 'PAGO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {fatura.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href={fatura.url_documento ?? '#'} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                        Ver Boleto<span className="sr-only">, {fatura.id}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
