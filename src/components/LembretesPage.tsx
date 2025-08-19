import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { NativeSelect } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { LembreteCard } from '@/components/lembretes/LembreteCard';
import { LembreteForm } from '@/components/lembretes/LembreteForm';
import { useLembretes } from '@/hooks/useLembretes';
import { 
  Lembrete, 
  CreateLembreteData,
  TipoLembrete, 
  PrioridadeLembrete, 
  StatusLembrete,
  TIPO_LEMBRETE_LABELS,
  PRIORIDADE_LABELS
} from '@/types/lembretes';

type FiltroStatus = 'TODOS' | StatusLembrete;
type FiltroTipo = 'TODOS' | TipoLembrete;
type FiltroPrioridade = 'TODOS' | PrioridadeLembrete;

const LembretesContent: React.FC = () => {
  const {
    lembretes,
    lembretesPendentes,
    lembretesConcluidos,
    lembretesUrgentes,
    lembretesProximos,
    isLoading,
    error,
    createLembrete,
    updateLembrete,
    deleteLembrete,
    duplicateLembrete,
    prorrogarLembrete,
    marcarComoConcluido,
    marcarComoPendente
  } = useLembretes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lembreteEdicao, setLembreteEdicao] = useState<Lembrete | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('TODOS');
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('TODOS');
  const [filtroPrioridade, setFiltroPrioridade] = useState<FiltroPrioridade>('TODOS');

  // Função para normalizar texto (remover acentos)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Filtrar lembretes
  const lembretesFilter = lembretes.filter(lembrete => {
    // Filtro de busca
    if (searchTerm.length >= 3) {
      const searchNormalized = normalizeText(searchTerm);
      const tituloMatch = normalizeText(lembrete.titulo).includes(searchNormalized);
      const descricaoMatch = normalizeText(lembrete.descricao).includes(searchNormalized);
      const clienteMatch = lembrete.cliente ? normalizeText(lembrete.cliente.nome).includes(searchNormalized) : false;
      
      if (!tituloMatch && !descricaoMatch && !clienteMatch) {
        return false;
      }
    }

    // Filtro de status
    if (filtroStatus !== 'TODOS' && lembrete.status !== filtroStatus) {
      return false;
    }

    // Filtro de tipo
    if (filtroTipo !== 'TODOS' && lembrete.tipo_lembrete !== filtroTipo) {
      return false;
    }

    // Filtro de prioridade
    if (filtroPrioridade !== 'TODOS' && lembrete.prioridade !== filtroPrioridade) {
      return false;
    }

    return true;
  });

  const handleNovoLembrete = () => {
    setLembreteEdicao(null);
    setIsFormOpen(true);
  };

  const handleEditarLembrete = (lembrete: Lembrete) => {
    setLembreteEdicao(lembrete);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (data: CreateLembreteData) => {
    if (lembreteEdicao) {
      return await updateLembrete(lembreteEdicao.id, data);
    } else {
      return await createLembrete(data);
    }
  };

  const handleDeleteLembrete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lembrete?')) {
      await deleteLembrete(id);
    }
  };

  const handleToggleStatus = async (id: string, novoStatus: StatusLembrete) => {
    if (novoStatus === 'CONCLUIDO') {
      await marcarComoConcluido(id);
    } else {
      await marcarComoPendente(id);
    }
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setFiltroStatus('TODOS');
    setFiltroTipo('TODOS');
    setFiltroPrioridade('TODOS');
  };

  return (
    <div className="space-y-6 p-6">
        {/* Header com estatísticas */}
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={handleNovoLembrete} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lembrete
          </Button>
        </div>

        {/* Cards de estatísticas */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{lembretesPendentes.length}</p>
                  <p className="text-sm text-blue-400">Pendentes</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{lembretesConcluidos.length}</p>
                  <p className="text-sm text-green-400">Concluídos</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{lembretesUrgentes.length}</p>
                  <p className="text-sm text-red-400">Vencidos</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-700/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{lembretesProximos.length}</p>
                  <p className="text-sm text-yellow-400">Próximas 24h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filtros</span>
            {(searchTerm || filtroStatus !== 'TODOS' || filtroTipo !== 'TODOS' || filtroPrioridade !== 'TODOS') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={limparFiltros}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Limpar filtros
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar lembretes... (min. 3 caracteres)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Filtro Status */}
            <NativeSelect 
              value={filtroStatus} 
              onValueChange={(value: string) => setFiltroStatus(value as FiltroStatus)}
              className="bg-gray-800 border-gray-700 text-white"
            >
              <option value="TODOS">Todos os status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="CONCLUIDO">Concluídos</option>
            </NativeSelect>

            {/* Filtro Tipo */}
            <NativeSelect 
              value={filtroTipo} 
              onValueChange={(value: string) => setFiltroTipo(value as FiltroTipo)}
              className="bg-gray-800 border-gray-700 text-white"
            >
              <option value="TODOS">Todos os tipos</option>
              {Object.entries(TIPO_LEMBRETE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>

            {/* Filtro Prioridade */}
            <NativeSelect 
              value={filtroPrioridade} 
              onValueChange={(value: string) => setFiltroPrioridade(value as FiltroPrioridade)}
              className="bg-gray-800 border-gray-700 text-white"
            >
              <option value="TODOS">Todas as prioridades</option>
              {Object.entries(PRIORIDADE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* Filtros ativos */}
          {(searchTerm.length >= 3 || filtroStatus !== 'TODOS' || filtroTipo !== 'TODOS' || filtroPrioridade !== 'TODOS') && (
            <div className="flex flex-wrap gap-2">
              {searchTerm.length >= 3 && (
                <Badge variant="secondary" className="bg-cyan-900/20 text-cyan-400 border-cyan-700/30">
                  Busca: "{searchTerm}"
                </Badge>
              )}
              {filtroStatus !== 'TODOS' && (
                <Badge variant="secondary" className="bg-blue-900/20 text-blue-400 border-blue-700/30">
                  Status: {filtroStatus === 'PENDENTE' ? 'Pendentes' : 'Concluídos'}
                </Badge>
              )}
              {filtroTipo !== 'TODOS' && (
                <Badge variant="secondary" className="bg-purple-900/20 text-purple-400 border-purple-700/30">
                  Tipo: {TIPO_LEMBRETE_LABELS[filtroTipo]}
                </Badge>
              )}
              {filtroPrioridade !== 'TODOS' && (
                <Badge variant="secondary" className="bg-orange-900/20 text-orange-400 border-orange-700/30">
                  Prioridade: {PRIORIDADE_LABELS[filtroPrioridade]}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Lista de lembretes */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading state
            <>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <Skeleton className="h-6 w-1/3 bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-1/4 bg-gray-700" />
                </div>
              ))}
            </>
          ) : error ? (
            // Error state
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-400 mb-2">Erro ao carregar lembretes</h3>
              <p className="text-red-300">{error}</p>
            </div>
          ) : lembretesFilter.length === 0 ? (
            // Empty state
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                {lembretes.length === 0 ? 'Nenhum lembrete encontrado' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-gray-400 mt-2">
                Aqui você pode ver, criar e gerenciar seus lembretes.
              </p>
              {lembretes.length === 0 && (
                <Button onClick={handleNovoLembrete} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Lembrete
                </Button>
              )}
            </div>
          ) : (
            // Lista de lembretes
            <>
              {lembretesFilter.map((lembrete) => (
                <LembreteCard
                  key={lembrete.id}
                  lembrete={lembrete}
                  onEdit={handleEditarLembrete}
                  onDelete={handleDeleteLembrete}
                  onDuplicate={duplicateLembrete}
                  onToggleStatus={handleToggleStatus}
                  onProrrogar={prorrogarLembrete}
                />
              ))}
            </>
          )}
        </div>

        {/* Formulário de lembrete */}
        <LembreteForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitForm}
          lembrete={lembreteEdicao}
          isLoading={isLoading}
        />
      </div>
  );
};

export const LembretesPage: React.FC = () => {
  return (
    <DashboardLayout title="Lembretes">
      <LembretesContent />
    </DashboardLayout>
  );
};
