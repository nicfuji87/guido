import { SectionShell } from "./SectionShell";

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
    <SectionShell folio="01 — O PROBLEMA">
      <div data-reveal className="max-w-3xl lg:ml-[12%]">
        <p className="eyebrow">O problema</p>
        <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
          Corretor não perde venda por falta de técnica.
          <span className="text-mute-300">
            {" "}
            Perde por demora e por esquecimento.
          </span>
        </h2>
      </div>

      {/* Recuo progressivo: a lista afunda conforme o problema piora. */}
      <div className="mt-20 space-y-14 sm:space-y-16">
        {DORES.map((dor, i) => (
          <article
            key={dor.n}
            data-reveal
            style={{
              transitionDelay: `${i * 110}ms`,
              marginLeft: `clamp(0px, ${i * 7}vw, ${i * 6.5}rem)`,
            }}
            className="group flex max-w-2xl items-start gap-6 sm:gap-9"
          >
            <span className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.8] tracking-[-0.04em] text-ink-500 transition-colors duration-500 group-hover:text-signal-dim">
              {dor.n}
            </span>
            <div className="pt-1">
              <h3 className="font-display text-2xl leading-tight tracking-[-0.02em] text-paper sm:text-[1.75rem]">
                {dor.titulo}
              </h3>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-mute-200">
                {dor.texto}
              </p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
