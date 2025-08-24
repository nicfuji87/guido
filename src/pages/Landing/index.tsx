import React, { useState } from 'react'
import { Play, ArrowRight, Zap, Target, Users, Home, Clock, AlertTriangle, MessageSquare, MessageCircle, Settings, CheckCircle, Brain, Star, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui'
import { NavBar } from '@/components/NavBar'
import { VideoPlayer } from '@/components/VideoPlayer'
import { AnimatedSection } from '@/components/AnimatedSection'
import { BeamsBackground } from '@/components/BeamsBackground'
import { SignupModal } from '@/components/SignupModal'

import { AnimatedText } from '@/components/AnimatedText'
import { GradientText } from '@/components/GradientText'
import { FloatingCard } from '@/components/FloatingCard'
import { PremiumButton } from '@/components/PremiumButton'
import { ParticleBackground } from '@/components/ParticleBackground'

// FAQ Component
const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <AnimatedSection delay={index * 100}>
      <FloatingCard className="overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <h3 className="text-lg font-semibold pr-4">{question}</h3>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-[#00F6FF] flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
          )}
        </button>
        {isOpen && (
          <div className="px-6 pb-6 border-t border-gray-700/50">
            <div className="pt-4 text-gray-300 leading-relaxed whitespace-pre-line">
              {answer}
            </div>
          </div>
        )}
      </FloatingCard>
    </AnimatedSection>
  )
}

