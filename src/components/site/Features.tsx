import { SectionShell } from "./SectionShell";

/**
 * Nada está no ar ainda. "lancamento" é o que a Turma Fundadores recebe no
 * primeiro dia; "depois" vem nas ondas seguintes. Chamar qualquer coisa de
 * "disponível" hoje seria mentira — e o corretor descobre em uma semana.
 */
type Status = "lancamento" | "depois";

type Recurso = {
  titulo: string;
  texto: string;
  status: Status;
};

/** O que o fundador recebe no primeiro dia. Recebem peso visual. */
const PILARES: Recurso[] = [
  {
    titulo: "Radar de lead esfriando",
    texto:
      "“Três clientes quentes estão sem resposta há mais de duas horas.” Você descobre antes de perder, não depois.",
    status: "lancamento",
  },
  {
    titulo: "A ficha se preenche sozinha",
    texto:
      "Quartos, bairro, faixa de preço, FGTS, prazo de mudança. Extraído da conversa, com a mensagem de origem guardada.",
    status: "lancamento",
  },
  {
    titulo: "A fila do dia — com o porquê",
    texto:
      "Não é uma lista. É “fale com a Márcia agora, porque ela pediu a planta ontem às 19h e está pré-aprovada”.",
    status: "lancamento",
  },
];

/** O que vem depois. Compactos de propósito: prometem sem gritar. */
const HORIZONTE: Recurso[] = [
  {
    titulo: "Ciclo de visita completo",
    texto:
      "Agenda, lembra na véspera e no dia seguinte pergunta o que o cliente achou.",
    status: "depois",
  },
  {
    titulo: "Áudio, de verdade",
    texto:
      "Áudio de dois minutos vira resposta pronta. Inclusive em áudio.",
    status: "depois",
  },
  {
    titulo: "Cobrança de documentos",
    texto:
      "Financiamento trava por falta de holerite. O Guido cobra até chegar.",
    status: "depois",
  },
  {
    titulo: "Imóvel certo, cliente certo",
    texto: "Cruza seu estoque com o que a pessoa procura, dentro da conversa.",
    status: "depois",
  },
  {
    titulo: "Qual portal dá venda",
    texto: "Você sabe quanto paga por portal. Descubra qual vira escritura.",
    status: "depois",
  },
];

function Selo({ status }: { status: Status }) {
  return (
    <span
      className={`font-mono text-[0.625rem] tracking-wide ${
        status === "lancamento" ? "text-sage" : "text-mute-300"
      }`}
    >
      {status === "lancamento" ? "no lançamento" : "depois"}
    </span>
  );
}

export function Features() {
  return (
    <SectionShell id="recursos" folio="05 — RECURSOS">
      <div data-reveal className="max-w-2xl">
        <p className="eyebrow">Recursos</p>
        <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
          Feito para vender imóvel.
          <span className="text-mute-300">
            {" "}
            Não é chatbot genérico com nome novo.
          </span>
        </h2>
      </div>

      {/* Hierarquia explícita: três pilares grandes, o resto em faixa estreita.
          Uma grade uniforme de oito diria que tudo pesa igual — não pesa. */}
      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        {PILARES.map((r, i) => (
          <article
            key={r.titulo}
            data-reveal
            style={{ transitionDelay: `${i * 90}ms` }}
            className="group relative overflow-hidden rounded-2xl border border-ink-500 bg-ink-700 p-8 transition-colors duration-500 hover:border-signal-dim"
          >
            <span
              aria-hidden
              className="absolute -top-px left-8 h-px w-16 bg-signal opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="flex items-center justify-between">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              <Selo status={r.status} />
            </div>
            <h3 className="mt-6 font-display text-2xl leading-tight tracking-[-0.02em] text-paper">
              {r.titulo}
            </h3>
            <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-mute-100">
              {r.texto}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-ink-500 bg-ink-500 sm:grid-cols-2 lg:grid-cols-5">
        {HORIZONTE.map((r, i) => (
          <article
            key={r.titulo}
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
            className="bg-ink-700 p-5 transition-colors duration-500 hover:bg-ink-600"
          >
            <Selo status={r.status} />
            <h3 className="mt-4 font-display text-base leading-snug tracking-[-0.01em] text-paper-dim">
              {r.titulo}
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-mute-300">
              {r.texto}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
