import React from 'react';
import { Search, Users, Filter, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Input, Skeleton } from '@/components/ui';
import { ClienteCard } from '@/components/clientes/ClienteCard';
import { useClientesData } from '@/hooks/useClientesData';

// AI dev note: Página principal da seção Clientes
// Lista todos os clientes com busca inteligente e acesso ao detalhamento

export const ClientesPage: React.FC = () => {
  const { 
    clientes, 
    isLoading, 
    error, 
    searchTerm, 
    setSearchTerm 
  } = useClientesData();

  const isFiltered = searchTerm.length >= 3;
  const totalClientes = clientes.length;

  if (error) {
    return (
      <DashboardLayout title="Clientes">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Erro ao carregar clientes</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Clientes">
      <div className="space-y-6 p-6">
        {/* Header com busca */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Lista de Clientes</h1>
              <p className="text-gray-400">
                {isLoading ? 'Carregando...' : `${totalClientes} cliente${totalClientes !== 1 ? 's' : ''} encontrado${totalClientes !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {/* Campo de busca */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Indicador de filtro ativo */}
        {isFiltered && (
          <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-700/30">
            <Filter className="w-4 h-4" />
            <span>Filtrando por: "{searchTerm}"</span>
            <button 
              onClick={() => setSearchTerm('')}
              className="ml-2 text-blue-300 hover:text-white transition-colors"
            >
              Limpar
            </button>
          </div>
        )}

        {/* Lista de clientes */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full bg-gray-700" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2 bg-gray-700" />
                    <Skeleton className="h-4 w-24 bg-gray-700" />
                  </div>
                  <Skeleton className="h-6 w-20 bg-gray-700" />
                </div>
                <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-4 bg-gray-700" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 bg-gray-700" />
                  <Skeleton className="h-6 w-20 bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : clientes.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {isFiltered ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {isFiltered 
                ? 'Tente ajustar os termos de busca para encontrar o cliente desejado.'
                : 'Quando novos clientes forem adicionados via WhatsApp, eles aparecerão aqui.'
              }
            </p>
            {isFiltered && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Ver todos os clientes
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clientes.map((cliente) => (
              <ClienteCard key={cliente.id} cliente={cliente} />
            ))}
          </div>
        )}

        {/* Estatísticas da busca */}
        {!isLoading && clientes.length > 0 && isFiltered && (
          <div className="text-center py-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Mostrando {clientes.length} resultado{clientes.length !== 1 ? 's' : ''} para "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
