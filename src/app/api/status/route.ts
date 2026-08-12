import { NextResponse } from "next/server";
import { credenciaisSupabase } from "@/lib/supabase-env";

export const dynamic = "force-dynamic";

/**
 * Diz se a lista de espera consegue mesmo gravar, sem expor URL nem chave.
 * Existe para ser conferido minutos antes de um evento: se os dois campos
 * não estiverem "ok", ninguém que se cadastrar vai ser salvo.
 */
export async function GET() {
  const { url, chave } = credenciaisSupabase();

  if (!url || !chave) {
    return NextResponse.json(
      {
        pronto: false,
        credenciais: "faltando",
        tabela: "nao verificada",
        proximoPasso:
          "Configurar NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.",
      },
      { status: 503 },
    );
  }

  try {
    // Com RLS ligada e sem policy de SELECT, a tabela existente devolve lista
    // vazia. Se ela não existir, o PostgREST devolve 404.
    const r = await fetch(`${url}/rest/v1/g_waitlist?select=id&limit=1`, {
      headers: { apikey: chave, Authorization: `Bearer ${chave}` },
      cache: "no-store",
    });

    const tabelaExiste = r.status !== 404;

    return NextResponse.json(
      {
        pronto: tabelaExiste,
        credenciais: "ok",
        tabela: tabelaExiste ? "ok" : "ausente",
        proximoPasso: tabelaExiste
          ? null
          : "Rodar supabase/migrations/0002_lista_de_espera.sql no SQL editor.",
      },
      { status: tabelaExiste ? 200 : 503 },
    );
  } catch {
    return NextResponse.json(
      { pronto: false, credenciais: "ok", tabela: "inacessivel" },
      { status: 503 },
    );
  }
}
