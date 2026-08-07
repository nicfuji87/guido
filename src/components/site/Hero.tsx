import Link from "next/link";
import { ConversationField } from "./ConversationField";

export function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* Halo âmbar frio — profundidade, não decoração */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-52 left-[42%] h-[46rem] w-[68rem] -translate-x-1/2 rounded-full opacity-[0.13] blur-[130px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-signal), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-0">
          {/* Coluna tipográfica — avança por baixo do painel, quebrando a grade */}
          <div className="relative z-10 lg:col-span-7">
            <p className="eyebrow animate-rise" style={{ animationDelay: "0.05s" }}>
              Para corretores de imóveis
            </p>

            <h1 className="mt-7">
              <span
                className="animate-rise block text-[clamp(1.375rem,2.6vw,2rem)] leading-tight font-light text-mute-100"
                style={{ animationDelay: "0.14s" }}
              >
                Seu WhatsApp tem
              </span>

              {/* O contraste de escala é o argumento: 200 esmaga, 3 acende. */}
              <span className="mt-1 flex items-baseline gap-4 sm:gap-6">
                <span
                  className="animate-numeral font-display text-[clamp(5.5rem,15vw,12rem)] leading-[0.78] tracking-[-0.05em] text-mute-300"
                  style={{ animationDelay: "0.22s" }}
                >
                  200
                </span>
                <span
                  className="animate-rise font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-none tracking-[-0.03em] text-paper-dim"
                  style={{ animationDelay: "0.4s" }}
                >
                  conversas.
                </span>
              </span>

              <span
                className="animate-ignite mt-6 block font-display text-[clamp(2rem,5.4vw,4.25rem)] leading-[1.02] tracking-[-0.035em]"
                style={{ animationDelay: "0.72s" }}
              >
                Três vão virar venda.
              </span>
            </h1>

            <p
              className="animate-rise mt-9 max-w-md text-lg leading-relaxed text-mute-100"
              style={{ animationDelay: "1.1s" }}
            >
              O Guido lê todas, monta seu funil sozinho e te diz com quem falar
              agora — e o que dizer. Sem planilha, sem CRM que você nunca
              preenche.
            </p>

            <div
              className="animate-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "1.22s" }}
            >
              <Link
                href="/cadastro"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 font-medium text-ink-900 transition-all duration-300 hover:bg-signal-hot hover:shadow-[0_0_36px_-6px_var(--color-signal)]"
              >
                Testar 7 dias grátis
                <span className="transition-transform duration-300 group-hover:translate-x-1">
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
              className="animate-rise mt-7 font-mono text-xs leading-relaxed text-mute-300"
              style={{ animationDelay: "1.32s" }}
            >
              Sem cartão de crédito · Conecta no seu número atual · Você
              continua atendendo no WhatsApp
            </p>
          </div>

          {/* Painel sobreposto: invade a coluna de texto no desktop */}
          <div
            className="animate-rise relative lg:col-span-6 lg:col-start-7 lg:-ml-12"
            style={{ animationDelay: "0.5s" }}
          >
            <ConversationField />
          </div>
        </div>
      </div>
    </section>
  );
}
