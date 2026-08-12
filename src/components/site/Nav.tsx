import Link from "next/link";

// Âncoras da própria página continuam como <a>; só rota vira <Link>.
const LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#dia-um", label: "Dia 1" },
  { href: "#recursos", label: "Recursos" },
  { href: "#planos", label: "Planos" },
];

/**
 * `anuncio` some na própria página da lista — não faz sentido chamar alguém
 * para onde ele já está.
 */
export function Nav({ anuncio = true }: { anuncio?: boolean } = {}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-600/80 bg-ink-800/80 backdrop-blur-xl">
      {anuncio && (
        <Link
          href="/lista-de-espera"
          className="group block border-b border-signal-dim/30 bg-signal/[0.07] px-6 py-2 text-center transition-colors hover:bg-signal/[0.13]"
        >
          <span className="font-mono text-[0.6875rem] tracking-wide text-mute-100">
            <span className="text-signal">Em construção.</span> 25 vagas de
            fundador, com preço travado para sempre{" "}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      )}

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-2xl leading-none tracking-[-0.02em] text-paper"
        >
          Guido
          <span className="text-signal">.</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-mute-100 transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Sem "Entrar" enquanto não existe conta para entrar. */}
          <Link
            href="/lista-de-espera"
            className="rounded-full bg-paper px-5 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-signal"
          >
            Entrar na lista
          </Link>
        </div>
      </nav>
    </header>
  );
}
