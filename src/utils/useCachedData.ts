// AI dev note: Hook React para usar cache de forma declarativa
// Facilita integração do sistema de cache com componentes React

import { useState, useEffect, useCallback } from 'react';
import { requestCache, generateCacheKey } from './requestCache';

interface UseCachedDataOptions<T> {
  /** Chave do cache (será gerada automaticamente se não fornecida) */
  key?: string;
  /** Tempo de vida do cache em ms (padrão: 30s) */
  ttl?: number;
  /** Se false, não executa a query */
  enabled?: boolean;
  /** Parâmetros para gerar chave automática */
  params?: Record<string, unknown>;
  /** Callback quando dados são carregados */
  onSuccess?: (data: T) => void;
  /** Callback quando há erro */
  onError?: (error: Error) => void;
}

/**
 * Hook para buscar dados com cache automático
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useCachedData(
 *   'clientes',
 *   () => supabase.from('clientes').select('*'),
 *   { ttl: 60000, params: { conta_id } }
 * );
 * ```
 */
export function useCachedData<T>(
  resource: string,
  fetcher: () => Promise<{ data: T | null; error: unknown }>,
  options: UseCachedDataOptions<T> = {}
) {
  const {
    key,
    ttl = 30000,
    enabled = true,
    params,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = key || generateCacheKey(resource, params);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await requestCache.get(
        cacheKey,
        async () => {
          const response = await fetcher();
          if (response.error) {
            throw response.error;
          }
          return response.data;
        },
        ttl
      );

      setData(result as T);
      onSuccess?.(result as T);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, enabled, fetcher, ttl, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    requestCache.invalidate(cacheKey);
    return fetchData();
  }, [cacheKey, fetchData]);

  const invalidate = useCallback(() => {
    requestCache.invalidate(cacheKey);
  }, [cacheKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
  };
}

/**
 * Hook para mutação com invalidação automática de cache
 * 
 * @example
 * ```tsx
 * const { mutate, isLoading } = useCachedMutation(
 *   async (cliente) => supabase.from('clientes').insert(cliente),
 *   {
 *     onSuccess: () => {
 *       toast.success('Cliente criado!');
 *     },
 *     invalidateKeys: ['clientes-list', 'dashboard-metrics']
 *   }
 * );
 * ```
 */
export function useCachedMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ data: TData | null; error: unknown }>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    /** Chaves de cache para invalidar após sucesso */
    invalidateKeys?: string[];
    /** Prefixos de cache para invalidar após sucesso */
    invalidatePrefixes?: string[];
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);
        
        if (result.error) {
          throw result.error;
        }

        // Invalidar cache
        options.invalidateKeys?.forEach(key => {
          requestCache.invalidate(key);
        });

        options.invalidatePrefixes?.forEach(prefix => {
          requestCache.invalidateByPrefix(prefix);
        });

        options.onSuccess?.(result.data as TData, variables);
        
        return result.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        options.onError?.(error, variables);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, options]
  );

  return {
    mutate,
    isLoading,
    error,
  };
}

// Exemplo de uso em componente:
//
// function ClientesPage() {
//   const conta_id = useCurrentContaId();
//   
//   // Query com cache
//   const { 
//     data: clientes, 
//     isLoading, 
//     error,
//     refetch 
//   } = useCachedData(
//     'clientes',
//     () => supabase
//       .from('clientes')
//       .select('*')
//       .eq('conta_id', conta_id),
//     { 
//       ttl: 60000, // 1 minuto
//       params: { conta_id },
//       onSuccess: (data) => {
//         console.log(`${data.length} clientes carregados`);
//       }
//     }
//   );
//
//   // Mutation com invalidação
//   const { mutate: createCliente, isLoading: isCreating } = useCachedMutation(
//     (novoCliente) => supabase
//       .from('clientes')
//       .insert(novoCliente)
//       .select()
//       .single(),
//     {
//       onSuccess: () => {
//         toast.success('Cliente criado!');
//       },
//       invalidatePrefixes: ['clientes'] // Invalida todos os caches que começam com 'clientes'
//     }
//   );
//
//   return (
//     <div>
//       {isLoading && <Loader />}
//       {error && <Error message={error.message} />}
//       {clientes?.map(cliente => (
//         <ClienteCard key={cliente.id} cliente={cliente} />
//       ))}
//       <Button onClick={() => createCliente(formData)}>
//         Criar Cliente
//       </Button>
//     </div>
//   );
// }




















