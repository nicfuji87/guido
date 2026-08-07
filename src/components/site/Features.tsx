/**
 * `status` controla o selo exibido no card.
 * IMPORTANTE: manter sincronizado com o que realmente está em produção —
 * marcar como "agora" algo que ainda não existe queima a confiança na largada.
 */
type Status = "agora" | "em-breve";

type Recurso = {
  titulo: string;
  texto: string;
  status: Status;
  destaque?: boolean;
};

const RECURSOS: Recurso[] = [
  {
    titulo: "Radar de lead esfriando",
    texto:
      "“Três clientes quentes estão sem resposta há mais de duas horas.” Você descobre antes de perder, não depois.",
    status: "agora",
    destaque: true,
  },
  {
    titulo: "A ficha se preenche sozinha",
    texto:
      "Quartos, bairro, faixa de preço, FGTS, prazo de mudança. Extraído da conversa, com a mensagem de origem guardada.",
    status: "agora",
    destaque: true,
  },
  {
    titulo: "A fila do dia — com o porquê",
    texto:
      "Não é uma lista. É “fale com a Márcia agora, porque ela pediu a planta ontem às 19h e está pré-aprovada”.",
    status: "agora",
    destaque: true,
  },
  {
    titulo: "Ciclo de visita completo",
    texto:
      "Detecta a intenção, agenda, lembra o cliente na véspera — e no dia seguinte pergunta o que ele achou. Ninguém coleta esse retorno. Você vai.",
    status: "em-breve",
  },
  {
    titulo: "Áudio, de verdade",
    texto:
      "Cliente manda áudio de dois minutos. O Guido ouve, entende e já deixa a resposta pronta. Inclusive em áudio.",
    status: "em-breve",
  },
  {
    titulo: "Cobrança de documentos",
    texto:
      "Financiamento não trava por falta de vontade, trava por falta de holerite. O Guido cobra sozinho até chegar.",
    status: "em-breve",
  },
  {
    titulo: "Imóvel certo para o cliente certo",
    texto:
      "Com seu estoque conectado, ele cruza o que a pessoa procura com o que você tem — dentro da conversa, com o texto pronto.",
    status: "em-breve",
  },
  {
    titulo: "Qual portal dá venda, não lead",
    texto:
      "Você sabe quanto paga por portal. O Guido mostra qual deles vira escritura.",
    status: "em-breve",
  },
];

function Selo({ status }: { status: Status }) {
  if (status === "agora") {
    return (
      <span className="font-mono text-[0.625rem] tracking-wide text-sage">
        disponível
      </span>
    );
  }
  return (
    <span className="font-mono text-[0.625rem] tracking-wide text-mute-300">
      em breve
    </span>
  );
}

export function Features() {
  return (
    <section
      id="recursos"
      className="relative border-t border-ink-600 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
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

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-500 bg-ink-500 sm:grid-cols-2 lg:grid-cols-4">
          {RECURSOS.map((recurso, i) => (
            <article
              key={recurso.titulo}
              data-reveal
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
              className={`group flex flex-col p-6 transition-colors ${
                recurso.destaque
                  ? "bg-ink-600 hover:bg-ink-500"
                  : "bg-ink-700 hover:bg-ink-600"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    recurso.destaque ? "bg-signal" : "bg-ink-400"
                  }`}
                />
                <Selo status={recurso.status} />
              </div>

              <h3 className="mt-5 font-display text-xl leading-tight tracking-[-0.015em] text-paper">
                {recurso.titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mute-200">
                {recurso.texto}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
