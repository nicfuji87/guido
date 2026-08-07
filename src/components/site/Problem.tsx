const DORES = [
  {
    n: "01",
    titulo: "O lead esfria em horas, não em dias.",
    texto:
      "Ele mandou a mesma mensagem para três corretores. Fecha quem responde primeiro — e você estava dirigindo, em visita, ou dormindo.",
  },
  {
    n: "02",
    titulo: "Você lembra do cliente. Do que ele quis, não.",
    texto:
      "Dois quartos ou três? Qual bairro? Tinha FGTS? A resposta está num áudio de quinze dias atrás, entre outras quatrocentas mensagens.",
  },
  {
    n: "03",
    titulo: "O CRM só funciona se você preencher.",
    texto:
      "E você não preenche. Não é preguiça: entre atender mais um cliente e cadastrar o anterior, atender é o que paga a conta.",
  },
];

export function Problem() {
  return (
    <section className="relative border-t border-ink-600 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div data-reveal>
          <p className="eyebrow">O problema</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
            Corretor não perde venda por falta de técnica.
            <span className="text-mute-300"> Perde por demora e por esquecimento.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-ink-500 bg-ink-500 sm:grid-cols-3">
          {DORES.map((dor, i) => (
            <article
              key={dor.n}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              className="bg-ink-700 p-7 transition-colors hover:bg-ink-600"
            >
              <span className="font-mono text-xs text-signal-dim">{dor.n}</span>
              <h3 className="mt-5 font-display text-2xl leading-tight tracking-[-0.02em] text-paper">
                {dor.titulo}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-mute-200">
                {dor.texto}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
