import React from 'react'
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Bell, Trash2, Globe } from 'lucide-react'
import { Link, useHistory } from 'react-router-dom'

export default function PoliticaDePrivacidade() {
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
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F6FF]/20 to-[#0EA5E9]/20 border border-[#00F6FF]/30 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-[#00F6FF]" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">Política de Privacidade</h1>
                        </div>
                    </div>
                    <p className="text-gray-400">Última atualização: 29 de Dezembro de 2024</p>
                </div>

                {/* Resumo visual */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                    {[
                        { icon: Lock, label: 'Dados Seguros', desc: 'Criptografia' },
                        { icon: Eye, label: 'Transparência', desc: 'Total' },
                        { icon: UserCheck, label: 'Seu Controle', desc: 'Sempre' },
                        { icon: Database, label: 'LGPD', desc: 'Conforme' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                            <item.icon className="w-6 h-6 text-[#00F6FF] mx-auto mb-2" />
                            <p className="text-sm font-medium text-white">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    {/* Introdução */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            Introdução
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            O Guido ("nós", "nosso" ou "Plataforma") está comprometido em proteger sua privacidade.
                            Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos
                            suas informações pessoais quando você utiliza nossa plataforma de assistência por IA
                            para corretores de imóveis.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
                            e outras regulamentações aplicáveis de proteção de dados.
                        </p>
                    </section>

                    {/* Seção 1 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                            <Database className="w-5 h-5 text-[#00F6FF]" />
                            1. Dados que Coletamos
                        </h2>

                        <h3 className="text-lg font-medium text-white mt-6">1.1 Dados fornecidos por você</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li><strong>Dados de cadastro:</strong> nome, e-mail, telefone, CPF/CNPJ, endereço</li>
                            <li><strong>Dados profissionais:</strong> CRECI, imobiliária associada, área de atuação</li>
                            <li><strong>Dados de pagamento:</strong> processados de forma segura pelo Asaas (não armazenamos dados de cartão)</li>
                            <li><strong>Comunicações:</strong> mensagens de suporte e feedback enviados a nós</li>
                        </ul>

                        <h3 className="text-lg font-medium text-white mt-6">1.2 Dados coletados automaticamente</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li><strong>Dados de uso:</strong> funcionalidades utilizadas, tempo de sessão, interações</li>
                            <li><strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo, navegador, sistema operacional</li>
                            <li><strong>Cookies e tecnologias similares:</strong> para melhorar sua experiência</li>
                        </ul>

                        <h3 className="text-lg font-medium text-white mt-6">1.3 Dados do WhatsApp</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Quando você conecta sua conta do WhatsApp ao Guido, processamos:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Mensagens de texto das conversas selecionadas</li>
                            <li>Informações dos contatos (nome, número de telefone)</li>
                            <li>Metadados das conversas (data, hora)</li>
                        </ul>
                        <div className="bg-[#00F6FF]/10 border border-[#00F6FF]/30 rounded-xl p-4 mt-4">
                            <p className="text-sm text-[#00F6FF]">
                                <strong>Importante:</strong> Não armazenamos mídias (fotos, vídeos, áudios) das suas conversas.
                                Processamos apenas o conteúdo textual necessário para fornecer nossos serviços.
                            </p>
                        </div>
                    </section>

                    {/* Seção 2 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-[#00F6FF]" />
                            2. Como Usamos Seus Dados
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Utilizamos suas informações para as seguintes finalidades:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li><strong>Prestação do serviço:</strong> analisar conversas, identificar leads, gerar sugestões de resposta</li>
                            <li><strong>Comunicação:</strong> enviar notificações, lembretes e atualizações sobre o serviço</li>
                            <li><strong>Melhoria contínua:</strong> aprimorar nossos algoritmos e funcionalidades</li>
                            <li><strong>Suporte:</strong> responder suas dúvidas e solicitações</li>
                            <li><strong>Segurança:</strong> detectar e prevenir fraudes ou atividades maliciosas</li>
                            <li><strong>Obrigações legais:</strong> cumprir exigências legais e regulatórias</li>
                        </ul>
                    </section>

                    {/* Seção 3 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#00F6FF]" />
                            3. Compartilhamento de Dados
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Não vendemos, alugamos ou comercializamos seus dados pessoais. Podemos compartilhar
                            informações apenas nas seguintes situações:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li><strong>Provedores de serviço:</strong> parceiros que nos auxiliam na operação (ex: Supabase para banco de dados, Asaas para pagamentos, serviços de IA para processamento)</li>
                            <li><strong>Requisições legais:</strong> quando exigido por ordem judicial ou autoridade competente</li>
                            <li><strong>Proteção de direitos:</strong> para defender nossos direitos, privacidade, segurança ou propriedade</li>
                            <li><strong>Transferência de negócio:</strong> em caso de fusão, aquisição ou venda de ativos</li>
                        </ul>
                    </section>

                    {/* Seção 4 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#00F6FF]" />
                            4. Segurança dos Dados
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Implementamos medidas técnicas e organizacionais robustas para proteger seus dados:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Criptografia de dados em trânsito (TLS/SSL) e em repouso</li>
                            <li>Armazenamento em servidores seguros com certificações de segurança</li>
                            <li>Controle de acesso rigoroso com autenticação multifator</li>
                            <li>Monitoramento contínuo de ameaças e vulnerabilidades</li>
                            <li>Políticas internas de segurança da informação</li>
                            <li>Backups regulares e planos de recuperação de desastres</li>
                        </ul>
                    </section>

                    {/* Seção 5 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-[#00F6FF]" />
                            5. Retenção de Dados
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Mantemos seus dados pessoais pelo tempo necessário para:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Fornecer nossos serviços enquanto sua conta estiver ativa</li>
                            <li>Cumprir obrigações legais, contratuais e regulatórias</li>
                            <li>Resolver disputas e fazer cumprir nossos acordos</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed">
                            Após o encerramento da conta, manteremos dados essenciais por até 5 anos para fins
                            fiscais e legais, conforme exigido pela legislação brasileira.
                        </p>
                    </section>

                    {/* Seção 6 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-[#00F6FF]" />
                            6. Seus Direitos (LGPD)
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            {[
                                { title: 'Confirmação e Acesso', desc: 'Saber se tratamos seus dados e obter cópia' },
                                { title: 'Correção', desc: 'Solicitar correção de dados incompletos ou inexatos' },
                                { title: 'Anonimização', desc: 'Solicitar anonimização ou bloqueio de dados' },
                                { title: 'Portabilidade', desc: 'Transferir seus dados para outro serviço' },
                                { title: 'Eliminação', desc: 'Solicitar exclusão dos dados tratados com consentimento' },
                                { title: 'Revogação', desc: 'Retirar consentimento a qualquer momento' },
                            ].map((right, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-1">{right.title}</h4>
                                    <p className="text-sm text-gray-400">{right.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            Para exercer qualquer desses direitos, entre em contato através do WhatsApp: +55 (61) 3686-2676
                        </p>
                    </section>

                    {/* Seção 7 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-[#00F6FF]" />
                            7. Cookies e Tecnologias de Rastreamento
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Utilizamos cookies e tecnologias similares para melhorar sua experiência. Os tipos de cookies incluem:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li><strong>Essenciais:</strong> necessários para o funcionamento básico da plataforma</li>
                            <li><strong>Analíticos:</strong> para entender como você usa o serviço e melhorá-lo</li>
                            <li><strong>Funcionais:</strong> para lembrar suas preferências</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed">
                            Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                        </p>
                    </section>

                    {/* Seção 8 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-[#00F6FF]" />
                            8. Exclusão de Dados
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Você pode solicitar a exclusão dos seus dados a qualquer momento:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Pelo painel de configurações da sua conta</li>
                            <li>Entrando em contato pelo WhatsApp</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed">
                            Processaremos sua solicitação em até 15 dias úteis, sujeito às retenções legais obrigatórias.
                        </p>
                    </section>

                    {/* Seção 9 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            9. Menores de Idade
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            O Guido é destinado exclusivamente a usuários maiores de 18 anos. Não coletamos
                            intencionalmente dados de menores de idade. Se tomarmos conhecimento de que coletamos
                            dados de um menor, tomaremos medidas para excluir essas informações.
                        </p>
                    </section>

                    {/* Seção 10 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            10. Alterações nesta Política
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações
                            significativas, notificaremos você através da Plataforma ou WhatsApp.
                            Recomendamos revisar esta página regularmente.
                        </p>
                    </section>

                    {/* Seção 11 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            11. Contato do Encarregado de Dados (DPO)
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Para questões relacionadas à proteção de dados ou para exercer seus direitos, entre em contato
                            com nosso Encarregado de Proteção de Dados:
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
                            <p className="text-white font-medium">Guido - Proteção de Dados</p>
                            <p className="text-gray-400">WhatsApp: +55 (61) 3686-2676</p>
                            <p className="text-gray-400">Brasília, DF - Brasil</p>
                        </div>
                    </section>

                    {/* Seção 12 */}
                    <section className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white border-b border-white/10 pb-3">
                            12. Autoridade Nacional de Proteção de Dados
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Caso tenha dúvidas ou reclamações sobre o tratamento dos seus dados que não tenham sido
                            resolvidas por nós, você pode entrar em contato com a Autoridade Nacional de Proteção de
                            Dados (ANPD):
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
                            <p className="text-white font-medium">ANPD - Autoridade Nacional de Proteção de Dados</p>
                            <p className="text-gray-400">Site: <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-[#00F6FF] hover:underline">www.gov.br/anpd</a></p>
                        </div>
                    </section>
                </div>

                {/* Footer links */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
                    <Link to="/termos-de-uso" className="text-[#00F6FF] hover:underline">
                        Ver Termos de Uso
                    </Link>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                        Voltar para a página inicial
                    </Link>
                </div>
            </main>
        </div>
    )
}
