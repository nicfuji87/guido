import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Link2, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui';
import { Button, Avatar, AvatarFallback, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui';
import { useViewContext } from '@/hooks/useViewContext';
import { useWhatsAppStatus } from '@/hooks/useWhatsAppStatus';
// import { useConversasBadge } from '@/hooks/useConversasBadge'; // Removido temporariamente - funcionalidade kanban não disponível
import { useLembretesBadge } from '@/hooks/useLembretesBadge';
import { cn } from '@/lib/utils';

// AI dev note: Sidebar principal do dashboard
// Adapta itens de menu baseado no papel do usuário (DONO/ADMIN vs AGENTE)

interface SidebarItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  visible?: boolean;
  children?: Array<{
    title: string;
    href: string;
  }>;
}

export const AppSidebar = () => {
  const { expanded, toggle } = useSidebar();
  const { userRole } = useViewContext();
  const { systemStatus } = useWhatsAppStatus();
  const location = useLocation();
  // const pendingConversations = useConversasBadge(); // Removido temporariamente - funcionalidade kanban não disponível
  const urgentReminders = useLembretesBadge();

  // Detectar se é mobile
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handler para fechar sidebar no mobile ao clicar em um item
  const handleMenuClick = () => {
    if (isMobile && expanded) {
      toggle();
    }
  };

  // AI dev note: Função para determinar se um item está ativo baseado na rota atual
  const isItemActive = (item: SidebarItem): boolean => {
    const currentPath = location.pathname;
    
    // Verificar se a rota exata corresponde
    if (currentPath === item.href) {
      return true;
    }
    
    // Verificar se algum submenu está ativo
    if (item.children) {
      return item.children.some(child => currentPath === child.href || currentPath.startsWith(child.href + '/'));
    }
    
    // Para rotas que não são exatas, verificar se inicia com o href (mas não para dashboard)
    if (item.href !== '/app') {
      return currentPath.startsWith(item.href + '/');
    }
    
    return false;
  };

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/app"
    },
    // AI dev note: Item 'Conversas' removido temporariamente - funcionalidade kanban não disponível para usuários no momento
    // {
    //   title: "Conversas", 
    //   icon: MessageCircle,
    //   href: "/conversations",
    //   badge: pendingConversations > 0 ? pendingConversations : undefined
    // },
    {
      title: "Clientes",
      icon: Users,
      href: "/clientes"
    },
    {
      title: "Lembretes",
      icon: Calendar,
      href: "/lembretes",
      badge: urgentReminders > 0 ? urgentReminders : undefined
    },
    {
      title: "Integrações",
      icon: Link2,
      href: "/integrations"
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/configuracoes"
    }
  ];

  const visibleItems = sidebarItems.filter(item => item.visible !== false);

  return (
    <Sidebar className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 shadow-2xl relative">
      <SidebarHeader className="p-6 border-b border-gray-700/30 relative">
        <div className="flex items-center justify-center">
          {expanded && (
            <img 
              src="/images/guido/guido logo dark - sem fundo.png" 
              alt="Guido Logo" 
              className="w-16 h-16 object-contain filter brightness-0 invert"
            />
          )}
          {!expanded && (
            <img 
              src="/images/guido/guido logo dark - sem fundo.png" 
              alt="Guido Logo" 
              className="w-10 h-10 object-contain filter brightness-0 invert"
            />
          )}
        </div>
        
        {/* Botão de toggle - visível apenas em desktop */}
        <Button
          variant="ghost" 
          size="sm"
          onClick={toggle}
          className={cn(
            "hidden lg:flex h-10 w-10 p-0 text-gray-300 hover:text-white hover:bg-cyan-600/20 transition-all duration-200 rounded-lg z-20",
            "absolute top-3 right-3",
            "shadow-lg border border-gray-600/50 hover:border-cyan-400/70",
            "backdrop-blur-sm bg-gray-800/80"
          )}
          title={expanded ? "Recolher menu" : "Expandir menu"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarMenu className="space-y-2">
          {visibleItems.map((item, _index) => {
            const isActive = isItemActive(item);
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  href={item.href}
                  onClick={handleMenuClick}
                  className={cn(
                    "relative group transition-all duration-200 rounded-xl",
                    "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20",
                    "border border-transparent hover:border-blue-500/30",
                    "shadow-lg hover:shadow-blue-500/10",
                    "p-3",
                    isActive && "bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20 text-white" // Destaque para item ativo
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-200",
                    "group-hover:scale-110 group-hover:text-blue-400",
                    !expanded && "mx-auto",
                    isActive && "text-blue-400" // Cor especial para item ativo
                  )} />
                {expanded && (
                  <>
                    <span className="truncate font-medium text-sm">{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.5rem] h-5 flex items-center justify-center font-semibold shadow-lg ring-1 ring-orange-400/30 whitespace-nowrap flex-shrink-0">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </>
                )}
                {!expanded && item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg ring-2 ring-gray-800">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </SidebarMenuButton>
              
              {/* Submenu items - apenas quando expandido */}
              {expanded && item.children && (
                <div className="ml-8 mt-2 space-y-1 border-l border-gray-700/50 pl-4">
                  {item.children.map((child) => {
                    const isChildActive = location.pathname === child.href || location.pathname.startsWith(child.href + '/');
                    return (
                      <SidebarMenuButton 
                        key={child.title}
                        href={child.href}
                        onClick={handleMenuClick}
                        className={cn(
                          "text-sm transition-all duration-200 rounded-lg py-2 px-3",
                          isChildActive 
                            ? "text-blue-400 bg-blue-600/10 border border-blue-500/20" 
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
                        )}
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-3",
                          isChildActive ? "bg-blue-400" : "bg-gray-600"
                        )}></div>
                        <span>{child.title}</span>
                      </SidebarMenuButton>
                    );
                  })}
                </div>
              )}
            </SidebarMenuItem>
          );
          })}
        </SidebarMenu>
        
        {/* Separador visual */}
        <div className="my-6 mx-4 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        
        {/* Seção de status */}
        {expanded && (
          <div className={cn(
            "px-4 py-3 mx-2 border rounded-xl transition-colors",
            systemStatus.isOnline 
              ? "bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700/30"
              : systemStatus.status === 'connecting'
              ? "bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border-yellow-700/30"
              : "bg-gradient-to-r from-red-900/20 to-rose-900/20 border-red-700/30"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                systemStatus.isOnline 
                  ? "bg-green-400 animate-pulse"
                  : systemStatus.status === 'connecting'
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-red-400"
              )}></div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-xs font-medium",
                  systemStatus.isOnline 
                    ? "text-green-400"
                    : systemStatus.status === 'connecting'
                    ? "text-yellow-400"
                    : "text-red-400"
                )}>
                  {systemStatus.isOnline ? 'WhatsApp Online' : systemStatus.status === 'connecting' ? 'WhatsApp Conectando' : 'WhatsApp Offline'}
                </span>
                <span className="text-xs text-gray-400">{systemStatus.statusText}</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-700/30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className={cn(
              "w-full transition-all duration-200 rounded-xl p-3",
              "bg-gradient-to-r from-gray-800/50 to-gray-700/50",
              "border border-gray-600/30 hover:border-blue-500/30",
              "hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10",
              "text-gray-300 hover:text-white",
              "shadow-lg hover:shadow-blue-500/10"
            )}>
              <Avatar className="h-10 w-10 ring-2 ring-gray-600/50 ring-offset-2 ring-offset-gray-800">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                  NF
                </AvatarFallback>
              </Avatar>
              {expanded && (
                <div className="flex flex-col items-start flex-1 min-w-0 ml-3">
                  <span className="text-sm font-semibold truncate text-white">Nicolas Fujimoto</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-400 truncate">
                      {userRole === 'DONO' ? 'Proprietário' : 
                       userRole === 'ADMIN' ? 'Administrador' : 'Corretor'}
                    </span>
                  </div>
                </div>
              )}
              {expanded && (
                <div className="flex flex-col gap-1 ml-auto">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-64 bg-gray-800 border-gray-700 shadow-2xl"
            sideOffset={8}
          >
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-blue-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    NF
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Nicolas Fujimoto</span>
                  <span className="text-xs text-gray-400">fujimoto.nicolas@gmail.com</span>
                </div>
              </div>
            </div>
            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors">
              <Settings className="mr-3 h-4 w-4" />
              Configurações da Conta
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors">
              <LogOut className="mr-3 h-4 w-4" />
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

