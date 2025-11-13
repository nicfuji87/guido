// AI dev note: Utilitário para cache e throttling de requisições
// Previne rate limiting (429) e melhora performance

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresIn: number;
};

class RequestCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  /**
   * Busca dados do cache ou executa a requisição
   * @param key - Chave única para identificar a requisição
   * @param fetcher - Função que executa a requisição
   * @param ttl - Tempo de vida do cache em milissegundos (padrão: 30s)
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 30000
  ): Promise<T> {
    // Verificar se há dados válidos no cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
      console.log(`[CACHE] Hit: ${key}`);
      return cached.data as T;
    }

    // Verificar se já existe uma requisição pendente para a mesma chave
    // Isso previne múltiplas requisições simultâneas para o mesmo recurso
    const pending = this.pendingRequests.get(key);
    if (pending) {
      console.log(`[CACHE] Aguardando requisição pendente: ${key}`);
      return pending as Promise<T>;
    }

    // Executar a requisição e armazenar a promise
    console.log(`[CACHE] Miss: ${key} - Executando requisição`);
    const promise = fetcher();
    this.pendingRequests.set(key, promise);

    try {
      const data = await promise;
      
      // Armazenar no cache
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        expiresIn: ttl,
      });

      return data;
    } finally {
      // Remover da lista de pendentes
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Invalida uma entrada específica do cache
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`[CACHE] Invalidado: ${key}`);
  }

  /**
   * Invalida todas as entradas que começam com o prefixo
   */
  invalidateByPrefix(prefix: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`[CACHE] Invalidados ${count} itens com prefixo: ${prefix}`);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    console.log('[CACHE] Cache totalmente limpo');
  }

  /**
   * Remove entradas expiradas do cache
   */
  cleanup(): void {
    const now = Date.now();
    let count = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.expiresIn) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (count > 0) {
      console.log(`[CACHE] Removidas ${count} entradas expiradas`);
    }
  }
}

// Instância global do cache
export const requestCache = new RequestCache();

// Limpar cache expirado a cada 5 minutos
setInterval(() => {
  requestCache.cleanup();
}, 5 * 60 * 1000);

/**
 * Throttle - Limita a frequência de execução de uma função
 * @param func - Função a ser executada
 * @param delay - Delay mínimo entre execuções em ms
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      // Executar imediatamente se passou o delay
      lastCall = now;
      func(...args);
    } else if (!timeout) {
      // Agendar para executar após o delay
      timeout = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeout = null;
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Debounce - Atrasa a execução até que pare de ser chamada
 * @param func - Função a ser executada
 * @param delay - Tempo de espera em ms
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Hook de exemplo para usar cache em queries do Supabase
 */
export function useCachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: { ttl?: number; enabled?: boolean } = {}
) {
  const { ttl = 30000, enabled = true } = options;

  if (!enabled) {
    return queryFn();
  }

  return requestCache.get(key, queryFn, ttl);
}

/**
 * Gera chave de cache baseada em parâmetros
 */
export function generateCacheKey(
  resource: string,
  params?: Record<string, unknown>
): string {
  if (!params) return resource;
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${JSON.stringify(params[key])}`)
    .join('&');
  
  return `${resource}?${sortedParams}`;
}

// Exemplos de uso:
//
// 1. Cache simples:
// const clientes = await requestCache.get(
//   'clientes-list',
//   () => supabase.from('clientes').select('*'),
//   60000 // Cache por 1 minuto
// );
//
// 2. Throttle de evento:
// const handleScroll = throttle(() => {
//   console.log('Scroll detectado');
// }, 200);
//
// 3. Debounce de input:
// const handleSearch = debounce((value: string) => {
//   console.log('Buscando:', value);
// }, 500);
//
// 4. Invalidação de cache:
// requestCache.invalidate('clientes-list');
// requestCache.invalidateByPrefix('clientes-');













