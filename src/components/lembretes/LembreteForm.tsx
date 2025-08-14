import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { NativeSelect } from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { useClientesData } from '@/hooks/useClientesData';
import { 
  Lembrete, 
  CreateLembreteData, 
  TipoLembrete, 
  PrioridadeLembrete,
  TIPO_LEMBRETE_LABELS,
  PRIORIDADE_LABELS 
} from '@/types/lembretes';

interface LembreteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLembreteData) => Promise<boolean>;
  lembrete?: Lembrete | null; // Para edição
  isLoading?: boolean;
}

export const LembreteForm: React.FC<LembreteFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lembrete,
  isLoading = false
}) => {
  const { clientes } = useClientesData();
  const [formData, setFormData] = useState<CreateLembreteData>({
    cliente_id: '',
    titulo: '',
    descricao: '',
    data_lembrete: '',
    tipo_lembrete: 'GERAL',
    prioridade: 'MEDIA'
  });

  // Preencher formulário se for edição
  useEffect(() => {
    if (lembrete) {
      // Converter a data para o formato do input datetime-local
      const dataFormatada = new Date(lembrete.data_lembrete).toISOString().slice(0, 16);
      
      setFormData({
        cliente_id: lembrete.cliente_id || '',
        titulo: lembrete.titulo,
        descricao: lembrete.descricao,
        data_lembrete: dataFormatada,
        tipo_lembrete: lembrete.tipo_lembrete,
        prioridade: lembrete.prioridade
      });
    } else {
      // Limpar formulário para novo lembrete
      const agora = new Date();
      agora.setMinutes(agora.getMinutes() + 60); // 1 hora no futuro por padrão
      const dataDefault = agora.toISOString().slice(0, 16);
      
      setFormData({
        cliente_id: '',
        titulo: '',
        descricao: '',
        data_lembrete: dataDefault,
        tipo_lembrete: 'GERAL',
        prioridade: 'MEDIA'
      });
    }
  }, [lembrete, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.titulo.trim()) {
      alert('Por favor, insira um título para o lembrete');
      return;
    }
    
    if (!formData.data_lembrete) {
      alert('Por favor, defina uma data e hora para o lembrete');
      return;
    }

    // Converter data para ISO string
    const dataSubmit = {
      ...formData,
      cliente_id: formData.cliente_id || undefined, // Converter string vazia para undefined
      data_lembrete: new Date(formData.data_lembrete).toISOString()
    };

    const sucesso = await onSubmit(dataSubmit);
    if (sucesso) {
      onClose();
    }
  };

  const handleChange = (field: keyof CreateLembreteData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {lembrete ? 'Editar Lembrete' : 'Novo Lembrete'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {lembrete 
              ? 'Atualize as informações do lembrete'
              : 'Crie um novo lembrete que será enviado via WhatsApp no horário escolhido'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-white">
              Título *
            </Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              placeholder="Ex: Follow-up com cliente João"
              className="bg-gray-800 border-gray-700 text-white"
              disabled={isLoading}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-white">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Detalhes sobre o que precisa ser feito..."
              className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
              disabled={isLoading}
            />
          </div>

          {/* Cliente (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="cliente" className="text-white">
              Cliente (opcional)
            </Label>
            <NativeSelect
              value={formData.cliente_id || ''}
              onValueChange={(value: string) => handleChange('cliente_id', value)}
              disabled={isLoading}
              className="bg-gray-800 border-gray-700 text-white"
            >
              <option value="">Selecione um cliente (opcional)</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* Data e Hora */}
          <div className="space-y-2">
            <Label htmlFor="data_lembrete" className="text-white">
              Data e Hora *
            </Label>
            <Input
              id="data_lembrete"
              type="datetime-local"
              value={formData.data_lembrete}
              onChange={(e) => handleChange('data_lembrete', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              disabled={isLoading}
            />
          </div>

          {/* Tipo de Lembrete */}
          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-white">
              Tipo de Lembrete
            </Label>
            <NativeSelect
              value={formData.tipo_lembrete}
              onValueChange={(value: string) => handleChange('tipo_lembrete', value as TipoLembrete)}
              disabled={isLoading}
              className="bg-gray-800 border-gray-700 text-white"
            >
              {Object.entries(TIPO_LEMBRETE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* Prioridade */}
          <div className="space-y-2">
            <Label htmlFor="prioridade" className="text-white">
              Prioridade
            </Label>
            <NativeSelect
              value={formData.prioridade}
              onValueChange={(value: string) => handleChange('prioridade', value as PrioridadeLembrete)}
              disabled={isLoading}
              className="bg-gray-800 border-gray-700 text-white"
            >
              {Object.entries(PRIORIDADE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Salvando...' : (lembrete ? 'Atualizar' : 'Criar Lembrete')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
