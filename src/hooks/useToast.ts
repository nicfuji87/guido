import { useState, useCallback } from 'react';

// AI dev note: Sistema de toast simples e moderno
// Compatível com React 16, sem dependências externas

export interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  title?: string;
  description?: string;
}

export interface Toast extends ToastOptions {
  id: string;
  isVisible: boolean;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );

    // Remove completamente após animação
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Date.now().toString() + Math.random().toString(36);
    const toast: Toast = {
      id,
      isVisible: true,
      type: 'info',
      duration: 4000,
      ...options,
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast após duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, toast.duration);
    }

    return id;
  }, [hideToast]);

  const success = useCallback((title: string, description?: string) => {
    return showToast({ type: 'success', title, description });
  }, [showToast]);

  const error = useCallback((title: string, description?: string) => {
    return showToast({ type: 'error', title, description });
  }, [showToast]);

  const info = useCallback((title: string, description?: string) => {
    return showToast({ type: 'info', title, description });
  }, [showToast]);

  const warning = useCallback((title: string, description?: string) => {
    return showToast({ type: 'warning', title, description });
  }, [showToast]);

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    info,
    warning,
  };
};