import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck,
  AlertCircle,
  Info,
  AlertTriangle,

} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/Button';

// AI dev note: Centro de notificações integrado com automações
// Mostra alertas importantes do sistema de assinaturas
// Interface responsiva com ações diretas

interface NotificationCenterProps {
  className?: string;
  compact?: boolean; // Versão compacta para header
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  compact?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  compact = false
}) => {
  const getIcon = () => {
    if (notification.icon) {
      return <span className="text-lg">{notification.icon}</span>;
    }

    switch (notification.tipo) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    if (notification.priority === 'urgent') {
      return 'bg-red-50 border-red-200';
    }
    if (notification.priority === 'high') {
      return 'bg-amber-50 border-amber-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  const handleAction = () => {
    if (notification.acao_url) {
      window.location.href = notification.acao_url;
    }
    onMarkAsRead(notification.id);
  };

  return (
    <div className={cn(
      'border rounded-lg transition-all duration-200',
      getBgColor(),
      !notification.lida && 'shadow-sm',
      notification.lida && 'opacity-60',
      compact ? 'p-2' : 'p-4'
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              'font-medium text-sm',
              !notification.lida && 'font-semibold'
            )}>
              {notification.titulo}
            </h4>
            
            <div className="flex items-center gap-1">
              {!notification.lida && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1 hover:bg-white/50 rounded transition-colors"
                  title="Marcar como lida"
                >
                  <Check className="h-3 w-3" />
                </button>
              )}
              
              <button
                onClick={() => onDismiss(notification.id)}
                className="p-1 hover:bg-white/50 rounded transition-colors"
                title="Dispensar"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {notification.mensagem}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              {new Date(notification.data_criacao).toLocaleDateString('pt-BR')}
            </span>
            
            {notification.acao_url && notification.acao_texto && (
              <Button
                size="sm"
                variant={notification.priority === 'urgent' ? 'default' : 'outline'}
                onClick={handleAction}
                className="text-xs px-3 py-1.5"
              >
                {notification.acao_texto}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    dismissNotification 
  } = useNotifications();

  const priorityNotifications = notifications
    .filter(n => n.priority === 'urgent' || n.priority === 'high')
    .slice(0, 3);

  const allNotifications = notifications.slice(0, 10);

  if (compact) {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'relative p-2 rounded-full transition-colors',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
            unreadCount > 0 && 'text-blue-600'
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notificações</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Carregando...
                  </div>
                ) : allNotifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Nenhuma notificação
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {allNotifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDismiss={dismissNotification}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </h2>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Notificações de Alta Prioridade */}
      {priorityNotifications.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Importantes
          </h3>
          {priorityNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDismiss={dismissNotification}
            />
          ))}
        </div>
      )}

      {/* Todas as Notificações */}
      <div className="space-y-3">
        {allNotifications.length > priorityNotifications.length && (
          <h3 className="text-sm font-medium text-muted-foreground">
            Todas
          </h3>
        )}
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Carregando notificações...</p>
          </div>
        ) : allNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
            <p className="text-xs text-muted-foreground mt-1">
              Você está em dia! 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDismiss={dismissNotification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
