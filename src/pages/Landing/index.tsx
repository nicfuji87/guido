import React from 'react'
import { Play, ArrowRight, Zap, Target, Users, Home, Clock, AlertTriangle, MessageSquare, MessageCircle, Settings, CheckCircle, Brain, Star } from 'lucide-react'
import { Badge } from '@/components/ui'
import { NavBar } from '@/components/NavBar'
import { VideoPlayer } from '@/components/VideoPlayer'
import { AnimatedSection } from '@/components/AnimatedSection'
import { BeamsBackground } from '@/components/BeamsBackground'

import { AnimatedText } from '@/components/AnimatedText'
import { GradientText } from '@/components/GradientText'
import { FloatingCard } from '@/components/FloatingCard'
import { PremiumButton } from '@/components/PremiumButton'
import { ParticleBackground } from '@/components/ParticleBackground'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-x-hidden">
      {/* Navigation */}
      <NavBar
        className="w-fit"
        logoSrc="/images/guido/guido logo dark - sem fundo.png"
        items={[
          { name: 'Início', href: '#hero', icon: Home },
          { name: 'Recursos', href: '#features', icon: Zap },
          { name: 'Sobre', href: '#mission', icon: Target },
          { name: 'Planos', href: '#pricing', icon: Users },
        ]}
      />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 lg:pt-0">
        <ParticleBackground className="opacity-40" particleCount={30} />
        <BeamsBackground className="absolute inset-0" intensity="subtle" />
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content Column */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              {/* Logo */}
              <AnimatedSection delay={0}>
                <img 
                  src="/images/guido/guido logo dark - sem fundo.png" 
                  alt="Guido Logo" 
                  className="h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 w-auto object-contain mx-auto lg:mx-0"
                />
              </AnimatedSection>
              
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-none">
                  <div className="mb-2">
                    <AnimatedText 
                      text="Nunca mais perca"
                      className=""
                      delay={200}
                    />
                  </div>
                  <div className="mb-2">
                    <AnimatedText 
                      text="dinheiro com seus"
                      className=""
                      delay={400}
                    />
                  </div>
                  <div>
                    <GradientText gradient="primary">
                      leads esquecidos no <span className="text-[#25D366]">WhatsApp</span>
                    </GradientText>
                  </div>
                </h1>
              </div>

              {/* Subheadline */}
              <AnimatedSection delay={800}>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                  Guido é uma{' '}
                  <span className="relative inline-block">
                    <span className="bg-[rgba(0,246,255,0.10)] text-[#00F6FF] px-3 py-1 rounded-lg border border-[rgba(0,246,255,0.20)]">
                      IA para corretores de imóveis
                    </span>
                  </span>{' '}
                  que identifica oportunidades nas suas conversas, te lembra quem responder e sugere as melhores respostas para você vender mais imóveis.
                </p>
              </AnimatedSection>

              {/* CTA Buttons */}
              <AnimatedSection delay={1000}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <PremiumButton size="lg" shimmer className="group">
                    Começar Agora - GRÁTIS
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </PremiumButton>
                  <PremiumButton variant="outline" size="lg">
                    <Play className="mr-2 h-5 w-5" />
                    Ver Demo
                  </PremiumButton>
                </div>
              </AnimatedSection>

              {/* Social Proof */}
              <AnimatedSection delay={1200}>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#00F6FF] to-[#0EA5E9] border-2 border-[#0D1117] flex items-center justify-center">
                          <span className="text-xs font-bold text-[#0D1117]">{i}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      +2.000 corretores já usam
                    </div>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Video Column */}
            <div className="relative">
              <AnimatedSection delay={600}>
                <div className="relative float">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#00F6FF]/20 to-[#0EA5E9]/20 rounded-3xl blur-2xl" />
                  <VideoPlayer
                    thumbnailUrl="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                    videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Veja o Guido em Ação"
                    description="Descubra como revolucionar sua rotina"
                    className="relative z-10 rounded-2xl shadow-2xl"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Sua rotina parece{' '}
                <GradientText gradient="primary">familiar</GradientText>?
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
                Descubra os principais desafios que impedem você de vender mais
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {[
              {
                icon: Clock,
                title: "Horas gastas atualizando CRM",
                description: "Inserção manual de dados, atualizações constantes no CRM. Tempo que poderia ser usado no relacionamento com o cliente.",
                delay: 0
              },
              {
                icon: AlertTriangle,
                title: "Dificuldade de Acompanhamento",
                description: "Falta de automação para facilitar agendamento de compromissos, visitas ou follow-ups. Oportunidades perdidas por falta de organização.",
                delay: 200
              },
              {
                icon: MessageSquare,
                title: "Perda de leads por falta de atenção",
                description: "Múltiplos canais e dezenas de conversas para gerenciar? Você perde tempo alternando entre WhatsApp, e-mails e ligações.",
                delay: 400
              },
              {
                icon: MessageCircle,
                title: "Leads que \"somem\"",
                description: "Conversas que esfriam por falta de timing e abordagem. Sem alertas ou estratégias de reengajamento, leads promissores desaparecem.",
                delay: 600
              },
              {
                icon: Settings,
                title: "Falta de argumentos",
                description: "Receba sugestões de resposta no momento certo e transforme objeções em oportunidades de fechamento.",
                delay: 800
              }
            ].map((problem, index) => (
              <AnimatedSection key={index} delay={problem.delay}>
                <FloatingCard className="h-full">
                  <div className="space-y-4">
                    <div className="w-fit rounded-xl bg-[#00F6FF]/10 border border-[#00F6FF]/20 p-3">
                      <problem.icon className="h-8 w-8 text-[#00F6FF]" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {problem.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </FloatingCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F6FF]/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <AnimatedSection>
              <div className="space-y-6">
                <div>
                  <Badge className="mb-4 bg-[#00F6FF]/10 text-[#00F6FF] border-[#00F6FF]/20">
                    🤖 Inteligência Artificial
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                    O guia que trabalha por você.{' '}
                    <GradientText gradient="primary">24/7</GradientText>
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                    Guido agiliza tarefas, lembra compromissos, dá sugestões de abordagem, auxilia em suas decisões, atualiza o CRM e te ajuda a fechar negócios.
                    <br /><br />
                    Tudo de forma simples e rápido direto do{' '}
                    <span className="text-[#25D366] font-semibold">WhatsApp</span>.
                  </p>
                </div>
                <PremiumButton size="lg" className="group">
                  Experimentar Grátis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </PremiumButton>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-[#00F6FF]/20 via-transparent to-[#00F6FF]/20 rounded-3xl blur-3xl" />
                <img
                  src="/images/partners/whatsapp-hand-animation.png"
                  alt="WhatsApp Hand Animation"
                  className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl float"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/images/partners/whatsapp-hand-animation.jpg';
                  }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Transforme sua rotina com{' '}
                <GradientText gradient="primary">inteligência artificial</GradientText>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
                Recursos poderosos que automatizam seu trabalho e multiplicam seus resultados
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Assistente de Vendas",
                description: "Sugestões de respostas inteligentes e personalizadas para cada cliente, guiando você para a próxima etapa da negociação.",
                badge: "IA Avançada"
              },
              {
                icon: Settings,
                title: "CRM 100% Atualizado",
                description: "Peça para o Guido e ele atualiza o status, adiciona notas e registra contatos no CRM da imobiliária.",
                badge: "Automação"
              },
              {
                icon: Brain,
                title: "Memória Inteligente",
                description: "Guido resume históricos e lembra você dos detalhes importantes de cada cliente, como um guia que nunca esquece.",
                badge: "Smart Memory"
              },
              {
                icon: Clock,
                title: "Alertas e Lembretes",
                description: "Guido lembra você sobre follow-up com leads sem retorno, alerta de visita agendada e notificação para renovação de anúncios.",
                badge: "Proativo"
              },
              {
                icon: CheckCircle,
                title: "Assistência Pós-Venda",
                description: "Guido gera mensagens para acompanhar o cliente após a compra. Nutra o relacionamento com o cliente.",
                badge: "Relacionamento"
              }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 200}>
                <FloatingCard className="h-full group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-fit rounded-xl bg-[#00F6FF]/10 border border-[#00F6FF]/20 p-3 group-hover:bg-[#00F6FF]/20 transition-colors">
                        <feature.icon className="h-10 w-10 text-[#00F6FF]" />
                      </div>
                      <Badge className="text-xs bg-[#00F6FF]/10 text-[#00F6FF] border-[#00F6FF]/20">
                        {feature.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-[#00F6FF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </FloatingCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Integrations */}
      <section id="mission" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative bg-white text-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <AnimatedSection>
            <div className="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Por Trás da <GradientText gradient="primary">Inteligência</GradientText>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Guido foi criado para libertar o corretor da sobrecarga digital, permitindo foco total nas pessoas e negociações.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="space-y-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 px-4">
                Integrações Diretas com seu <GradientText gradient="primary">CRM Imobiliário</GradientText>
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto px-4">
                O Guido faz atualizações e consultas de forma autônoma no sistema que você usa na imobiliária.
              </p>
              <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 flex-wrap px-4">
                <div className="group cursor-pointer">
                  <img 
                    src="/images/partners/download.png" 
                    alt="RD Station" 
                    className="h-12 sm:h-14 lg:h-16 w-auto transition-all duration-300 group-hover:scale-110 shadow-lg rounded-lg bg-white p-2" 
                  />
                </div>
                <div className="group cursor-pointer">
                  <img 
                    src="/images/partners/download (1).png" 
                    alt="iMoview" 
                    className="h-10 sm:h-12 lg:h-14 w-auto transition-all duration-300 group-hover:scale-110 shadow-lg rounded-lg bg-white p-2" 
                  />
                </div>
                <div className="group cursor-pointer">
                  <img 
                    src="/images/partners/Logo-loft-23.png" 
                    alt="Loft" 
                    className="h-10 sm:h-12 lg:h-14 w-auto transition-all duration-300 group-hover:scale-110 shadow-lg rounded-lg bg-white p-2" 
                  />
                </div>
              </div>
              
              {/* Decorative elements for white section */}
              <div className="relative mt-12">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-gray-500">Conecte-se com facilidade</span>
                </div>
              </div>
              
              {/* Additional visual element */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-md mx-auto mt-8 px-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00F6FF]/10 border border-[#00F6FF]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#00F6FF] font-bold text-sm sm:text-base">1</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 text-center">Conectar</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00F6FF]/10 border border-[#00F6FF]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#00F6FF] font-bold text-sm sm:text-base">2</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 text-center">Sincronizar</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00F6FF]/10 border border-[#00F6FF]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#00F6FF] font-bold text-sm sm:text-base">3</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 text-center">Vender Mais</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                <GradientText gradient="primary">A inteligência que fecha negócios</GradientText>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 px-4">
                Escolha o plano ideal para você e comece a vender mais hoje mesmo
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Plano Corretor */}
            <AnimatedSection delay={200}>
              <FloatingCard className="relative h-full" glowIntensity="high">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#00F6FF] to-[#0EA5E9] text-[#0D1117] font-semibold border-0">
                  ⭐ Mais Popular
                </Badge>
                <div className="text-center space-y-6 pt-4">
                  <div>
                    <h3 className="text-2xl font-bold">Plano Corretor</h3>
                    <p className="text-gray-400">Ideal para profissionais autônomos</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-5xl font-extrabold">
                      <GradientText gradient="primary">R$ 149</GradientText>
                      <span className="text-xl font-normal text-gray-400">/mês</span>
                    </div>
                    <p className="text-sm text-gray-500">ou R$ 1.490/ano (2 meses grátis)</p>
                  </div>

                  <ul className="space-y-3 text-left">
                    {[
                      'Sugestões de Respostas Ilimitadas',
                      'CRM Automatizado (1 Integração)',
                      'Memória Inteligente',
                      'Alertas e Lembretes',
                      'Suporte via WhatsApp'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-[#00F6FF] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PremiumButton size="lg" className="w-full group">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </PremiumButton>
                  
                  <p className="text-xs text-gray-500">✅ 7 dias grátis • ✅ Cancele a qualquer momento</p>
                </div>
              </FloatingCard>
            </AnimatedSection>

            {/* Plano Imobiliária */}
            <AnimatedSection delay={400}>
              <FloatingCard className="h-full border-2 border-[#00F6FF]/20">
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">Plano Imobiliária</h3>
                    <p className="text-gray-400">Para equipes e imobiliárias</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-5xl font-extrabold">
                      <GradientText gradient="primary">Consultar</GradientText>
                    </div>
                    <p className="text-sm text-gray-500">Preço personalizado por usuário</p>
                  </div>

                  <ul className="space-y-3 text-left">
                    {[
                      'Todas as funcionalidades do Plano Corretor',
                      'Múltiplos Usuários',
                      'Integrações CRM Personalizadas', 
                      'Dashboard Gerencial',
                      'Suporte Dedicado',
                      'Onboarding Personalizado'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-[#00F6FF] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PremiumButton variant="outline" size="lg" className="w-full group">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Falar com Vendas
                  </PremiumButton>
                  
                  <p className="text-xs text-gray-500">📞 Resposta em até 2h • 🎯 Consultoria gratuita</p>
                </div>
              </FloatingCard>
            </AnimatedSection>
          </div>


        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            {/* Um produto da Infuse */}
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Um produto da</span>
                <img 
                  src="/images/infuse/Infuse comunicação inteligente logo.png" 
                  alt="Infuse Comunicação Inteligente" 
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-gray-600 text-xs">
                CNPJ: 32.739.249/0001-00
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-sm text-center">
                © {new Date().getFullYear()} Guido. Transformando a vida dos corretores com inteligência artificial.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}