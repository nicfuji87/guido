/**
 * A textura de fundo do site inteiro: fragmentos reais do que um corretor
 * recebe no WhatsApp, quase ilegíveis, à deriva.
 *
 * É o "ruído" do conceito virando material — e não uma metáfora citada uma vez
 * no texto. Também é contextual: qualquer corretor reconhece essas frases.
 *
 * Posições são fixas de propósito. Math.random() aqui quebraria a hidratação.
 */
const FRAGMENTOS = [
  { t: "tem outro com 3 quartos?", x: 4, y: 6, s: 1.7, r: -2 },
  { t: "qual o valor do condomínio?", x: 61, y: 3, s: 1.15, r: 1 },
  { t: "manda a planta por favor", x: 28, y: 13, s: 2.3, r: -1 },
  { t: "aceita financiamento?", x: 76, y: 17, s: 1.5, r: 2 },
  { t: "pode ser sábado de manhã", x: 8, y: 24, s: 1.25, r: 1.5 },
  { t: "tá caro demais", x: 47, y: 28, s: 2.8, r: -1.5 },
  { t: "e o IPTU?", x: 84, y: 33, s: 1.9, r: -2 },
  { t: "tem vaga coberta?", x: 15, y: 37, s: 1.35, r: 1 },
  { t: "vou falar com minha esposa", x: 55, y: 42, s: 1.6, r: -1 },
  { t: "esse já foi vendido?", x: 3, y: 48, s: 2.1, r: 2 },
  { t: "consegue negociar o preço?", x: 68, y: 52, s: 1.2, r: -1.5 },
  { t: "quando posso visitar?", x: 33, y: 57, s: 2.5, r: 1 },
  { t: "tem elevador?", x: 88, y: 61, s: 1.75, r: -2 },
  { t: "aceita FGTS?", x: 12, y: 66, s: 2.9, r: 1.5 },
  { t: "me manda mais fotos", x: 58, y: 71, s: 1.3, r: -1 },
  { t: "qual o metro quadrado?", x: 25, y: 76, s: 1.55, r: 2 },
  { t: "é de frente pro sol?", x: 79, y: 80, s: 1.85, r: -1.5 },
  { t: "tem outro no mesmo prédio?", x: 6, y: 85, s: 1.1, r: 1 },
  { t: "vou pensar e te falo", x: 44, y: 90, s: 2.4, r: -2 },
  { t: "e a documentação?", x: 71, y: 95, s: 1.65, r: 1.5 },
];

export function NoiseLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="animate-drift absolute -inset-[10%]">
        {FRAGMENTOS.map((f) => (
          <span
            key={f.t}
            className="absolute whitespace-nowrap font-display text-ink-500 select-none"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              fontSize: `${f.s}rem`,
              transform: `rotate(${f.r}deg)`,
              opacity: 0.5,
            }}
          >
            {f.t}
          </span>
        ))}
      </div>
    </div>
  );
}
