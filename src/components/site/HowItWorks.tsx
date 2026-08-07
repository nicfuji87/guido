const PASSOS = [
  {
    n: "01",
    titulo: "Conecte seu WhatsApp",
    texto:
      "Dois minutos, no número que você já usa. Seus clientes não percebem nada — e você continua atendendo exatamente onde sempre atendeu.",
    marca: "~2 min",
  },
  {
    n: "02",
    titulo: "O Guido lê e monta seu funil",
    texto:
      "Ele varre o histórico, separa quem é lead de quem é grupo da família, extrai o que cada um procura e monta o kanban sozinho.",
    marca: "automático",
  },
  {
    n: "03",
    titulo: "Todo dia, a fila pronta",
    texto:
      "Com quem falar, por que essa pessoa e não outra, e a mensagem já escrita do jeito que você escreve. Você lê, ajusta se quiser, envia.",
    marca: "toda manhã",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative border-t border-ink-600 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div data-reveal className="max-w-2xl">
          <p className="eyebrow">Como funciona</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
            Três passos. Depois disso,
            <span className="text-signal"> ele trabalha sozinho.</span>
          </h2>
        </div>

        <ol className="mt-16 space-y-px">
          {PASSOS.map((passo, i) => (
            <li
              key={passo.n}
              data-reveal
              style={{ transitionDelay: `${i * 110}ms` }}
              className="group grid grid-cols-1 gap-6 border-t border-ink-500 py-9 transition-colors first:border-t-0 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-10"
            >
              <span className="font-mono text-sm text-signal-dim transition-colors group-hover:text-signal sm:pt-2">
                {passo.n}
              </span>

              <div className="max-w-2xl">
                <h3 className="font-display text-3xl leading-tight tracking-[-0.02em] text-paper sm:text-[2rem]">
                  {passo.titulo}
                </h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-mute-100">
                  {passo.texto}
                </p>
              </div>

              <span className="font-mono text-xs whitespace-nowrap text-mute-300 sm:pt-3">
                {passo.marca}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
