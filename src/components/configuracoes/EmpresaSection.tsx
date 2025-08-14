import React, { useState } from 'react';
import { Building2, Save, Edit, Globe, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { ConfiguracaoEmpresa } from '@/types/configuracoes';

interface EmpresaSectionProps {
  empresa: ConfiguracaoEmpresa;
  onSalvar: (empresa: Partial<ConfiguracaoEmpresa>) => Promise<boolean>;
  isLoading?: boolean;
}

export const EmpresaSection: React.FC<EmpresaSectionProps> = ({
  empresa,
  onSalvar,
  isLoading = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmpresa, setEditedEmpresa] = useState<ConfiguracaoEmpresa>(empresa);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedEmpresa(empresa);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedEmpresa(empresa);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const sucesso = await onSalvar(editedEmpresa);
    if (sucesso) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleChange = (field: keyof ConfiguracaoEmpresa, value: string) => {
    setEditedEmpresa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Dados da Empresa</h3>
              <p className="text-sm text-gray-400">Informações da imobiliária</p>
            </div>
          </div>
          
          {!isEditing ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              disabled={isLoading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome da Empresa */}
          <div className="space-y-2">
            <Label htmlFor="nomeEmpresa" className="text-white">
              Nome da Empresa *
            </Label>
            {isEditing ? (
              <Input
                id="nomeEmpresa"
                value={editedEmpresa.nomeEmpresa}
                onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="Imobiliária ABC Ltda"
                disabled={isSaving}
              />
            ) : (
              <div className="p-3 bg-gray-900/50 rounded-md text-white">
                {empresa.nomeEmpresa || 'Não informado'}
              </div>
            )}
          </div>

          {/* CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="text-white">
              CNPJ
            </Label>
            {isEditing ? (
              <Input
                id="cnpj"
                value={editedEmpresa.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="00.000.000/0001-00"
                disabled={isSaving}
              />
            ) : (
              <div className="p-3 bg-gray-900/50 rounded-md text-white">
                {empresa.cnpj || 'Não informado'}
              </div>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefoneEmpresa" className="text-white">
              Telefone Comercial
            </Label>
            {isEditing ? (
              <Input
                id="telefoneEmpresa"
                value={editedEmpresa.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="(11) 3000-0000"
                disabled={isSaving}
              />
            ) : (
              <div className="p-3 bg-gray-900/50 rounded-md text-white">
                {empresa.telefone || 'Não informado'}
              </div>
            )}
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <Label htmlFor="emailEmpresa" className="text-white">
              E-mail Comercial
            </Label>
            {isEditing ? (
              <Input
                id="emailEmpresa"
                value={editedEmpresa.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="contato@imobiliaria.com.br"
                disabled={isSaving}
              />
            ) : (
              <div className="p-3 bg-gray-900/50 rounded-md text-white">
                {empresa.email || 'Não informado'}
              </div>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-white flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </Label>
            {isEditing ? (
              <Input
                id="website"
                value={editedEmpresa.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="https://www.imobiliaria.com.br"
                disabled={isSaving}
              />
            ) : (
              <div className="p-3 bg-gray-900/50 rounded-md text-white">
                {empresa.website ? (
                  <a 
                    href={empresa.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {empresa.website}
                  </a>
                ) : (
                  'Não informado'
                )}
              </div>
            )}
          </div>

          {/* CRECI da Empresa */}
          <div className="space-y-2">
            <Label htmlFor="creciEmpresa" className="text-white">
              CRECI da Empresa
            </Label>
            {isEditing ? (
              <Input
                id="creciEmpresa"
                value={editedEmpresa.creciEmpresa || ''}
                onChange={(e) => handleChange('creciEmpresa', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="CRECI/SP 123456-J"
                disabled={isSaving}
              />
            ) : (
              <div className="p-3 bg-gray-900/50 rounded-md text-white">
                {empresa.creciEmpresa || 'Não informado'}
              </div>
            )}
          </div>
        </div>

        {/* Endereço - Campo maior */}
        <div className="mt-6 space-y-2">
          <Label htmlFor="endereco" className="text-white flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Endereço Comercial
          </Label>
          {isEditing ? (
            <Textarea
              id="endereco"
              value={editedEmpresa.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              className="bg-gray-900 border-gray-600 text-white min-h-[80px]"
              placeholder="Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01000-000"
              disabled={isSaving}
            />
          ) : (
            <div className="p-3 bg-gray-900/50 rounded-md text-white min-h-[80px]">
              {empresa.endereco || 'Não informado'}
            </div>
          )}
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 p-4 bg-green-900/10 border border-green-700/30 rounded-lg">
          <h4 className="text-green-400 font-medium mb-2">🏢 Informações da Empresa</h4>
          <ul className="text-sm text-green-300 space-y-1">
            <li>• Estes dados aparecem em relatórios e documentos oficiais</li>
            <li>• O CRECI da empresa é obrigatório para atividades imobiliárias</li>
            <li>• Mantenha as informações atualizadas para conformidade legal</li>
            <li>• O website ajuda na credibilidade profissional</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
