import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MoreVertical, 
  Check, 
  Copy, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ClockIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import { 
  Lembrete, 
  TIPO_LEMBRETE_LABELS, 
  TIPO_LEMBRETE_ICONS, 
  PRIORIDADE_LABELS, 
  PRIORIDADE_COLORS 
} from '@/types/lembretes';

interface LembreteCardProps {
  lembrete: Lembrete;
  onEdit: (lembrete: Lembrete) => void;
  onDelete: (id: string) => void;
  onDuplicate: (lembrete: Lembrete) => void;
  onToggleStatus: (id: string, novoStatus: 'PENDENTE' | 'CONCLUIDO') => void;
  onProrrogar: (id: string, horas: number) => void;
}

export const LembreteCard: React.FC<LembreteCardProps> = ({
  lembrete,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onProrrogar
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dataLembrete = new Date(lembrete.data_lembrete);
  const agora = new Date();
  const isVencido = lembrete.status === 'PENDENTE' && dataLembrete < agora;
  const isProximo = lembrete.status === 'PENDENTE' && dataLembrete <= new Date(agora.getTime() + (2 * 60 * 60 * 1000)); // Próximas 2h
  const isConcluido = lembrete.status === 'CONCLUIDO';

  const formatarData = (data: Date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataFormatada = new Date(data);
    dataFormatada.setHours(0, 0, 0, 0);

    if (dataFormatada.getTime() === hoje.getTime()) {
      return `Hoje às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dataFormatada.getTime() === hoje.getTime() + 24 * 60 * 60 * 1000) {
      return `Amanhã às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dataFormatada.getTime() === hoje.getTime() - 24 * 60 * 60 * 1000) {
      return `Ontem às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return data.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: dataFormatada.getFullYear() !== hoje.getFullYear() ? 'numeric' : undefined,
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const handleToggleStatus = () => {
    const novoStatus = isConcluido ? 'PENDENTE' : 'CONCLUIDO';
    onToggleStatus(lembrete.id, novoStatus);
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-200 cursor-pointer",
      "border-gray-700 bg-gray-800/50 hover:bg-gray-800/80",
      isConcluido && "opacity-75 border-green-700/30 bg-green-900/10",
      isVencido && !isConcluido && "border-red-500/50 bg-red-900/10",
      isProximo && !isConcluido && "border-yellow-500/50 bg-yellow-900/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Conteúdo principal */}
          <div className="flex-1 space-y-2">
            {/* Header com tipo, título e status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">
                {TIPO_LEMBRETE_ICONS[lembrete.tipo_lembrete]}
              </span>
              <h3 className={cn(
                "font-medium flex-1",
                isConcluido ? "text-gray-400 line-through" : "text-white"
              )}>
                {lembrete.titulo}
              </h3>
              
              {/* Badges de prioridade e status */}
              <Badge variant="secondary" className={cn(
                "text-xs px-2 py-1",
                PRIORIDADE_COLORS[lembrete.prioridade]
              )}>
                {PRIORIDADE_LABELS[lembrete.prioridade]}
              </Badge>
              
              {isVencido && !isConcluido && (
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Vencido
                </Badge>
              )}
              
              {isProximo && !isConcluido && (
                <Badge variant="secondary" className="text-yellow-400 bg-yellow-900/20 border-yellow-700/30 text-xs px-2 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Urgente
                </Badge>
              )}
            </div>

            {/* Descrição */}
            <p className={cn(
              "text-sm",
              isConcluido ? "text-gray-500" : "text-gray-300"
            )}>
              {lembrete.descricao}
            </p>

            {/* Informações adicionais */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatarData(dataLembrete)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>{TIPO_LEMBRETE_LABELS[lembrete.tipo_lembrete]}</span>
              </div>
              
              {lembrete.cliente && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{lembrete.cliente.nome}</span>
                </div>
              )}
            </div>

            {/* Data de conclusão se aplicável */}
            {isConcluido && lembrete.data_conclusao && (
              <div className="text-xs text-green-400">
                ✓ Concluído em {new Date(lembrete.data_conclusao).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            {/* Botão de toggle status */}
            <Button
              size="sm"
              variant={isConcluido ? "secondary" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus();
              }}
              className={cn(
                "h-8 w-8 p-0",
                isConcluido 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "hover:bg-gray-700"
              )}
            >
              <Check className="w-4 h-4" />
            </Button>

            {/* Menu de ações */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(lembrete)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onDuplicate(lembrete)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                
                {!isConcluido && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onProrrogar(lembrete.id, 1)}>
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Prorrogar 1h
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onProrrogar(lembrete.id, 24)}>
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Prorrogar 1 dia
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(lembrete.id)}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
