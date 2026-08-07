import Link from "next/link";
import { ConversationField } from "./ConversationField";

export function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Halo âmbar frio atrás do conteúdo — atmosfera, não decoração */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[70rem] -translate-x-1/2 rounded-full opacity-[0.14] blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-signal), transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p
            className="eyebrow animate-rise"
            style={{ animationDelay: "0.05s" }}
          >
            Para corretores de imóveis
          </p>

          <h1 className="mt-6 font-display text-[2.75rem] leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">
            <span
              className="block animate-rise text-paper-dim"
              style={{ animationDelay: "0.12s" }}
            >
              Seu WhatsApp tem
              <br />
              200 conversas.
            </span>
            <span
              className="mt-3 block animate-rise text-signal"
              style={{ animationDelay: "0.24s" }}
            >
              Três vão virar venda.
            </span>
          </h1>

          <p
            className="mt-7 max-w-lg animate-rise text-lg leading-relaxed text-mute-100"
            style={{ animationDelay: "0.36s" }}
          >
            O Guido lê todas, monta seu funil sozinho e te diz com quem falar
            agora — e o que dizer. Sem planilha, sem CRM que você nunca
            preenche.
          </p>

          <div
            className="mt-9 flex animate-rise flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.46s" }}
          >
            <Link
              href="/cadastro"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 font-medium text-ink-900 transition-all hover:bg-signal-hot hover:shadow-[0_0_30px_-6px_var(--color-signal)]"
            >
              Testar 7 dias grátis
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border border-ink-500 px-7 py-3.5 text-paper-dim transition-colors hover:border-mute-300 hover:text-paper"
            >
              Ver como funciona
            </a>
          </div>

          <p
            className="mt-6 animate-rise font-mono text-xs leading-relaxed text-mute-300"
            style={{ animationDelay: "0.56s" }}
          >
            Sem cartão de crédito · Conecta no seu número atual · Você continua
            atendendo no WhatsApp
          </p>
        </div>

        <div
          className="animate-rise"
          style={{ animationDelay: "0.3s" }}
        >
          <ConversationField />
        </div>
      </div>
    </section>
  );
}
