import React from 'react';
import { TrendingUp, TrendingDown, Users, MessageSquare, Target, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/components/ui';
import { MetricasPessoais } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

// AI dev note: Widget para mostrar métricas pessoais do corretor
// KPIs principais: novos clientes, respostas, conversão, tempo de resposta

interface MetricasPessoaisWidgetProps {
  metricas: MetricasPessoais;
  isLoading?: boolean;
  timeRange?: '7d' | '30d' | '90d';
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  format?: 'number' | 'percentage' | 'currency' | 'time';
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend, 
  subtitle,
  format = 'number'
}: MetricCardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(val);
      case 'time':
        return val < 1 ? 
          `${Math.round(val * 60)}min` : 
          `${val.toFixed(1)}h`;
      default:
        return val.toLocaleString('pt-BR');
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value)}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              getTrendColor()
            )}>
              {getTrendIcon()}
              <span>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const MetricasPessoaisWidget = ({ 
  metricas, 
  isLoading,
  timeRange = '30d' 
}: MetricasPessoaisWidgetProps) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d':
        return 'últimos 7 dias';
      case '30d':
        return 'últimos 30 dias';
      case '90d':
        return 'últimos 90 dias';
      default:
        return 'últimos 30 dias';
    }
  };

  // Calcular trends (simulado - seria baseado em dados históricos)
  const getTrend = (value: number, metricType: string): 'up' | 'down' | 'neutral' => {
    // Simulação baseada em valores típicos
    const trends: Record<string, 'up' | 'down' | 'neutral'> = {
      clientes: value > 5 ? 'up' : value < 2 ? 'down' : 'neutral',
      respostas: value > 50 ? 'up' : value < 20 ? 'down' : 'neutral',
      conversao: value > 15 ? 'up' : value < 5 ? 'down' : 'neutral',
      tempo: value < 2 ? 'up' : value > 8 ? 'down' : 'neutral'
    };
    return trends[metricType] || 'neutral';
  };

  const getChange = (value: number, metricType: string) => {
    // Simulação de mudança percentual
    const baseChanges = {
      clientes: Math.random() * 40 - 20, // -20% a +20%
      respostas: Math.random() * 30 - 15,
      conversao: Math.random() * 50 - 25,
      tempo: Math.random() * 60 - 30
    };
    return baseChanges[metricType as keyof typeof baseChanges] || 0;
  };

  const metrics = [
    {
      title: 'Novos Clientes',
      value: metricas.novosClientes,
      icon: Users,
      trend: getTrend(metricas.novosClientes, 'clientes'),
      change: getChange(metricas.novosClientes, 'clientes'),
      subtitle: getTimeRangeLabel()
    },
    {
      title: 'Respostas Enviadas',
      value: metricas.respostasEnviadas,
      icon: MessageSquare,
      trend: getTrend(metricas.respostasEnviadas, 'respostas'),
      change: getChange(metricas.respostasEnviadas, 'respostas'),
      subtitle: getTimeRangeLabel()
    },
    {
      title: 'Taxa de Conversão',
      value: metricas.taxaConversao,
      icon: Target,
      trend: getTrend(metricas.taxaConversao, 'conversao'),
      change: getChange(metricas.taxaConversao, 'conversao'),
      format: 'percentage' as const,
      subtitle: 'leads → negócios'
    },
    {
      title: 'Tempo Médio de Resposta',
      value: metricas.tempoMedioResposta,
      icon: Clock,
      trend: getTrend(metricas.tempoMedioResposta, 'tempo'),
      change: getChange(metricas.tempoMedioResposta, 'tempo'),
      format: 'time' as const,
      subtitle: 'primeira resposta'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Suas Métricas</h3>
        <span className="text-sm text-muted-foreground capitalize">
          {getTimeRangeLabel()}
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            change={metric.change}
            subtitle={metric.subtitle}
            format={metric.format}
          />
        ))}
      </div>

      {/* Insights rápidos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Destaque</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {metricas.taxaConversao > 15 ? 
              'Excelente taxa de conversão! Continue assim.' :
              metricas.novosClientes > 10 ?
              'Ótimo número de novos clientes este período.' :
              'Foque em melhorar o tempo de resposta para aumentar a conversão.'
            }
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Próximo Objetivo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {metricas.tempoMedioResposta > 4 ?
              'Reduza o tempo de resposta para menos de 2 horas.' :
              metricas.taxaConversao < 10 ?
              'Melhore a qualificação dos leads para aumentar conversão.' :
              'Mantenha a consistência e busque novos canais de aquisição.'
            }
          </p>
        </Card>
      </div>
    </div>
  );
};

