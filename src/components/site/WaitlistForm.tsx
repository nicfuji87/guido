"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { entrarNaLista, type EstadoLista } from "@/app/(site)/lista-de-espera/actions";

const INICIAL: EstadoLista = { status: "inicial" };

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-7 py-4 text-base font-medium text-ink-900 transition-all duration-300 hover:bg-signal-hot hover:shadow-[0_0_36px_-6px_var(--color-signal)] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Entrando na lista…" : "Quero minha vaga de fundador"}
      {!pending && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      )}
    </button>
  );
}

const campoBase =
  "w-full rounded-xl border border-ink-500 bg-ink-800 px-4 py-3.5 text-paper placeholder:text-mute-300 transition-colors focus:border-signal focus:outline-none";

export function WaitlistForm({ origem = "site" }: { origem?: string }) {
  const [estado, acao] = useActionState(entrarNaLista, INICIAL);

  if (estado.status === "ok") {
    return (
      <div className="rounded-2xl border border-signal-dim bg-ink-700 p-8 text-center">
        <p className="font-display text-3xl tracking-[-0.02em] text-signal">
          Você está na lista.
        </p>
        {/* Não prometemos a vaga aqui: não temos como saber a posição dele
            neste momento, e prometer para 200 pessoas o que só 25 recebem
            destrói a confiança justamente com quem queremos. */}
        <p className="mt-4 leading-relaxed text-mute-100">
          Te chamo no WhatsApp para confirmar sua posição. As 25 primeiras
          entram como fundadoras, com o preço travado — e a ordem é a de
          chegada.
        </p>
        <p className="mt-5 font-mono text-xs leading-relaxed text-mute-300">
          Se não reconhecer a mensagem quando chegar, é só responder “sair”.
        </p>
      </div>
    );
  }

  return (
    <form action={acao} className="space-y-4">
      <input type="hidden" name="origem" value={origem} />

      {/* Honeypot: invisível para gente, irresistível para robô. */}
      <input
        type="text"
        name="empresa"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="nome" className="eyebrow">
          Seu nome
        </label>
        <input
          id="nome"
          name="nome"
          required
          autoComplete="name"
          placeholder="Como seus clientes te chamam"
          className={`mt-2 ${campoBase}`}
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="eyebrow">
          WhatsApp
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          required
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(61) 98144-6666"
          className={`mt-2 ${campoBase}`}
        />
      </div>

      <div>
        <label htmlFor="email" className="eyebrow">
          E-mail <span className="normal-case">(opcional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="para receber o aviso de abertura"
          className={`mt-2 ${campoBase}`}
        />
      </div>

      <fieldset>
        <legend className="eyebrow">Você atende</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {[
            { v: "autonomo", r: "Por conta própria" },
            { v: "imobiliaria", r: "Numa imobiliária" },
          ].map((o) => (
            <label
              key={o.v}
              className="cursor-pointer rounded-xl border border-ink-500 bg-ink-800 px-4 py-3 text-center text-sm text-mute-100 transition-colors has-checked:border-signal has-checked:bg-ink-600 has-checked:text-paper"
            >
              <input
                type="radio"
                name="perfil"
                value={o.v}
                className="sr-only"
              />
              {o.r}
            </label>
          ))}
        </div>
      </fieldset>

      {estado.status === "erro" && (
        <p role="alert" className="text-sm text-clay">
          {estado.mensagem}
        </p>
      )}

      <Botao />

      <p className="text-center font-mono text-[0.625rem] leading-relaxed text-mute-300">
        Guardamos seu nome e WhatsApp só para te avisar da abertura. Não
        repassamos a ninguém e você sai quando quiser.{" "}
        <a href="/privacidade" className="underline hover:text-mute-100">
          Como tratamos seus dados
        </a>
      </p>
    </form>
  );
}
