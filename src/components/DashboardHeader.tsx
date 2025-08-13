import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuItem,
  Button,
  Separator 
} from '@/components/ui';
import { useViewContext } from '@/hooks/useViewContext';
import { cn } from '@/lib/utils';

// AI dev note: Header do dashboard com filtro de visualização para gestores
// Permite alternar entre visão pessoal, da equipe ou de corretor específico

export const DashboardHeader = () => {
  const { 
    viewMode, 
    canManageTeam, 
    corretores, 
    selectedCorretor,
    setViewMode,
    setSelectedCorretor 
  } = useViewContext();

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'self':
        return 'Minha Atividade';
      case 'team':
        return 'Equipe Inteira';
      case 'corretor_specific': {
        const corretor = corretores.find(c => c.id === selectedCorretor);
        return corretor ? `Corretor: ${corretor.nome}` : 'Corretor Específico';
      }
      default:
        return 'Minha Atividade';
    }
  };

  const handleViewChange = (mode: 'self' | 'team', corretorId?: string) => {
    if (mode === 'self') {
      setViewMode('self');
    } else if (mode === 'team') {
      setViewMode('team');
    } else if (corretorId) {
      setSelectedCorretor(corretorId);
      setViewMode('corretor_specific');
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        
        {/* Filtro de visualização - apenas para gestores */}
        {canManageTeam && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Exibindo dados de:</span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <span>{getViewModeLabel()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => handleViewChange('self')}
                    className={cn(viewMode === 'self' && 'bg-accent')}
                  >
                    <div className="flex flex-col">
                      <span>Minha Atividade</span>
                      <span className="text-xs text-muted-foreground">
                        Seus próprios dados e métricas
                      </span>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => handleViewChange('team')}
                    className={cn(viewMode === 'team' && 'bg-accent')}
                  >
                    <div className="flex flex-col">
                      <span>Equipe Inteira</span>
                      <span className="text-xs text-muted-foreground">
                        Visão consolidada de todos os corretores
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {corretores.length > 0 && (
                    <>
                      <div className="px-2 py-1.5">
                        <div className="text-xs font-medium text-muted-foreground">
                          Corretores Individuais
                        </div>
                      </div>
                      {corretores.map((corretor) => (
                        <DropdownMenuItem 
                          key={corretor.id}
                          onClick={() => handleViewChange('self', corretor.id)}
                          className={cn(
                            selectedCorretor === corretor.id && 'bg-accent'
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{corretor.nome}</span>
                            <span className="text-xs text-muted-foreground">
                              {corretor.funcao === 'DONO' ? 'Proprietário' : 
                               corretor.funcao === 'ADMIN' ? 'Admin' : 'Corretor'}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Indicador de atualização em tempo real */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Atualizado em tempo real</span>
        </div>
      </div>
    </header>
  );
};

