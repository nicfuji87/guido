import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useHistory } from 'react-router-dom'

export default function TermosDeUso() {
    const history = useHistory()

    const handleGoBack = () => {
        if (window.history.length > 1) {
            history.goBack()
        } else {
            history.push('/')
        }
    }

    return (
        <div className="min-h-screen bg-[#0D1117] text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-[#0D1117]/95 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm">Voltar</span>
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <img
                        src="/images/guido/guido logo dark - sem fundo.png"
                        alt="Guido"
                        className="h-8 w-auto"
                    />
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Termos de Uso</h1>
                    <p className="text-gray-400">Última atualização: 29 de Dezembro de 2024</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    {/* Seção 1 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            1. Aceitação dos Termos
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Ao acessar e utilizar a plataforma Guido ("Plataforma"), você concorda em cumprir e estar
                            vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer
                            parte destes termos, não deverá usar nossa Plataforma.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            O Guido é uma plataforma de inteligência artificial desenvolvida para auxiliar corretores
                            de imóveis na gestão de leads e comunicação via WhatsApp. Nosso objetivo é aumentar a
                            eficiência e produtividade dos profissionais do mercado imobiliário.
                        </p>
                    </section>

                    {/* Seção 2 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            2. Descrição do Serviço
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            O Guido oferece as seguintes funcionalidades principais:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Análise automatizada de conversas do WhatsApp</li>
                            <li>Identificação e classificação de leads e oportunidades de venda</li>
                            <li>Sistema de lembretes inteligentes para follow-up</li>
                            <li>Sugestões de respostas baseadas em inteligência artificial</li>
                            <li>Dashboard de gestão de clientes e conversas</li>
                            <li>Relatórios e insights de desempenho</li>
                        </ul>
                    </section>

                    {/* Seção 3 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            3. Cadastro e Conta
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Para utilizar o Guido, você deve criar uma conta fornecendo informações precisas,
                            completas e atualizadas. Você é responsável por:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Manter a confidencialidade de suas credenciais de acesso</li>
                            <li>Todas as atividades realizadas em sua conta</li>
                            <li>Notificar imediatamente qualquer uso não autorizado da sua conta</li>
                            <li>Garantir que suas informações cadastrais estejam sempre atualizadas</li>
                        </ul>
                    </section>

                    {/* Seção 4 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            4. Uso Aceitável
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Ao utilizar o Guido, você concorda em:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Utilizar a Plataforma apenas para fins legítimos e profissionais</li>
                            <li>Não violar leis, regulamentos ou direitos de terceiros</li>
                            <li>Não enviar spam ou mensagens não solicitadas em massa</li>
                            <li>Não tentar acessar áreas restritas ou sistemas não autorizados</li>
                            <li>Não compartilhar sua conta com terceiros</li>
                            <li>Respeitar a privacidade dos seus clientes e leads</li>
                        </ul>
                    </section>

                    {/* Seção 5 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            5. Integração com WhatsApp
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            O Guido funciona através de integração com o WhatsApp. Ao conectar sua conta do WhatsApp
                            à nossa Plataforma, você declara que:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Possui autorização para utilizar a conta de WhatsApp conectada</li>
                            <li>Está ciente dos termos de uso do WhatsApp e os cumprirá</li>
                            <li>Concorda que suas conversas serão processadas para fornecer os serviços do Guido</li>
                            <li>É responsável por obter consentimento adequado dos seus contatos quando necessário</li>
                        </ul>
                    </section>

                    {/* Seção 6 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            6. Planos e Pagamentos
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            O Guido oferece diferentes planos de assinatura. Ao assinar um plano pago:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Você concorda com os valores e condições descritos no momento da contratação</li>
                            <li>Os pagamentos são processados de forma segura por provedores terceiros (Asaas)</li>
                            <li>Renovações automáticas serão cobradas conforme o plano escolhido</li>
                            <li>Você pode cancelar sua assinatura a qualquer momento pelo painel de configurações</li>
                            <li>Não há reembolso proporcional para períodos não utilizados, exceto durante o período de teste gratuito</li>
                        </ul>
                    </section>

                    {/* Seção 7 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            7. Período de Teste
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Oferecemos um período de teste gratuito de 7 (sete) dias para novos usuários. Durante este período:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Você terá acesso completo às funcionalidades da Plataforma</li>
                            <li>Não será cobrado nenhum valor</li>
                            <li>Ao final do período, você pode optar por assinar um plano pago ou encerrar o uso</li>
                            <li>Se não houver assinatura, o acesso será suspenso automaticamente</li>
                        </ul>
                    </section>

                    {/* Seção 8 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            8. Propriedade Intelectual
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Todo o conteúdo, código, design, marca, logotipos e demais elementos da Plataforma são
                            de propriedade exclusiva do Guido ou de seus licenciadores. É proibido:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Copiar, modificar ou distribuir qualquer parte da Plataforma</li>
                            <li>Fazer engenharia reversa ou tentar extrair o código-fonte</li>
                            <li>Usar nossa marca sem autorização expressa por escrito</li>
                            <li>Remover avisos de direitos autorais ou propriedade</li>
                        </ul>
                    </section>

                    {/* Seção 9 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            9. Limitação de Responsabilidade
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            O Guido é fornecido "como está" e "conforme disponível". Não garantimos que:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>O serviço será ininterrupto ou livre de erros</li>
                            <li>As sugestões de IA serão sempre precisas ou adequadas</li>
                            <li>Resultados específicos de vendas serão alcançados</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed">
                            Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais,
                            consequenciais ou punitivos, incluindo perda de lucros, dados ou oportunidades de negócio.
                        </p>
                    </section>

                    {/* Seção 10 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            10. Rescisão
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Reservamo-nos o direito de suspender ou encerrar seu acesso à Plataforma, a qualquer momento,
                            sem aviso prévio, caso haja violação destes Termos de Uso ou por qualquer outro motivo
                            razoável. Você também pode encerrar sua conta a qualquer momento através das configurações.
                        </p>
                    </section>

                    {/* Seção 11 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            11. Alterações nos Termos
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Podemos atualizar estes Termos de Uso periodicamente. Notificaremos sobre alterações
                            significativas através da Plataforma ou WhatsApp. O uso continuado após as alterações
                            constitui aceitação dos novos termos.
                        </p>
                    </section>

                    {/* Seção 12 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            12. Lei Aplicável e Foro
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer
                            disputa relacionada a estes termos será resolvida no foro da Comarca de Brasília,
                            Distrito Federal, com exclusão de qualquer outro, por mais privilegiado que seja.
                        </p>
                    </section>

                    {/* Seção 13 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            13. Contato
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
                            <p className="text-white font-medium">Guido - Tecnologia para Corretores</p>
                            <p className="text-gray-400">WhatsApp: +55 (61) 3686-2676</p>
                            <p className="text-gray-400">Brasília, DF - Brasil</p>
                        </div>
                    </section>
                </div>

                {/* Footer links */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
                    <Link to="/politica-de-privacidade" className="text-[#00F6FF] hover:underline">
                        Ver Política de Privacidade
                    </Link>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                        Voltar para a página inicial
                    </Link>
                </div>
            </main>
        </div>
    )
}
