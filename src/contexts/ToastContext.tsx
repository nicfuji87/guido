import React, { createContext, useContext } from 'react';
import { useToast, ToastOptions } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

// AI dev note: Contexto global de toast para uso em toda aplicação
// Fornece funções para mostrar toasts de qualquer componente

interface ToastContextType {
  showToast: (options: ToastOptions) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} hideToast={toast.hideToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
