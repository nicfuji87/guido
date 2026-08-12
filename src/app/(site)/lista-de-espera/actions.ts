"use server";

import { credenciaisSupabase } from "@/lib/supabase-env";

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

  /**
   * Rede de segurança: se a gravação falhar por qualquer motivo, o lead sai
   * no log do servidor com um marcador fácil de procurar. Perder um cadastro
   * em silêncio é pior do que ter nome e telefone num log de acesso restrito
   * por alguns dias — foi exatamente assim que a primeira leva se perdeu.
   */
  const registrarPerda = (motivo: string) =>
    console.error(
      `[LEAD-NAO-SALVO] motivo=${motivo} nome=${nome} whatsapp=${whatsapp} email=${email || "-"} perfil=${perfil || "-"}`,
    );

  const { url, chave } = credenciaisSupabase();

  if (!url || !chave) {
    // Sem banco configurado, é melhor gritar no log do servidor do que
    // engolir o cadastro e o corretor achar que entrou na lista.
    registrarPerda("env-ausente");
    return {
      status: "erro",
      mensagem:
        "Seu cadastro NÃO foi salvo. Tente de novo — se continuar dando erro, nos chame que a gente inscreve você na mão.",
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
      registrarPerda(`http-${resposta.status}`);
      console.error(
        "[lista-de-espera] Supabase respondeu",
        resposta.status,
        corpo,
      );
      return {
        status: "erro",
        mensagem:
          "Seu cadastro NÃO foi salvo. Tente de novo — se continuar dando erro, nos chame que a gente inscreve você na mão.",
      };
    }

    return { status: "ok" };
  } catch (erro) {
    registrarPerda("rede");
    console.error("[lista-de-espera] Falha de rede:", erro);
    return {
      status: "erro",
      mensagem:
        "Seu cadastro NÃO foi salvo. Tente de novo — se continuar dando erro, nos chame que a gente inscreve você na mão.",
    };
  }
}
