import React from 'react';
import { 
  Home, 
  MessageCircle, 
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
  const { userRole, canManageTeam } = useViewContext();

  // Dados mock para badges - serão substituídos por dados reais
  const pendingConversations = 5;
  const todayReminders = 3;

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard"
    },
    {
      title: "Conversas", 
      icon: MessageCircle,
      href: "/conversations",
      badge: pendingConversations
    },
    {
      title: "Clientes",
      icon: Users,
      href: "/clients",
      children: [
        { title: "Todos os Clientes", href: "/clients" },
        { title: "Leads Novos", href: "/clients?status=new" },
        { title: "Em Negociação", href: "/clients?status=negotiating" },
        { title: "Fechados", href: "/clients?status=closed" }
      ]
    },
    {
      title: "Lembretes",
      icon: Calendar,
      href: "/reminders",
      badge: todayReminders
    },
    {
      title: "Integrações",
      icon: Link2,
      href: "/integrations",
      visible: canManageTeam
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/account",
      visible: canManageTeam,
      children: [
        { title: "Gerenciar Equipe", href: "/team" },
        { title: "Planos & Cobrança", href: "/billing" },
        { title: "Preferências", href: "/settings" }
      ]
    }
  ];

  const visibleItems = sidebarItems.filter(item => item.visible !== false);

  return (
    <Sidebar className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 shadow-2xl">
      <SidebarHeader className="p-6 border-b border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {expanded && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src="/images/guido/guido logo dark - sem fundo.png" 
                    alt="Guido Logo" 
                    className="w-10 h-10 object-contain filter brightness-0 invert"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg opacity-20 blur-sm"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-white">Guido</span>
                  <span className="text-xs text-gray-400 font-medium">CRM Inteligente</span>
                </div>
              </div>
            )}
            {!expanded && (
              <div className="relative mx-auto">
                <img 
                  src="/images/guido/guido logo dark - sem fundo.png" 
                  alt="Guido Logo" 
                  className="w-10 h-10 object-contain filter brightness-0 invert"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg opacity-20 blur-sm"></div>
              </div>
            )}
          </div>
          <Button
            variant="ghost" 
            size="sm"
            onClick={toggle}
            className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarMenu className="space-y-2">
          {visibleItems.map((item, index) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                href={item.href}
                className={cn(
                  "relative group transition-all duration-200 rounded-xl",
                  "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20",
                  "border border-transparent hover:border-blue-500/30",
                  "shadow-lg hover:shadow-blue-500/10",
                  "p-3",
                  index === 0 && "bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20 text-white" // Destaque para item ativo
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-200",
                  "group-hover:scale-110 group-hover:text-blue-400",
                  !expanded && "mx-auto",
                  index === 0 && "text-blue-400" // Cor especial para item ativo
                )} />
                {expanded && (
                  <>
                    <span className="truncate font-medium text-sm">{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full px-2.5 py-1 min-w-[1.25rem] h-6 flex items-center justify-center font-semibold shadow-lg ring-1 ring-orange-400/30">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </>
                )}
                {!expanded && item.badge && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg ring-2 ring-gray-800 ring-offset-1 ring-offset-gray-800">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </SidebarMenuButton>
              
              {/* Submenu items - apenas quando expandido */}
              {expanded && item.children && (
                <div className="ml-8 mt-2 space-y-1 border-l border-gray-700/50 pl-4">
                  {item.children.map((child) => (
                    <SidebarMenuButton 
                      key={child.title}
                      href={child.href}
                      className="text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700/30 transition-all duration-200 rounded-lg py-2 px-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-600 mr-3"></div>
                      <span>{child.title}</span>
                    </SidebarMenuButton>
                  ))}
                </div>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {/* Separador visual */}
        <div className="my-6 mx-4 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        
        {/* Seção de status */}
        {expanded && (
          <div className="px-4 py-3 mx-2 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-green-400">Sistema Online</span>
                <span className="text-xs text-gray-400">Tudo funcionando</span>
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

