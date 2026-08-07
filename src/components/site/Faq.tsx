import { SectionShell } from "./SectionShell";

const PERGUNTAS = [
  {
    p: "Preciso parar de usar o WhatsApp que já uso?",
    r: "Não. Você conecta o número que já é seu, e continua atendendo normalmente. Seus clientes não percebem diferença nenhuma — o Guido trabalha por trás.",
  },
  {
    p: "Meu número pode ser banido?",
    r: "Sendo direto: na conexão pelo número pessoal existe risco, porque ela não é oficial do WhatsApp. Nós reduzimos esse risco com aquecimento e limite de envio, mas não podemos prometer risco zero — quem promete está mentindo. Se isso te preocupa, existe a conexão oficial (WhatsApp Business API), sem risco de banimento; ela demora mais para ativar e não importa o histórico.",
  },
  {
    p: "O Guido responde meu cliente sem eu ver?",
    r: "Só se você mandar. No plano Copiloto ele nunca envia nada sozinho: escreve, e você aprova. No Autopiloto ele pode agir sozinho dentro do limite de confiança que você definir — e você continua vendo tudo.",
  },
  {
    p: "E se ele errar?",
    r: "Toda ação do Guido mostra o motivo (“movi para Proposta porque o cliente pediu a minuta às 14h32”) e tem desfazer em um clique. Quando ele não tem certeza suficiente, ele pergunta em vez de agir. Ferramenta que age sem explicar não merece confiança.",
  },
  {
    p: "O que acontece com as conversas dos meus clientes?",
    r: "Ficam suas. Usamos os dados para operar o Guido na sua conta, com acesso restrito e criptografia. Você pode exportar ou pedir exclusão a qualquer momento, conforme a LGPD.",
  },
  {
    p: "Serve para imobiliária, não só para autônomo?",
    r: "Serve. Numa imobiliária, cada corretor tem o login e o funil dele, o gestor vê o time inteiro, e os leads do número central são distribuídos automaticamente por tempo de resposta e taxa de conversão.",
  },
  {
    p: "Preciso instalar alguma coisa?",
    r: "Não. Tudo roda no navegador, no computador e no celular. A conexão do WhatsApp é um QR code, como no WhatsApp Web.",
  },
];

export function Faq() {
  return (
    <SectionShell folio="07 — DÚVIDAS">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div data-reveal>
          <p className="eyebrow">Dúvidas</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
            Perguntas
            <span className="text-mute-300"> que valem uma resposta honesta.</span>
          </h2>
        </div>

        <div data-reveal className="divide-y divide-ink-500 border-y border-ink-500">
          {PERGUNTAS.map((item) => (
            <details key={item.p} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1.0625rem] leading-snug text-paper transition-colors hover:text-signal [&::-webkit-details-marker]:hidden">
                {item.p}
                <span
                  aria-hidden
                  className="mt-1 shrink-0 font-mono text-mute-300 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3.5 max-w-2xl pr-10 text-[0.9375rem] leading-relaxed text-mute-100">
                {item.r}
              </p>
            </details>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
