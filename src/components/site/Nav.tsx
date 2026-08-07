import Link from "next/link";

// Âncoras da própria página continuam como <a>; só rota vira <Link>.
const LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#dia-um", label: "Dia 1" },
  { href: "#recursos", label: "Recursos" },
  { href: "#planos", label: "Planos" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-600/80 bg-ink-800/80 backdrop-blur-xl">
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
          <Link
            href="/entrar"
            className="hidden text-sm text-mute-100 transition-colors hover:text-paper sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-paper px-5 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-signal"
          >
            Testar grátis
          </Link>
        </div>
      </nav>
    </header>
  );
}
