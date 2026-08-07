import Link from "next/link";

export function FinalCta() {
  return (
    <section className="grain relative overflow-hidden border-t border-ink-600 py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 translate-y-1/3 rounded-full opacity-[0.16] blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-signal), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2
          data-reveal
          className="font-display leading-[0.98] tracking-[-0.035em]"
        >
          <span className="block text-[clamp(1.75rem,4.5vw,3.25rem)]">
            Amanhã de manhã você vai abrir
          </span>
          <span className="mt-2 block text-[clamp(3rem,9vw,7rem)] text-mute-300">
            duzentas conversas.
          </span>
          <span className="mt-1 block text-[clamp(3rem,9vw,7rem)] text-signal">
            Ou três.
          </span>
        </h2>

        <p
          data-reveal
          className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-mute-100"
        >
          Sete dias grátis. Conecta em dois minutos, no seu número atual. Se não
          fizer sentido, você desconecta e não perdeu nada.
        </p>

        <div data-reveal className="mt-10">
          <Link
            href="/cadastro"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-9 py-4 text-lg font-medium text-ink-900 transition-all hover:bg-signal-hot hover:shadow-[0_0_44px_-8px_var(--color-signal)]"
          >
            Começar agora
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
