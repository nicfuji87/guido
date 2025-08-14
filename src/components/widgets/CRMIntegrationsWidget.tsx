import React, { useState, useEffect } from 'react';
import { Building, Key, Plus, Trash2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Skeleton } from '@/components/ui';
import { CRMIntegration } from '@/types/evolution';
import { useViewContext } from '@/hooks/useViewContext';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

// AI dev note: Widget para gerenciar integrações com CRMs
// Permite adicionar, editar e remover chaves de API dos CRMs do corretor

interface NewCRMForm {
  plataforma: string;
  chave_api: string;
}

export const CRMIntegrationsWidget = () => {
  const { currentCorretor } = useViewContext();
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [newCRM, setNewCRM] = useState<NewCRMForm>({ plataforma: '', chave_api: '' });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // Plataformas CRM comuns para o mercado imobiliário
  const crmPlatforms = [
    'Immobile',
    'VistaSoft', 
    'SuperLogica',
    'Arbo',
    'Jetimob',
    'Apolar',
    'Outros'
  ];

  const loadIntegrations = async () => {
    if (!currentCorretor) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('conexoes_externas')
        .select('*')
        .eq('conta_id', currentCorretor.conta_id)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      
      setIntegrations(data || []);
    } catch (err) {
      // console.error('Erro ao carregar integrações:', err);
      setError('Erro ao carregar integrações CRM');
    } finally {
      setIsLoading(false);
    }
  };

  const addIntegration = async () => {
    if (!currentCorretor || !newCRM.plataforma || !newCRM.chave_api) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('conexoes_externas')
        .insert({
          conta_id: currentCorretor.conta_id,
          plataforma: newCRM.plataforma,
          chave_api_criptografada: newCRM.chave_api, // TODO: Criptografar no backend
          status: 'ATIVA'
        })
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      setIntegrations(prev => [data, ...prev]);
      setNewCRM({ plataforma: '', chave_api: '' });
      setShowAddForm(false);
    } catch (err) {
      // console.error('Erro ao adicionar integração:', err);
      setError('Erro ao adicionar integração CRM');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: supabaseError } = await supabase
        .from('conexoes_externas')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      
      setIntegrations(prev => prev.filter(integration => integration.id !== id));
    } catch (err) {
      // console.error('Erro ao deletar integração:', err);
      setError('Erro ao deletar integração CRM');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '***';
    return key.substring(0, 4) + '***' + key.substring(key.length - 4);
  };

  useEffect(() => {
    loadIntegrations();
  }, [currentCorretor]); // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'ERRO_AUTENTICACAO':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return 'Conectado';
      case 'ERRO_AUTENTICACAO':
        return 'Erro de autenticação';
      case 'INATIVA':
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return 'text-green-400';
      case 'ERRO_AUTENTICACAO':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Add New Integration */}
      {showAddForm ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Integração CRM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plataforma" className="text-gray-300">
                Plataforma CRM
              </Label>
              <select
                id="plataforma"
                value={newCRM.plataforma}
                onChange={(e) => setNewCRM(prev => ({ ...prev, plataforma: e.target.value }))}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Selecione uma plataforma</option>
                {crmPlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
            
            {newCRM.plataforma === 'Outros' && (
              <div className="space-y-2">
                <Label htmlFor="plataforma-custom" className="text-gray-300">
                  Nome da Plataforma
                </Label>
                <Input
                  id="plataforma-custom"
                  value={newCRM.plataforma}
                  onChange={(e) => setNewCRM(prev => ({ ...prev, plataforma: e.target.value }))}
                  placeholder="Digite o nome da plataforma"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="chave-api" className="text-gray-300">
                Chave da API
              </Label>
              <Input
                id="chave-api"
                type="password"
                value={newCRM.chave_api}
                onChange={(e) => setNewCRM(prev => ({ ...prev, chave_api: e.target.value }))}
                placeholder="Cole sua chave de API aqui"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={addIntegration}
                disabled={isLoading || !newCRM.plataforma || !newCRM.chave_api}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isLoading ? 'Salvando...' : 'Salvar Integração'}
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewCRM({ plataforma: '', chave_api: '' });
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Integração CRM
        </Button>
      )}

      {/* Existing Integrations */}
      {isLoading && integrations.length === 0 ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full bg-gray-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : integrations.length > 0 ? (
        <div className="space-y-3">
          {integrations.map(integration => (
            <Card key={integration.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{integration.plataforma}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(integration.status)}
                        <span className={cn('text-sm', getStatusColor(integration.status))}>
                          {getStatusText(integration.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-md">
                      <Key className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-300 font-mono">
                        {showKeys[integration.id] 
                          ? integration.chave_api_criptografada 
                          : maskApiKey(integration.chave_api_criptografada)
                        }
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleKeyVisibility(integration.id)}
                        className="p-1 h-auto text-gray-400 hover:text-white"
                      >
                        {showKeys[integration.id] ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteIntegration(integration.id)}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-white font-medium mb-2">Nenhuma integração CRM</h3>
            <p className="text-gray-400 text-sm mb-4">
              Adicione integrações com seus CRMs para sincronizar dados automaticamente.
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-900/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Integração
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
