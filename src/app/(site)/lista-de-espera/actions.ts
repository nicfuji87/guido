"use server";

export type EstadoLista =
  | { status: "inicial" }
  | { status: "ok" }
  | { status: "erro"; mensagem: string; campo?: string };

const PERFIS = ["autonomo", "imobiliaria"] as const;

/** Deixa só dígitos e valida como celular brasileiro com DDD. */
function normalizarWhatsapp(bruto: string): string | null {
  const digitos = bruto.replace(/\D/g, "").replace(/^0+/, "");
  const comDdi = digitos.length <= 11 ? `55${digitos}` : digitos;
  if (!/^55[1-9]{2}9?[0-9]{8}$/.test(comDdi)) return null;
  return comDdi;
}

export async function entrarNaLista(
  _anterior: EstadoLista,
  form: FormData,
): Promise<EstadoLista> {
  // Armadilha para robô: campo escondido que só bot preenche.
  if (String(form.get("empresa") ?? "").trim() !== "") {
    return { status: "ok" };
  }

  const nome = String(form.get("nome") ?? "").trim();
  const whatsappBruto = String(form.get("whatsapp") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const perfil = String(form.get("perfil") ?? "").trim();

  if (nome.length < 2) {
    return { status: "erro", mensagem: "Escreva seu nome.", campo: "nome" };
  }

  const whatsapp = normalizarWhatsapp(whatsappBruto);
  if (!whatsapp) {
    return {
      status: "erro",
      mensagem: "Confira o WhatsApp — precisa ter DDD.",
      campo: "whatsapp",
    };
  }

  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "erro", mensagem: "Confira o e-mail.", campo: "email" };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !chave) {
    // Sem banco configurado, é melhor gritar no log do servidor do que
    // engolir o cadastro e o corretor achar que entrou na lista.
    console.error("[lista-de-espera] Supabase não configurado no ambiente.");
    return {
      status: "erro",
      mensagem: "Não consegui salvar agora. Tente de novo em instantes.",
    };
  }

  try {
    const resposta = await fetch(`${url}/rest/v1/g_waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: chave,
        Authorization: `Bearer ${chave}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        nome,
        whatsapp,
        email: email || null,
        perfil: PERFIS.includes(perfil as (typeof PERFIS)[number])
          ? perfil
          : null,
        origem: String(form.get("origem") ?? "site").slice(0, 40),
      }),
    });

    // 23505 = índice único. Já está na lista, então isso é sucesso, não erro.
    if (resposta.status === 409) return { status: "ok" };

    if (!resposta.ok) {
      const corpo = await resposta.text();
      if (corpo.includes("23505")) return { status: "ok" };
      console.error(
        "[lista-de-espera] Supabase respondeu",
        resposta.status,
        corpo,
      );
      return {
        status: "erro",
        mensagem: "Não consegui salvar agora. Tente de novo em instantes.",
      };
    }

    return { status: "ok" };
  } catch (erro) {
    console.error("[lista-de-espera] Falha de rede:", erro);
    return {
      status: "erro",
      mensagem: "Não consegui salvar agora. Tente de novo em instantes.",
    };
  }
}
