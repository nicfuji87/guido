import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import { useUpdateConversations } from '@/hooks/useUpdateConversations';
import { useToastContext } from '@/contexts/ToastContext';
import { useViewContext } from '@/hooks/useViewContext';

// AI dev note: Botão para atualizar conversas via webhook
// Mostra feedback visual com loading, sucesso e erro
// Informa sobre limitação de 60 conversas e tempo de espera

interface UpdateConversationsButtonProps {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const UpdateConversationsButton: React.FC<UpdateConversationsButtonProps> = ({
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const { isUpdating, error, success, updateConversations, resetStatus } = useUpdateConversations();
  const toast = useToastContext();
  const { currentCorretor } = useViewContext();

  // Mostrar toast de sucesso
  useEffect(() => {
    if (success) {
      toast.success(
        'Conversas atualizadas!',
        'As últimas 60 conversas foram sincronizadas com sucesso.'
      );
      resetStatus();
    }
  }, [success, resetStatus, toast]);

  // Mostrar toast de erro
  useEffect(() => {
    if (error) {
      toast.error(
        'Erro na atualização',
        error
      );
      resetStatus();
    }
  }, [error, resetStatus, toast]);

  const handleClick = async () => {
    if (isUpdating) return;
    
    try {
      toast.info(
        'Iniciando atualização...',
        'Processando as últimas 60 conversas. Isso pode levar até 60 segundos.'
      );

      await updateConversations(currentCorretor?.id);
    } catch (error) {
      // console.error('Erro no handleClick:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isUpdating}
      className={`
        bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 
        text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200
        ${isUpdating ? 'from-cyan-700 to-blue-700' : ''}
        text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto
        ${className}
      `}
      title="Atualizar as últimas 60 conversas (pode levar até 60 segundos)"
    >
      <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">{isUpdating ? 'Atualizando...' : 'Atualizar Conversas'}</span>
      <span className="sm:hidden">{isUpdating ? 'Atualizando...' : 'Atualizar'}</span>
    </Button>
  );
};
