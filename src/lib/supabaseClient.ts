// AI dev note: Apenas usar a chave anon no cliente. Nunca usar service_role aqui.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Validar se as variáveis de ambiente estão definidas
if (!supabaseUrl) {
  throw new Error('Missing env var: VITE_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env var: VITE_SUPABASE_ANON_KEY')
}

// Configuração otimizada do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  localStorage: localStorage,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})


