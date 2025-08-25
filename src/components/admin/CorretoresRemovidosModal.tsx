import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useCorretorAdmin } from '@/hooks/useCorretorAdmin';
import { useViewContext } from '@/hooks/useViewContext';
import { log } from '@/utils/logger';
import type { Corretor } from '@/types/api';

// AI dev note: Modal administrativo para gerenciar corretores removidos (soft-deleted)
// Permite visualizar histórico e restaurar corretores quando necessário

interface CorretoresRemovidosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorretoresRemovidosModal: React.FC<CorretoresRemovidosModalProps> = ({
  isOpen,
  onClose
}) => {
  const [corretoresDeletados, setCorretoresDeletados] = useState<Corretor[]>([]);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  
  const { 
    isLoading, 
    error, 
    listarCorretoresDeletados, 
    restaurarCorretor,
    clearError 
  } = useCorretorAdmin();
  
  const { currentCorretor } = useViewContext();

  const carregarCorretoresDeletados = useCallback(async () => {
    if (!currentCorretor?.conta_id) return;

    try {
      const deletados = await listarCorretoresDeletados(currentCorretor.conta_id);
      setCorretoresDeletados(deletados);
    } catch (err) {
      log.error('Erro ao carregar corretores deletados', 'CorretoresRemovidosModal', err);
    }
  }, [currentCorretor?.conta_id, listarCorretoresDeletados]);

  // Carregar corretores deletados quando modal abre
  useEffect(() => {
    if (isOpen && currentCorretor?.conta_id) {
      carregarCorretoresDeletados();
    }
  }, [isOpen, currentCorretor?.conta_id, carregarCorretoresDeletados]);

  const handleRestaurarCorretor = async (corretor: Corretor) => {
    if (!corretor.id) return;

    try {
      setIsRestoring(corretor.id);
      clearError();

      const result = await restaurarCorretor(corretor.id);

      if (result.success) {
        // Remover da lista local
        setCorretoresDeletados(prev => prev.filter(c => c.id !== corretor.id));
        
        // Mostrar feedback de sucesso
        log.info('Corretor restaurado com sucesso', 'CorretoresRemovidosModal', {
          nome: corretor.nome,
          email: corretor.email
        });
      } else {
        log.error('Falha ao restaurar corretor', 'CorretoresRemovidosModal', {
          error: result.error
        });
      }
    } catch (err) {
      log.error('Erro ao restaurar corretor', 'CorretoresRemovidosModal', err);
    } finally {
      setIsRestoring(null);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBadgeVariant = (funcao: string) => {
    switch (funcao) {
      case 'DONO': return 'default';
      case 'ADMIN': return 'secondary'; 
      case 'AGENTE': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Corretores Removidos
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Histórico de corretores removidos da equipe
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Carregando...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erro</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && corretoresDeletados.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum corretor removido
                </h3>
                <p className="text-gray-600">
                  Todos os corretores da equipe estão ativos.
                </p>
              </div>
            )}

            {/* Lista de Corretores Deletados */}
            {!isLoading && corretoresDeletados.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">
                    {corretoresDeletados.length} corretor{corretoresDeletados.length !== 1 ? 'es' : ''} removido{corretoresDeletados.length !== 1 ? 's' : ''}
                  </h3>
                </div>

                {corretoresDeletados.map((corretor) => (
                  <Card key={corretor.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {corretor.nome}
                          </h4>
                          <Badge variant={getBadgeVariant(corretor.funcao)}>
                            {corretor.funcao}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📧 {corretor.email}</p>
                          {corretor.cpf && <p>📄 CPF: {corretor.cpf}</p>}
                          {corretor.deleted_at && (
                            <p className="text-red-600">
                              🗑️ Removido em: {formatarData(corretor.deleted_at)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleRestaurarCorretor(corretor)}
                          disabled={isRestoring === corretor.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          {isRestoring === corretor.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Restaurando...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Restaurar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end">
              <Button 
                onClick={onClose}
                variant="outline"
              >
                Fechar
              </Button>
            </div>
          </div>

        </div>
      </div>
    </Dialog>
  );
};
