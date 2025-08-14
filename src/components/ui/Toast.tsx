import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { Toast as ToastType } from '@/hooks/useToast';

// AI dev note: Componente de toast moderno e responsivo
// Compatível com React 16, design baseado na paleta Guido

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styleMap = {
  success: {
    container: 'bg-gradient-to-r from-green-900/90 to-green-800/90 border-green-600',
    icon: 'text-green-400',
    title: 'text-green-100',
    description: 'text-green-200',
  },
  error: {
    container: 'bg-gradient-to-r from-red-900/90 to-red-800/90 border-red-600',
    icon: 'text-red-400',
    title: 'text-red-100',
    description: 'text-red-200',
  },
  warning: {
    container: 'bg-gradient-to-r from-yellow-900/90 to-orange-800/90 border-yellow-600',
    icon: 'text-yellow-400',
    title: 'text-yellow-100',
    description: 'text-yellow-200',
  },
  info: {
    container: 'bg-gradient-to-r from-cyan-900/90 to-blue-800/90 border-cyan-600',
    icon: 'text-cyan-400',
    title: 'text-cyan-100',
    description: 'text-cyan-200',
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const Icon = iconMap[toast.type || 'info'];
  const styles = styleMap[toast.type || 'info'];

  return (
    <div
      className={`
        relative max-w-sm w-full border rounded-lg shadow-lg backdrop-blur-sm p-4
        transform transition-all duration-300 ease-out
        ${toast.isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        ${styles.container}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${styles.icon}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className={`text-sm font-semibold ${styles.title}`}>
              {toast.title}
            </h4>
          )}
          {toast.description && (
            <p className={`text-sm mt-1 ${styles.description}`}>
              {toast.description}
            </p>
          )}
        </div>

        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/60 hover:text-white" />
        </button>
      </div>
    </div>
  );
};
