import "server-only";

/**
 * O projeto v1 era Vite e deixou VITE_SUPABASE_* configuradas na Vercel.
 * Aceitamos as duas grafias para que o site funcione sem depender de alguém
 * lembrar de recadastrar variável no painel antes de um evento.
 */
export function credenciaisSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const chave =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY;
  return { url, chave };
}
