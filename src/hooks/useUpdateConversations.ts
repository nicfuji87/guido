import { useState } from 'react';

// AI dev note: Hook para atualização de conversas via webhook
// Gerencia estado de loading e feedback visual para o usuário

interface UseUpdateConversationsReturn {
  isUpdating: boolean;
  error: string | null;
  success: boolean;
  updateConversations: (corretorId?: string) => Promise<void>;
  resetStatus: () => void;
}

export const useUpdateConversations = (): UseUpdateConversationsReturn => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateConversations = async (corretorId?: string): Promise<void> => {
    const webhookUrl = import.meta.env.VITE_WEBHOOK_UPDATE_CONVERSATIONS_URL;
    const apiKey = import.meta.env.VITE_WEBHOOK_UPDATE_CONVERSATIONS_API_KEY;

    if (!webhookUrl || !apiKey) {
      setError('Configuração do webhook não encontrada');
      return;
    }

    setIsUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const requestBody = {
        action: 'updateConversations',
        timestamp: new Date().toISOString(),
        corretor_id: corretorId,
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Falha ao atualizar conversas: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    isUpdating,
    error,
    success,
    updateConversations,
    resetStatus,
  };
};
