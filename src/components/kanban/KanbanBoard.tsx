import React from 'react';
import { Search, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Input, Skeleton } from '@/components/ui';
import { ClientCard } from './ClientCard';
import { useKanbanData } from '@/hooks/useKanbanData';
import { KanbanColumn, KanbanClient, FunilStage } from '@/types/kanban';
import { cn } from '@/lib/utils';

// AI dev note: Componente principal do Kanban Board
// Gerencia o funil de vendas com drag & drop entre colunas

export const KanbanBoard = () => {
  const { columns, stats, isLoading, error, moveClient, refreshData } = useKanbanData();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Função para remover acentos e normalizar texto
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
      .trim();
  };

  // Função para filtrar clientes
  const filterClients = (clients: KanbanClient[], term: string) => {
    if (!term || term.length < 3) return clients;
    
    const normalizedTerm = normalizeText(term);
    
    return clients.filter(client => {
      // Busca por nome (normalizado)
      const normalizedName = normalizeText(client.nome || '');
      if (normalizedName.includes(normalizedTerm)) return true;
      
      // Busca por telefone (apenas dígitos)
      const phoneDigits = (client.telefone || '').replace(/\D/g, '');
      const searchDigits = term.replace(/\D/g, '');
      if (searchDigits.length >= 3 && phoneDigits.includes(searchDigits)) return true;
      
      return false;
    });
  };

  // Aplicar filtro nas colunas
  const filteredColumns = React.useMemo(() => {
    return columns.map(column => ({
      ...column,
      clients: filterClients(column.clients, searchTerm)
    }));
  }, [columns, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️ Erro ao carregar funil</div>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header com métricas */}
      <div className="mb-6 space-y-4">
        {/* Métricas principais */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Clientes</p>
                    <p className="text-2xl font-bold text-white">{stats.totalClientes}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Conversão Global</p>
                    <p className="text-2xl font-bold text-green-400">{stats.taxaConversao}%</p>
                    <p className="text-xs text-gray-500">Contato → Fechamento</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Tempo Médio</p>
                    <p className="text-2xl font-bold text-orange-400">{stats.tempoMedioFunil}d</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pipeline</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      R$ {(stats.valorPipeline / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Barra de ações */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Buscar cliente... (min. 3 caracteres)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          
          <div className="text-sm text-gray-400">
            {searchTerm.length >= 3 ? (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Filtrando por: "{searchTerm}"</span>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Limpar
                </button>
              </div>
            ) : (
              '💬 Clientes chegam automaticamente via WhatsApp'
            )}
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <div className="flex gap-6 h-full pb-6" style={{ minWidth: 'max-content' }}>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="w-80 flex-shrink-0">
                  <Skeleton className="h-full bg-gray-800" />
                </div>
              ))
            ) : (
              filteredColumns.map((column) => {
                const originalColumn = columns.find(col => col.id === column.id);
                return (
                  <KanbanColumnComponent 
                    key={column.id} 
                    column={column}
                    originalColumn={originalColumn}
                    isFiltered={searchTerm.length >= 3}
                    onMoveClient={moveClient}
                    onClientUpdate={refreshData}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente individual da coluna
interface KanbanColumnComponentProps {
  column: KanbanColumn;
  originalColumn?: KanbanColumn;
  isFiltered?: boolean;
  onMoveClient: (clienteId: string, newStage: FunilStage) => Promise<void>;
  onClientUpdate?: () => void;
}

const KanbanColumnComponent: React.FC<KanbanColumnComponentProps> = ({ 
  column, 
  originalColumn, 
  isFiltered = false, 
  onMoveClient,
  onClientUpdate 
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const clienteId = e.dataTransfer.getData('text/plain');
    if (clienteId) {
      try {
        await onMoveClient(clienteId, column.id);
      } catch (error) {
        // Erro já logado no hook
      }
    }
  };

  return (
    <div className="w-80 flex-shrink-0 flex flex-col h-full">
      <Card className="bg-gray-800 border-gray-700 flex flex-col h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">{column.icon}</span>
              <span className="text-sm font-medium">{column.title}</span>
            </div>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              isFiltered ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300"
            )}>
              {isFiltered && originalColumn && originalColumn.clients.length !== column.clients.length 
                ? `${column.clients.length}/${originalColumn.clients.length}`
                : column.clients.length
              }
            </span>
          </CardTitle>
          <p className="text-xs text-gray-400 mt-1">{column.description}</p>
          
          {/* Taxa de conversão para próxima etapa */}
          {column.conversionRate !== undefined && (
            <div className="mt-2 p-2 rounded-lg bg-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Para próxima:</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium",
                    column.conversionStatus === 'high' && "text-green-400",
                    column.conversionStatus === 'medium' && "text-yellow-400", 
                    column.conversionStatus === 'low' && "text-red-400"
                  )}>
                    📈 {column.conversionRate}%
                  </span>
                  <span className="text-xs text-gray-500">
                    ({column.conversionCount})
                  </span>
                </div>
              </div>
              
              {/* Barra visual da taxa */}
              <div className="mt-1 w-full bg-gray-600 rounded-full h-1">
                <div 
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    column.conversionStatus === 'high' && "bg-green-400",
                    column.conversionStatus === 'medium' && "bg-yellow-400",
                    column.conversionStatus === 'low' && "bg-red-400"
                  )}
                  style={{ width: `${Math.min(column.conversionRate || 0, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent 
          className={cn(
            "flex-1 overflow-y-auto space-y-3 transition-colors",
            isDragOver && "bg-cyan-900/20 border-cyan-500/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {column.clients.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm">
                Nenhum cliente nesta etapa
              </div>
            </div>
          ) : (
            column.clients.map((client) => (
              <div
                key={client.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', client.id);
                }}
              >
                <ClientCard 
                  client={client}
                  onClick={() => {
                    // TODO: Abrir modal com detalhes do cliente
                  }}
                  onClientUpdate={onClientUpdate}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
