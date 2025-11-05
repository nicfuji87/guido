import React, { useEffect, useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function Login() {
  const [searchParams] = useSearchParams()
  const [showConfirmMessage, setShowConfirmMessage] = useState(false)
  
  useEffect(() => {
    // Mostrar mensagem se vier do email de confirmação
    if (searchParams.get('confirmacao') === 'true') {
      setShowConfirmMessage(true)
      // Remover o parâmetro da URL após 5 segundos
      setTimeout(() => {
        window.history.replaceState({}, '', '/login')
      }, 5000)
    }
  }, [searchParams])
  
  const handleLoginSuccess = () => {
    // Optional: redirect logic or additional actions after successful email sent
    // Login link sent successfully
  };

  // Função para abrir WhatsApp com mensagem pré-definida para login
  const openWhatsApp = (message: string) => {
    const phoneNumber = '556136862676'
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
  }

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          {/* Mensagem de confirmação de email */}
          {showConfirmMessage && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">
                  Email confirmado com sucesso! Faça login para continuar.
                </p>
              </div>
            </div>
          )}
          
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>

      {/* Botão Flutuante do WhatsApp */}
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer group animate-bounce hover:animate-none transition-all duration-300"
        onClick={() => openWhatsApp('Olá, estou com dúvidas na página de login')}
      >
        <div className="relative">
          {/* Shadow effect */}
          <div className="absolute inset-0 rounded-full blur-xl opacity-30 bg-black group-hover:opacity-50 transition-opacity" />
          
          {/* Icon only */}
          <div className="relative hover:scale-110 transition-all duration-300">
            <img
              src="/images/partners/whatsapp-icon-message.png"
              alt="WhatsApp"
              className="w-16 h-16 object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </>
  )
}


