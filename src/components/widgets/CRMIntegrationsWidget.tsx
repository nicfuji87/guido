import React, { useState, useEffect } from 'react';
import { Building, Key, Plus, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Skeleton } from '@/components/ui';
import { CRMIntegration, CorretorData, CorretorUpdateData } from '@/types/evolution';
import { useViewContext } from '@/hooks/useViewContext';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
// AI dev note: Implementação MD5 real em JavaScript
const md5 = (str: string): string => {
  function md5cycle(x: number[], k: number[]): void {
    let a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  function md51(s: string): number[] {
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  function md5blk(s: string): number[] {
    const md5blks = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i)
        + (s.charCodeAt(i + 1) << 8)
        + (s.charCodeAt(i + 2) << 16)
        + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  function rhex(n: number): string {
    let s = '', j = 0;
    for (; j < 4; j++)
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
        + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
  }

  function hex(x: number[]): string {
    const result: string[] = [];
    for (let i = 0; i < x.length; i++)
      result[i] = rhex(x[i]);
    return result.join('');
  }

  function add32(a: number, b: number): number {
    return (a + b) & 0xFFFFFFFF;
  }

  const hex_chr = '0123456789abcdef'.split('');

  if (str === '') return 'd41d8cd98f00b204e9800998ecf8427e';
  return hex(md51(str));
};

// AI dev note: Widget para gerenciar integrações com CRMs
// Permite adicionar, editar e remover chaves de API dos CRMs do corretor

// AI dev note: CRMs específicos suportados pelo sistema
const SUPPORTED_CRMS = [
  {
    id: 'loft',
    name: 'Loft',
    logo: '/images/partners/Logo-loft-23.png',
    fields: [
      { name: 'key', label: 'Chave de API', type: 'password', required: true },
      { name: 'url', label: 'URL da API', type: 'url', required: true },
      { name: 'id', label: 'ID do Corretor', type: 'text', required: true },
      { name: 'email', label: 'Email da Conta', type: 'email', required: true },
      { name: 'empresa_id', label: 'ID da empresa', type: 'text', required: true }
    ]
  },
  {
    id: 'rd',
    name: 'RD Station',
    logo: '/images/partners/download (1).png',
    fields: [{ name: 'token', label: 'Token de Acesso', type: 'password', required: true }]
  },
  {
    id: 'imoview',
    name: 'Imoview',
    logo: '/images/partners/download.png',
    fields: [
      { name: 'email', label: 'E-mail', type: 'email', required: true },
      { name: 'senha', label: 'Senha', type: 'password', required: true },
      { name: 'chave', label: 'Chave de API', type: 'password', required: true }
    ]
  }
];

interface CRMFormData {
  [key: string]: string;
}

interface CRMSelection {
  crm: typeof SUPPORTED_CRMS[0] | null;
  formData: CRMFormData;
}

export const CRMIntegrationsWidget = () => {
  const { currentCorretor } = useViewContext();
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCRMSelection, setShowCRMSelection] = useState(false);
  const [selectedCRM, setSelectedCRM] = useState<CRMSelection>({
    crm: null,
    formData: {}
  });
  const [error, setError] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [showFormFields, setShowFormFields] = useState<Record<string, boolean>>({});

  // AI dev note: Logs removidos conforme solicitado

  const loadIntegrations = async () => {
    if (!currentCorretor) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // AI dev note: Buscar integrações CRM específicas na tabela corretores (apenas ativos)
      const { data, error: supabaseError } = await supabase
        .from('corretores')
        .select('id, nome, crm, crm_loft_key, crm_loft_url, crm_loft_id, crm_loft_email, crm_loft_empresa_id, crm_rd_key, crm_imoview_email, crm_imoview_senha, crm_imoview_chave')
        .eq('conta_id', currentCorretor.conta_id)
        .is('deleted_at', null)
        .not('crm', 'is', null)
        .order('updated_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }
      
      // AI dev note: Converter dados da tabela corretores para formato de integrações
      const crmIntegrations = data?.map((corretor: CorretorData) => ({
        id: corretor.id as string,
        plataforma: corretor.crm as string,
        chave_api_criptografada: getKeyForCRM(corretor),
        status: 'ATIVA' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) || [];
      
      setIntegrations(crmIntegrations);
    } catch (err) {
      setError('Erro ao carregar integrações CRM');
    } finally {
      setIsLoading(false);
    }
  };

  // AI dev note: Helper para extrair chave apropriada baseada no CRM
  const getKeyForCRM = (corretor: CorretorData) => {
    switch (corretor.crm) {
      case 'loft':
        return corretor.crm_loft_key || '***';
      case 'rd':
        return corretor.crm_rd_key || '***';
      case 'imoview':
        return corretor.crm_imoview_email || '***';
      default:
        return '***';
    }
  };

  const addIntegration = async () => {
    if (!currentCorretor || !selectedCRM.crm) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // AI dev note: Validar campos obrigatórios
      const missingFields = selectedCRM.crm.fields
        .filter(field => field.required && !selectedCRM.formData[field.name])
        .map(field => field.label);

      if (missingFields.length > 0) {
        const error = `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`;
        setError(error);
        return;
      }

      // AI dev note: Preparar dados para atualização na tabela clientes
      const updateData: CorretorUpdateData = {
        crm: selectedCRM.crm.id,
        updated_at: new Date().toISOString()
      };

      // AI dev note: Mapear campos específicos para cada CRM
      switch (selectedCRM.crm.id) {
        case 'loft':
          updateData.crm_loft_key = selectedCRM.formData.key;
          updateData.crm_loft_url = selectedCRM.formData.url;
          updateData.crm_loft_id = selectedCRM.formData.id;
          updateData.crm_loft_email = selectedCRM.formData.email;
          updateData.crm_loft_empresa_id = selectedCRM.formData.empresa_id || undefined;
          break;
        case 'rd':
          updateData.crm_rd_key = selectedCRM.formData.token;
          break;
        case 'imoview':
          updateData.crm_imoview_email = selectedCRM.formData.email;
          // AI dev note: Criptografar senha em MD5 conforme solicitado
          updateData.crm_imoview_senha = md5(selectedCRM.formData.senha);
          updateData.crm_imoview_chave = selectedCRM.formData.chave;
          break;
      }

      // AI dev note: Atualizar o corretor atual com as configurações do CRM
      const { error: supabaseError } = await supabase
        .from('corretores')
        .update(updateData)
        .eq('id', currentCorretor.id)
        .select();

      if (supabaseError) {
        throw supabaseError;
      }
      
      // AI dev note: Recarregar integrações para mostrar a nova
      await loadIntegrations();
      
      // Reset form
      setSelectedCRM({ crm: null, formData: {} });
      setShowAddForm(false);
      setShowCRMSelection(false);
      
    } catch (err) {
      setError('Erro ao adicionar integração CRM');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // AI dev note: Remover CRM do corretor (limpar campos relacionados)
      const { error: supabaseError } = await supabase
        .from('corretores')
        .update({
          crm: null,
          crm_loft_key: null,
          crm_loft_url: null,
          crm_loft_id: null,
          crm_loft_email: null,
          crm_loft_empresa_id: null,
          crm_rd_key: null,
          crm_imoview_email: null,
          crm_imoview_senha: null,
          crm_imoview_chave: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }
      
      setIntegrations(prev => prev.filter(integration => integration.id !== id));
    } catch (err) {
      setError('Erro ao deletar integração CRM');
    } finally {
      setIsLoading(false);
    }
  };

  // AI dev note: Funções para manipular seleção de CRM
  const handleCRMSelect = (crm: typeof SUPPORTED_CRMS[0]) => {
    setSelectedCRM({
      crm,
      formData: {}
    });
    setShowCRMSelection(false);
    setShowAddForm(true);
  };

  const handleFormDataChange = (fieldName: string, value: string) => {
    setSelectedCRM(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [fieldName]: value
      }
    }));
  };

  const resetForm = () => {
    setSelectedCRM({ crm: null, formData: {} });
    setShowAddForm(false);
    setShowCRMSelection(false);
    setShowFormFields({});
    setError(null);
  };

  const toggleFormFieldVisibility = (fieldName: string) => {
    setShowFormFields(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
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

      {/* CRM Selection Modal */}
      {showCRMSelection && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
                <Building className="w-5 h-5" />
                Escolha seu CRM
            </CardTitle>
              <Button
                onClick={() => setShowCRMSelection(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUPPORTED_CRMS.map((crm) => (
                <div
                  key={crm.id}
                  onClick={() => handleCRMSelect(crm)}
                  className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-gray-700/50 transition-all"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <img
                      src={crm.logo}
                      alt={crm.name}
                      className="h-12 w-auto object-contain"
                      onError={(e) => {
                        // Fallback se imagem não carregar
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="text-center">
                      <h3 className="font-medium text-white">{crm.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {crm.fields.length} campo{crm.fields.length > 1 ? 's' : ''} obrigatório{crm.fields.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CRM Configuration Form */}
      {showAddForm && selectedCRM.crm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <img
                  src={selectedCRM.crm.logo}
                  alt={selectedCRM.crm.name}
                  className="h-6 w-auto object-contain"
                />
                Configurar {selectedCRM.crm.name}
              </CardTitle>
              <Button
                onClick={resetForm}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCRM.crm.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-gray-300">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
              </Label>
                <div className="relative">
              <Input
                    id={field.name}
                    type={showFormFields[field.name] ? 'text' : field.type}
                    value={selectedCRM.formData[field.name] || ''}
                    onChange={(e) => handleFormDataChange(field.name, e.target.value)}
                    placeholder={`Digite ${field.label.toLowerCase()}`}
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    required={field.required}
                  />
                  {(field.type === 'password' || field.type === 'email' || field.type === 'url') && (
                    <Button
                      type="button"
                      onClick={() => toggleFormFieldVisibility(field.name)}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto text-gray-400 hover:text-white"
                    >
                      {showFormFields[field.name] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
            </div>
            ))}
            
            <div className="flex gap-2 pt-4">
              <Button
                onClick={addIntegration}
                disabled={isLoading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isLoading ? 'Salvando...' : 'Salvar Integração'}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Integration Button */}
      {!showAddForm && !showCRMSelection && integrations.length === 0 && (
        <Button
          onClick={() => setShowCRMSelection(true)}
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
                      {/* AI dev note: Mostrar logo do CRM se disponível */}
                      {SUPPORTED_CRMS.find(crm => crm.id === integration.plataforma)?.logo ? (
                        <img
                          src={SUPPORTED_CRMS.find(crm => crm.id === integration.plataforma)?.logo}
                          alt={integration.plataforma}
                          className="h-6 w-auto object-contain"
                        />
                      ) : (
                      <Building className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {SUPPORTED_CRMS.find(crm => crm.id === integration.plataforma)?.name || integration.plataforma}
                      </h3>
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
      ) : null}
    </div>
  );
};
