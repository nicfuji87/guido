import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, Trash2, Shield, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from '@/hooks/useViewContext';

interface MembroEquipe {
  id: string;
  nome: string;
  email: string;
  funcao: 'DONO' | 'ADMIN' | 'AGENTE';
  created_at: string;
  cpf?: string;
}

export const EquipeSection: React.FC = () => {
  const { currentCorretor } = useViewContext();
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<{
    nome: string;
    email: string;
    funcao: 'AGENTE' | 'ADMIN';
  }>({
    nome: '',
    email: '',
    funcao: 'AGENTE'
  });

  const carregarMembros = useCallback(async () => {
    if (!currentCorretor?.conta_id) return;

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('corretores')
        .select('id, nome, email, funcao, created_at, cpf')
        .eq('conta_id', currentCorretor.conta_id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setMembros(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar equipe');
    } finally {
      setIsLoading(false);
    }
  }, [currentCorretor?.conta_id]);

  useEffect(() => {
    carregarMembros();
  }, [currentCorretor?.conta_id, carregarMembros]);

  const getRoleLabel = (role: string) => {
    const roles = {
      'DONO': { label: 'Proprietário', color: 'bg-purple-900/20 text-purple-400 border-purple-700/30' },
      'ADMIN': { label: 'Administrador', color: 'bg-blue-900/20 text-blue-400 border-blue-700/30' },
      'AGENTE': { label: 'Corretor', color: 'bg-green-900/20 text-green-400 border-green-700/30' }
    };
    return roles[role as keyof typeof roles] || { label: role, color: 'bg-gray-900/20 text-gray-400 border-gray-700/30' };
  };

  const handleAddMember = async () => {
    if (!newMember.nome || !newMember.email) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      // TODO: Implementar convite de membro
      // Por enquanto, apenas mostrar uma mensagem
      alert('Funcionalidade de convite será implementada em breve!');
      setShowAddForm(false);
      setNewMember({ nome: '', email: '', funcao: 'AGENTE' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao convidar membro');
    }
  };

  const handleRemoveMember = async (_membroId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este membro da equipe?')) {
      return;
    }

    try {
      // TODO: Implementar remoção de membro
      alert('Funcionalidade de remoção será implementada em breve!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover membro');
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Gerenciar Equipe</h3>
              <p className="text-sm text-gray-400">
                {membros.length} {membros.length === 1 ? 'membro' : 'membros'} na equipe
              </p>
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Convidar Membro
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Formulário de adicionar membro */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-4">Convidar Novo Membro</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="nome" className="text-white">Nome *</Label>
                <Input
                  id="nome"
                  value={newMember.nome}
                  onChange={(e) => setNewMember(prev => ({ ...prev, nome: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Nome do corretor"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="funcao" className="text-white">Função</Label>
                <select
                  id="funcao"
                  value={newMember.funcao}
                  onChange={(e) => setNewMember(prev => ({ ...prev, funcao: e.target.value as 'AGENTE' | 'ADMIN' }))}
                  className="w-full h-10 px-3 bg-gray-800 border border-gray-600 text-white rounded-md"
                >
                  <option value="AGENTE">Corretor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddMember}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Enviar Convite
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de membros */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 bg-gray-900/50 rounded-lg">
                  <Skeleton className="h-6 w-1/3 bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </div>
              ))}
            </>
          ) : membros.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum membro na equipe ainda</p>
            </div>
          ) : (
            membros.map((membro) => {
              const roleInfo = getRoleLabel(membro.funcao);
              const isCurrentUser = membro.id === currentCorretor?.id;
              
              return (
                <div
                  key={membro.id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {membro.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium">{membro.nome}</h4>
                        {isCurrentUser && (
                          <Badge className="bg-blue-900/20 text-blue-400 border-blue-700/30 text-xs">
                            Você
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {membro.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          {roleInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${roleInfo.color} text-xs px-3 py-1`}>
                      {roleInfo.label}
                    </Badge>
                    
                    {!isCurrentUser && membro.funcao !== 'DONO' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveMember(membro.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 p-4 bg-indigo-900/10 border border-indigo-700/30 rounded-lg">
          <h4 className="text-indigo-400 font-medium mb-2">👥 Gestão de Equipe</h4>
          <ul className="text-sm text-indigo-300 space-y-1">
            <li>• <strong>Proprietário:</strong> Acesso total, incluindo cobrança e configurações</li>
            <li>• <strong>Administrador:</strong> Pode gerenciar equipe e configurações da empresa</li>
            <li>• <strong>Corretor:</strong> Acesso aos próprios clientes e conversas</li>
            <li>• Convites são enviados por e-mail com link de ativação</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
