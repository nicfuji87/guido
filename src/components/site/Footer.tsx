import Link from "next/link";

const GRUPOS = [
  {
    titulo: "Produto",
    links: [
      { href: "#como-funciona", label: "Como funciona" },
      { href: "#recursos", label: "Recursos" },
      { href: "#planos", label: "Planos" },
      { href: "/imobiliarias", label: "Para imobiliárias" },
    ],
  },
  {
    titulo: "Conta",
    links: [
      { href: "/entrar", label: "Entrar" },
      { href: "/cadastro", label: "Criar conta" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Privacidade" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-600 bg-ink-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl leading-none tracking-[-0.02em] text-paper"
            >
              Guido<span className="text-signal">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute-300">
              A inteligência de vendas do corretor de imóveis.
            </p>
          </div>

          {GRUPOS.map((grupo) => (
            <div key={grupo.titulo}>
              <p className="eyebrow">{grupo.titulo}</p>
              <ul className="mt-4 space-y-2.5">
                {grupo.links.map((link) =>
                  link.href.startsWith("#") ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-mute-200 transition-colors hover:text-paper"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-mute-200 transition-colors hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink-600 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.625rem] text-mute-300">
            © {new Date().getFullYear()} Guido
          </p>
          <p className="font-mono text-[0.625rem] text-mute-300">
            Não somos afiliados ao WhatsApp nem à Meta.
          </p>
        </div>
      </div>
    </footer>
  );
}
