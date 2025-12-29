import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Target, Users, Home, Clock, AlertTriangle, MessageSquare, MessageCircle, Settings, CheckCircle, Brain, Star, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui'
import { NavBar } from '@/components/NavBar'
import { VideoPlayer } from '@/components/VideoPlayer'
import { AnimatedSection } from '@/components/AnimatedSection'
import { BeamsBackground } from '@/components/BeamsBackground'
import { SignupModal } from '@/components/SignupModal'
import { GradientText } from '@/components/GradientText'
import { FloatingCard } from '@/components/FloatingCard'
import { PremiumButton } from '@/components/PremiumButton'
import { ParticleBackground } from '@/components/ParticleBackground'

// FAQ Component
const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AnimatedSection delay={Math.min(index * 50, 300)}>
      <div className={`rounded-xl border transition-all duration-300 ${isOpen ? 'bg-white/[0.03] border-[#00F6FF]/30 shadow-[0_0_20px_rgba(0,246,255,0.08)]' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10 hover:bg-white/[0.04]'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3"
        >
          <h3 className={`text-sm sm:text-base font-medium transition-colors ${isOpen ? 'text-white' : 'text-gray-200'}`}>{question}</h3>
          <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#00F6FF]/20 rotate-180' : 'bg-white/5'}`}>
            <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${isOpen ? 'text-[#00F6FF]' : 'text-gray-400'}`} />
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-white/5">
            <div className="pt-3 sm:pt-4 text-gray-400 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {answer}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default function Landing() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [skipPlanSelection, setSkipPlanSelection] = useState(false)
  const [defaultPlan, setDefaultPlan] = useState<'INDIVIDUAL' | 'IMOBILIARIA'>('INDIVIDUAL')
  const [showStickyCTA, setShowStickyCTA] = useState(false)

  // Detectar scroll para mostrar CTA sticky no mobile
  useEffect(() => {
    const handleScroll = () => {
      // Mostrar CTA após scroll de 60% da viewport
      const scrollThreshold = window.innerHeight * 0.6
      setShowStickyCTA(window.scrollY > scrollThreshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 pb-8 lg:pt-0 lg:pb-0">
        <ParticleBackground className="opacity-20 lg:opacity-30" particleCount={15} />
        <BeamsBackground className="absolute inset-0" intensity="subtle" />

        {/* Gradient orb decorations */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00F6FF]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Content Column */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-5 lg:space-y-8">
              {/* Logo */}
              <AnimatedSection delay={0}>
                <img
                  src="/images/guido/guido logo dark - sem fundo.png"
                  alt="Guido Logo"
                  className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain mx-auto lg:mx-0"
                />
              </AnimatedSection>

              {/* Badge - Hidden on smallest mobile */}
              <AnimatedSection delay={100}>
                <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F6FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F6FF]"></span>
                  </span>
                  <span className="text-sm text-gray-300">IA para Corretores de Imóveis</span>
                </div>
              </AnimatedSection>

              {/* Main Headline - Completa e impactante */}
              <AnimatedSection delay={150}>
                <h1 className="text-[1.6rem] sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-[1.2] tracking-tight">
                  <span className="text-white">Nunca mais perca dinheiro com </span>
                  <span className="bg-gradient-to-r from-[#00F6FF] via-[#00D4FF] to-[#0EA5E9] bg-clip-text text-transparent">leads esquecidos</span>
                  <span className="text-white"> no </span>
                  <span className="text-[#25D366]">WhatsApp</span>
                </h1>
              </AnimatedSection>

              {/* Video - Mobile Only - Logo após headline */}
              <div className="lg:hidden">
                <AnimatedSection delay={200}>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#00F6FF]/20 to-[#0EA5E9]/20 rounded-2xl blur-xl" />
                    <div className="relative bg-white/[0.03] rounded-xl border border-white/10 p-1">
                      <VideoPlayer
                        thumbnailUrl="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="▶ Veja como funciona"
                        description=""
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* CTA - Mobile: logo abaixo do vídeo */}
              <AnimatedSection delay={300}>
                <div className="flex flex-col items-center lg:items-start gap-3">
                  <PremiumButton
                    size="lg"
                    shimmer
                    className="group w-full sm:w-auto text-base"
                    onClick={() => {
                      const pricingSection = document.getElementById('pricing');
                      pricingSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Começar Grátis por 7 Dias
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </PremiumButton>

                  {/* Trust badges inline with CTA */}
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" /> Sem cartão
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" /> 7 dias grátis
                    </span>
                  </div>
                </div>
              </AnimatedSection>

              {/* Subheadline - Desktop only */}
              <AnimatedSection delay={400} className="hidden lg:block">
                <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl">
                  O Guido identifica oportunidades, lembra quem responder e sugere as melhores respostas para <span className="text-white font-medium">vender mais imóveis</span>.
                </p>
              </AnimatedSection>

              {/* Secondary CTA - Desktop only */}
              <AnimatedSection delay={500} className="hidden lg:block">
                <button
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#00F6FF]/50 hover:bg-white/5 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  Ver como funciona
                </button>
              </AnimatedSection>

              {/* Social Proof - Mobile: mais compacto */}
              <AnimatedSection delay={400}>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex -space-x-1.5 sm:-space-x-2">
                      {[
                        'bg-gradient-to-br from-blue-400 to-blue-600',
                        'bg-gradient-to-br from-purple-400 to-purple-600',
                        'bg-gradient-to-br from-pink-400 to-pink-600',
                        'bg-gradient-to-br from-orange-400 to-orange-600',
                        'bg-gradient-to-br from-green-400 to-green-600'
                      ].map((bg, i) => (
                        <div key={i} className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${bg} border-2 border-[#0D1117] flex items-center justify-center shadow-lg`}>
                          <span className="text-[10px] sm:text-xs font-medium text-white/90">👤</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs sm:text-sm">
                      <span className="text-[#00F6FF] font-semibold">+2.000</span>
                      <span className="text-gray-400"> corretores</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-400">4.9/5</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Video Column - Desktop Only */}
            <div className="relative hidden lg:block">
              <AnimatedSection delay={400}>
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#00F6FF]/20 via-[#0EA5E9]/10 to-[#00F6FF]/20 rounded-3xl blur-2xl opacity-60" />

                  {/* Video container */}
                  <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-1.5 shadow-2xl">
                    <VideoPlayer
                      thumbnailUrl="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                      videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Veja o Guido em Ação"
                      description="2 minutos para entender"
                      className="rounded-xl overflow-hidden"
                    />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -left-4 bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F6FF]/20 to-[#00F6FF]/5 border border-[#00F6FF]/30 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-[#00F6FF]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Integração WhatsApp</div>
                        <div className="text-xs text-gray-500">Funciona no seu número</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>

        {/* Scroll indicator - Desktop */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-gray-600">
          <span className="text-xs">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">
                Sua rotina parece{' '}
                <GradientText gradient="primary">familiar</GradientText>?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
                Esses desafios estão custando vendas todos os dias
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {[
              {
                icon: Clock,
                title: "Horas gastas no CRM",
                description: "Inserção manual de dados e atualizações constantes. Tempo que deveria ser usado vendendo.",
                color: "from-orange-500/20 to-orange-500/5",
                iconColor: "text-orange-400",
                borderColor: "border-orange-500/20",
                delay: 0
              },
              {
                icon: AlertTriangle,
                title: "Oportunidades perdidas",
                description: "Sem automação para follow-ups e lembretes. Clientes quentes esfriam enquanto você está ocupado.",
                color: "from-red-500/20 to-red-500/5",
                iconColor: "text-red-400",
                borderColor: "border-red-500/20",
                delay: 100
              },
              {
                icon: MessageSquare,
                title: "Conversas esquecidas",
                description: "Dezenas de chats para gerenciar. Você perde leads alternando entre WhatsApp, e-mails e ligações.",
                color: "from-yellow-500/20 to-yellow-500/5",
                iconColor: "text-yellow-400",
                borderColor: "border-yellow-500/20",
                delay: 200
              },
              {
                icon: MessageCircle,
                title: 'Leads que "somem"',
                description: "Conversas que esfriam por falta de timing. Sem estratégias de reengajamento, leads desaparecem.",
                color: "from-purple-500/20 to-purple-500/5",
                iconColor: "text-purple-400",
                borderColor: "border-purple-500/20",
                delay: 300
              },
              {
                icon: Brain,
                title: "Falta de contexto",
                description: "Difícil lembrar detalhes de cada cliente. Sem histórico organizado, suas respostas perdem personalização.",
                color: "from-pink-500/20 to-pink-500/5",
                iconColor: "text-pink-400",
                borderColor: "border-pink-500/20",
                delay: 400
              },
              {
                icon: Settings,
                title: "Sem argumentos na hora H",
                description: "Precisa pensar nas respostas certas sob pressão. Objeções viram vendas perdidas.",
                color: "from-blue-500/20 to-blue-500/5",
                iconColor: "text-blue-400",
                borderColor: "border-blue-500/20",
                delay: 500
              }
            ].map((problem, index) => (
              <AnimatedSection key={index} delay={problem.delay}>
                <div className={`group h-full rounded-xl bg-gradient-to-br ${problem.color} border ${problem.borderColor} p-3 sm:p-4 lg:p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg`}>
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <problem.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${problem.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">
                        {problem.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA após problemas */}
          <AnimatedSection delay={600}>
            <div className="text-center mt-8 sm:mt-12 lg:mt-16">
              <p className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4">Reconhece esses problemas?</p>
              <button
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-[#00F6FF] hover:text-white transition-colors font-medium text-sm sm:text-base"
              >
                Veja como o Guido resolve
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F6FF]/[0.02] to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(0,246,255,0.08)_0%,_transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00F6FF]/10 border border-[#00F6FF]/20">
                  <Zap className="w-4 h-4 text-[#00F6FF]" />
                  <span className="text-sm text-[#00F6FF] font-medium">Potencializado por IA</span>
                </div>

                {/* Headline */}
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Seu copiloto de vendas{' '}
                    <span className="bg-gradient-to-r from-[#00F6FF] to-[#0EA5E9] bg-clip-text text-transparent">24/7</span>
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    O Guido trabalha junto com você no WhatsApp, automatizando tarefas e sugerindo as melhores ações para fechar mais negócios.
                  </p>
                </div>

                {/* Benefits list */}
                <ul className="space-y-4">
                  {[
                    { text: "Sugestões de resposta em tempo real", highlight: "IA contextual" },
                    { text: "Atualização automática do CRM", highlight: "Zero trabalho manual" },
                    { text: "Lembretes inteligentes de follow-up", highlight: "Nunca esqueça" },
                    { text: "Resumo completo de cada cliente", highlight: "Contexto sempre" }
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#00F6FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00F6FF]" />
                      </div>
                      <div>
                        <span className="text-white">{benefit.text}</span>
                        <span className="text-gray-500 text-sm ml-2">— {benefit.highlight}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Funciona no seu WhatsApp atual</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -inset-8 bg-gradient-to-r from-[#00F6FF]/10 via-transparent to-[#0EA5E9]/10 rounded-3xl blur-3xl" />

                {/* Main image container */}
                <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl border border-white/10 p-2 shadow-2xl">
                  <img
                    src="/images/partners/whatsapp-hand-animation.jpg"
                    alt="Guido no WhatsApp"
                    className="w-full rounded-xl"
                  />
                </div>

                {/* Floating stats card */}
                <div className="absolute -top-6 -right-6 bg-[#0D1117]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">+40%</div>
                      <div className="text-xs text-gray-500">mais conversões</div>
                    </div>
                  </div>
                </div>

                {/* Floating WhatsApp badge */}
                <div className="absolute -bottom-4 -left-4 bg-[#0D1117]/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <span className="text-white font-medium">WhatsApp</span>
                      <span className="text-gray-500 ml-1">conectado</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="text-sm text-gray-400">Funcionalidades</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Tudo que você precisa para{' '}
                <span className="bg-gradient-to-r from-[#00F6FF] to-[#0EA5E9] bg-clip-text text-transparent">vender mais</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Recursos inteligentes que trabalham silenciosamente para maximizar cada oportunidade
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Assistente de Vendas",
                description: "Sugestões de respostas personalizadas para cada cliente. A IA analisa o contexto e guia você para o fechamento.",
                gradient: "from-cyan-500/20 to-cyan-500/5"
              },
              {
                icon: Settings,
                title: "CRM Automatizado",
                description: "Diga ao Guido e ele atualiza status, adiciona notas e registra contatos automaticamente no seu CRM.",
                gradient: "from-blue-500/20 to-blue-500/5"
              },
              {
                icon: Brain,
                title: "Memória Inteligente",
                description: "Resume históricos e lembra detalhes importantes de cada cliente. Como um assistente que nunca esquece.",
                gradient: "from-purple-500/20 to-purple-500/5"
              },
              {
                icon: Clock,
                title: "Alertas Proativos",
                description: "Lembretes de follow-up, alertas de visitas agendadas e notificações de renovação. Nunca perca timing.",
                gradient: "from-orange-500/20 to-orange-500/5"
              },
              {
                icon: CheckCircle,
                title: "Pós-Venda Inteligente",
                description: "Mensagens automáticas para acompanhar clientes após a compra. Construa relacionamentos duradouros.",
                gradient: "from-green-500/20 to-green-500/5"
              },
              {
                icon: Zap,
                title: "Insights de Performance",
                description: "Métricas de conversão, tempo de resposta e pipeline. Entenda o que funciona e otimize seu processo.",
                gradient: "from-yellow-500/20 to-yellow-500/5"
              }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className={`group h-full rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/[0.06] p-6 hover:border-white/10 transition-all duration-300`}>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/[0.08] transition-all">
                      <feature.icon className="h-6 w-6 text-[#00F6FF]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00F6FF] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Integrations */}
      <section id="mission" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Gradient background para manter consistência com tema escuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117] via-[#0a0f14] to-[#0D1117]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,246,255,0.08)_0%,_transparent_70%)]" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <AnimatedSection>
            <div className="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Por Trás da <GradientText gradient="primary">Inteligência</GradientText>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                Guido foi criado para libertar o corretor da sobrecarga digital, permitindo foco total nas pessoas e negociações.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="space-y-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-white px-4">
                Integrações Diretas com seu <GradientText gradient="primary">CRM Imobiliário</GradientText>
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto px-4">
                O Guido faz atualizações e consultas de forma autônoma no sistema que você usa na imobiliária.
              </p>
              <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 flex-wrap px-4">
                <div className="group cursor-pointer">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15 group-hover:border-[#00F6FF]/30">
                    <img
                      src="/images/partners/download.png"
                      alt="RD Station"
                      className="h-10 sm:h-12 lg:h-14 w-auto"
                    />
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15 group-hover:border-[#00F6FF]/30">
                    <img
                      src="/images/partners/download (1).png"
                      alt="iMoview"
                      className="h-8 sm:h-10 lg:h-12 w-auto"
                    />
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15 group-hover:border-[#00F6FF]/30">
                    <img
                      src="/images/partners/Logo-loft-23.png"
                      alt="Loft"
                      className="h-8 sm:h-10 lg:h-12 w-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative elements - ajustado para tema escuro */}
              <div className="relative mt-12">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-lg border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-[#0a0f14] text-gray-500">Conecte-se com facilidade</span>
                </div>
              </div>

              {/* Steps visual element */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-md mx-auto mt-8 px-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00F6FF]/20 to-[#00F6FF]/5 border border-[#00F6FF]/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,246,255,0.15)]">
                    <span className="text-[#00F6FF] font-bold text-base sm:text-lg">1</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 text-center font-medium">Conectar</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00F6FF]/20 to-[#00F6FF]/5 border border-[#00F6FF]/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,246,255,0.15)]">
                    <span className="text-[#00F6FF] font-bold text-base sm:text-lg">2</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 text-center font-medium">Sincronizar</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00F6FF]/20 to-[#00F6FF]/5 border border-[#00F6FF]/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,246,255,0.15)]">
                    <span className="text-[#00F6FF] font-bold text-base sm:text-lg">3</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 text-center font-medium">Vender Mais</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Plano Corretor */}
            <AnimatedSection delay={200}>
              <FloatingCard className="relative h-full" glowIntensity="high">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#00F6FF] to-[#0EA5E9] text-[#0D1117] font-semibold border-0">
                  ⭐ Mais Popular
                </Badge>
                <div className="text-center space-y-4 pt-4">
                  <div>
                    <h3 className="text-xl font-bold">Plano Corretor</h3>
                    <p className="text-gray-400 text-sm">Ideal para profissionais autônomos</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-4xl font-extrabold">
                      <GradientText gradient="primary">R$ 149</GradientText>
                      <span className="text-lg font-normal text-gray-400">/mês</span>
                    </div>
                    <p className="text-sm text-gray-300">ou R$ 1.490/ano <span className="text-[#00F6FF] font-medium">(2 meses grátis)</span></p>
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

                  <p className="text-xs text-gray-400">✅ 7 dias grátis • ✅ Cancele a qualquer momento</p>
                </div>
              </FloatingCard>
            </AnimatedSection>

            {/* Plano Imobiliária */}
            <AnimatedSection delay={400}>
              <FloatingCard className="h-full border-2 border-[#00F6FF]/20">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">Plano Imobiliária</h3>
                    <p className="text-gray-400 text-sm">Para equipes e imobiliárias</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-4xl font-extrabold">
                      <GradientText gradient="primary">Consultar</GradientText>
                    </div>
                    <p className="text-sm text-gray-300">Preço personalizado por usuário</p>
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

                  <p className="text-xs text-gray-400">📞 Resposta em até 2h • 🎯 Consultoria gratuita</p>
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
          <div className="flex flex-col items-center space-y-6">
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

            {/* Links Legais */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <Link to="/termos-de-uso" className="text-gray-400 hover:text-[#00F6FF] transition-colors">
                Termos de Uso
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <Link to="/politica-de-privacidade" className="text-gray-400 hover:text-[#00F6FF] transition-colors">
                Política de Privacidade
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <button
                onClick={() => openWhatsApp('Olá, preciso de suporte')}
                className="text-gray-400 hover:text-[#00F6FF] transition-colors"
              >
                Suporte
              </button>
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

      {/* Mobile Sticky CTA - aparece após scroll */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      >
        {/* Gradient fade effect */}
        <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />

        <div className="bg-[#0D1117]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-bottom">
          <button
            onClick={() => {
              const pricingSection = document.getElementById('pricing');
              pricingSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00F6FF] to-[#0EA5E9] text-black font-semibold py-3.5 px-6 rounded-xl shadow-[0_4px_20px_rgba(0,246,255,0.4)] active:scale-[0.98] transition-transform"
          >
            Começar Grátis por 7 Dias
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            ✓ Sem cartão de crédito • ✓ Cancele quando quiser
          </p>
        </div>
      </div>

      {/* Botão Flutuante do WhatsApp - ajustado para mobile */}
      <div
        className={`fixed z-50 cursor-pointer group transition-all duration-300 ${showStickyCTA ? 'bottom-28 lg:bottom-6' : 'bottom-6'} right-4 lg:right-6`}
        onClick={() => openWhatsApp('Olá, estou no site e gostaria de mais informações')}
      >
        <div className="relative">
          {/* Shadow effect */}
          <div className="absolute inset-0 rounded-full blur-xl opacity-30 bg-black group-hover:opacity-50 transition-opacity" />

          {/* Icon only */}
          <div className="relative hover:scale-110 transition-all duration-300">
            <img
              src="/images/partners/whatsapp-icon-message.png"
              alt="WhatsApp"
              className="w-14 h-14 lg:w-16 lg:h-16 object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}