export default function Landing() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [skipPlanSelection, setSkipPlanSelection] = useState(false)
  const [defaultPlan, setDefaultPlan] = useState<'INDIVIDUAL' | 'IMOBILIARIA'>('INDIVIDUAL')

  const handleSignupSuccess = () => {
    // TODO: Redirect to dashboard or onboarding
    // Signup success - redirect to dashboard
  }

  // Função para abrir WhatsApp com mensagem pré-definida
  const openWhatsApp = (message: string) => {
    const phoneNumber = '556136862676'
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
  }

  const openSignupModal = (skipSelection = false, plan: 'INDIVIDUAL' | 'IMOBILIARIA' = 'INDIVIDUAL') => {
    setSkipPlanSelection(skipSelection)
    setDefaultPlan(plan)
    setIsSignupModalOpen(true)
  }

  const closeSignupModal = () => {
    setIsSignupModalOpen(false)
    setSkipPlanSelection(false)
    setDefaultPlan('INDIVIDUAL')
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white overflow-x-hidden">
      {/* Navigation */}
      <NavBar
        className="w-fit"
        logoSrc="/images/guido/guido%20logo%20dark%20-%20sem%20fundo.png"
        items={[
          { name: 'Início', href: '#hero', icon: Home },
          { name: 'Recursos', href: '#features', icon: Zap },
          { name: 'Sobre', href: '#mission', icon: Target },
          { name: 'Planos', href: '#pricing', icon: Users },
          { name: 'FAQ', href: '#faq', icon: HelpCircle },
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
                  <PremiumButton 
                    size="lg" 
                    shimmer 
                    className="group"
                    onClick={() => {
                      const pricingSection = document.getElementById('pricing');
                      pricingSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
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
                <PremiumButton 
                  size="lg" 
                  className="group"
                  onClick={() => {
                    const pricingSection = document.getElementById('pricing');
                    pricingSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Experimentar Grátis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </PremiumButton>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-[#00F6FF]/20 via-transparent to-[#00F6FF]/20 rounded-3xl blur-3xl" />
                <img
                  src="/images/partners/whatsapp-hand-animation.jpg"
                  alt="WhatsApp Hand Animation"
                  className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl float"
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

                  <PremiumButton 
                    size="lg" 
                    className="w-full group"
                    onClick={() => openSignupModal(true, 'INDIVIDUAL')}
                  >
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

                  <PremiumButton 
                    variant="outline" 
                    size="lg" 
                    className="w-full group"
                    onClick={() => openWhatsApp('Olá, estou no site e gostaria de mais informações sobre o serviço do Guido para imobiliárias')}
                  >
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

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 sm:mb-16">
              <div className="w-fit mx-auto mb-4">
                <div className="w-16 h-16 bg-[#00F6FF]/10 border border-[#00F6FF]/20 rounded-2xl flex items-center justify-center">
                  <HelpCircle className="h-8 w-8 text-[#00F6FF]" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Perguntas <GradientText gradient="primary">Frequentes</GradientText>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
                Tudo que você precisa saber sobre o Guido e como ele pode transformar seu negócio
              </p>
            </div>
          </AnimatedSection>
          
          <div className="space-y-4">
            {[
              {
                question: "O que é o Guido, exatamente?",
                answer: "O Guido é um guia de inteligência artificial projetado para ser o parceiro estratégico do corretor de imóveis. Ele não é apenas um software, mas um assistente que se integra à sua rotina para automatizar tarefas repetitivas, como atualizar o CRM e redigir mensagens, e para guiar suas negociações com sugestões inteligentes. A missão do Guido é amplificar seu talento, liberando seu tempo para que você possa focar no que faz de melhor: vender e se relacionar com clientes."
              },
              {
                question: "Como o Guido se diferencia de outros CRMs imobiliários?",
                answer: "Diferente dos CRMs imobiliários tradicionais que são sistemas passivos de armazenamento de dados, o Guido é um guia de IA proativo que age diretamente onde o negócio acontece: nas suas conversas do WhatsApp. Ele não substitui seu CRM, mas sim o potencializa, automatizando a atualização de informações com simples comandos e sugerindo as respostas mais estratégicas em tempo real para quebrar objeções. Em essência, enquanto um CRM exige seu tempo para ser organizado, o Guido devolve seu tempo para que você possa focar exclusivamente em negociar e vender."
              },
              {
                question: "Isso substitui o meu CRM atual?",
                answer: "Não, e essa é a melhor parte! O Guido não é mais um CRM para você alimentar. Ele foi feito para se conectar ao seu sistema de CRM atual e superalimentá-lo. Enquanto seu CRM armazena os dados, o Guido atua sobre eles, automatizando as atualizações e extraindo insights das suas conversas para que suas informações estejam sempre atualizadas sem esforço manual."
              },
              {
                question: "Como funciona a integração com WhatsApp?",
                answer: "Conectamos seu WhatsApp Business ao Guido da mesma forma que você conecta seu WhatsApp Business no WhatsApp Web."
              },
              {
                question: "Preciso mudar meu número de WhatsApp?",
                answer: "Não! O Guido funciona com seu WhatsApp Business atual. Mantemos todo seu histórico e contatos, apenas adicionamos inteligência e organização às suas conversas."
              },
              {
                question: "Como funciona o trial gratuito?",
                answer: "Oferecemos 7 dias de trial completo para você testar todas as funcionalidades. No caso de imobiliárias, toda a equipe pode testar durante o período. Não cobramos cartão antecipadamente e você pode cancelar a qualquer momento."
              },
              {
                question: "Para imobiliárias, como é feita a gestão da equipe?",
                answer: "O administrador da imobiliária convida corretores por email com códigos únicos. Cada corretor tem seu próprio acesso, mas o admin controla a assinatura, visualiza métricas de toda equipe e gerencia permissões. O pagamento é unificado e baseado no número de corretores."
              },
              {
                question: "Que tipo de automações o Guido oferece?",
                answer: "Classificação inteligente de leads por intenção de compra/locação, lembretes automáticos para follow-up, agente notificador para conversas em risco, organização automática no funil de vendas e insights de performance."
              },
              {
                question: "Como funciona o sistema de lembretes?",
                answer: "Criamos lembretes inteligentes baseados no comportamento do cliente: follow-up após visita, retorno de proposta, renovação de contrato, aniversário do cliente. Você pode criar lembretes manuais e personalizar prioridades e tipos (ligação, WhatsApp, email, visita)."
              },
              {
                question: "O que é o \"Funil de Vendas Inteligente\"?",
                answer: "É nosso sistema Kanban adaptado para imobiliário: Lead → Qualificado → Proposta → Negociação → Fechado. Clientes movem-se automaticamente baseado nas interações, ou você pode mover manualmente. Cada estágio tem automações específicas."
              },
              {
                question: "Como funciona a \"Memória Inteligente\" de clientes?",
                answer: "O sistema registra automaticamente todo histórico de interações, preferências mencionadas, orçamento, localização desejada, comentários sobre imóveis visitados. Assim você sempre tem contexto completo antes de qualquer conversa."
              },
              {
                question: "Que métricas posso acompanhar?",
                answer: "Corretor Individual: Conversas ativas, taxa de conversão, tempo médio de resposta, lembretes pendentes, pipeline de negociação. Gestores: Métricas da equipe, ranking de performance, conversas em risco, novos clientes, comparativo mensal de fechamentos."
              },
              {
                question: "Quais formas de pagamento vocês aceitam?",
                answer: "Aceitamos somente Cartão de crédito."
              },
              {
                question: "Posso cancelar a qualquer momento?",
                answer: "Sim, sem multa ou burocracia. Seu acesso permanece até o fim do período pago. Todos seus dados ficam disponíveis para exportação por 30 dias após cancelamento."
              },
              {
                question: "Meus dados de clientes estão seguros?",
                answer: "Absolutamente! Usamos criptografia de ponta, servidores no Brasil, backup automático e compliance LGPD. Seus dados nunca são compartilhados."
              },
              {
                question: "E se eu esquecer de pagar?",
                answer: "Enviamos avisos por email antes do vencimento. Após vencimento, você tem 5 dias de carência. Depois disso, a conta fica suspensa mas seus dados permanecem seguros por 30 dias para regularização."
              },
              {
                question: "É difícil configurar o Guido?",
                answer: "Não! O processo é 100% automatizado. Após cadastro, você deverá conectar seu WhatsApp Business como conecta o WhatsApp Web e em poucos minutos você está operando."
              },
              {
                question: "Preciso treinar minha equipe?",
                answer: "O Guido foi desenhado para ser intuitivo. A maioria dos corretores se adapta em 1-2 dias. Oferecemos treinamento opcional via video-chamada para equipes maiores e material de apoio completo."
              },
              {
                question: "Oferecem suporte técnico?",
                answer: "Sim! Suporte via chat, com agendamento, durante horário comercial."
              },
              {
                question: "O Guido é adequado para corretor iniciante?",
                answer: "Perfeitamente! O sistema ajuda organizar desde o primeiro cliente, automatiza tarefas administrativas e oferece insights para melhorar performance. É um investimento que se paga rapidamente com o aumento de produtividade."
              },
              {
                question: "Como posso testar antes de assinar?",
                answer: "Simples! Cadastre-se para 7 dias de trial gratuito. Não pedimos cartão antecipadamente. Em 5 minutos você está testando com clientes reais. Se não gostar, é só não continuar."
              }
            ].map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>

          {/* Call to Action */}
          <AnimatedSection delay={400}>
            <div className="text-center mt-12 space-y-4">
              <p className="text-gray-400">Ainda tem dúvidas?</p>
              <PremiumButton 
                variant="outline" 
                size="lg"
                onClick={() => openWhatsApp('Olá, estou no site e gostaria de mais informações sobre o Guido')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com nossa Equipe
              </PremiumButton>
            </div>
          </AnimatedSection>
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

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        onSuccess={handleSignupSuccess}
        skipPlanSelection={skipPlanSelection}
        defaultPlan={defaultPlan}
      />

      {/* Botão Flutuante do WhatsApp */}
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer group animate-bounce hover:animate-none transition-all duration-300"
        onClick={() => openWhatsApp('Olá, estou no site e gostaria de mais informações')}
      >
        <div className="relative">
          {/* Shadow effect */}
          <div className="absolute inset-0 bg-[#25D366] rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
          
          {/* Button */}
          <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/50 hover:scale-110 transition-all duration-300 border-4 border-white">
            <img
              src="/images/partners/whatsapp-icon-message.png"
              alt="WhatsApp"
              className="w-8 h-8 object-contain filter invert brightness-0"
            />
          </div>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </div>
      </div>
    </div>
  )
}