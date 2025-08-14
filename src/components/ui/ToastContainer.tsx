import React from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';
import { Toast as ToastType } from '@/hooks/useToast';

// AI dev note: Container de toasts posicionado no canto superior direito
// Usa portal para renderizar fora da árvore de componentes

interface ToastContainerProps {
  toasts: ToastType[];
  hideToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, hideToast }) => {

  // Renderizar apenas se houver toasts
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={hideToast} />
        </div>
      ))}
    </div>,
    document.body
  );
};
