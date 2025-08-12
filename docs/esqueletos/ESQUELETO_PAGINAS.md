## Esqueleto das Páginas (usando shadcn via MCP — adaptado para React 16 + TS 3.4)

AI dev note: Os blocks do shadcn (ex.: `login-02`, `dashboard-01`) servem de referência visual. Para compatibilidade com TS 3.4/React 16, use apenas componentes base vendorizados via MCP: `button`, `input`, `label`, `textarea`, `card`, `badge`, `separator`, `skeleton`.

### Landing (`/`)
Componentes: `Button`, `Badge`, `Separator`, `Card` (para seções destacadas)

```tsx
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-main text-[var(--color-text)]">
      <header className="container mx-auto flex items-center justify-between py-6">
        <div className="text-xl font-semibold">Guido</div>
        <nav>
          <Button as="a" href="/login" variant="primary">Entrar</Button>
        </nav>
      </header>
      <section className="container mx-auto flex flex-col items-center gap-6 py-24 text-center">
        <Badge>O guia inteligente do corretor</Badge>
        <h1 className="max-w-[820px] text-4xl font-bold md:text-6xl">
          Menos digitação, mais negociação.
        </h1>
        <p className="text-lg text-white/80 md:text-xl">
          Plataforma de IA que guia, automatiza e notifica sua rotina de conversas.
        </p>
        <div className="flex gap-3">
          <Button as="a" href="/login">Começar agora</Button>
          <Button variant="secondary" as="a" href="#recursos">Ver recursos</Button>
        </div>
      </section>
      <section id="recursos" className="container mx-auto grid gap-6 pb-24 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Guia de Conversas</CardTitle>
          </CardHeader>
          <CardContent>Respostas estratégicas com contexto.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CRM Automatizado</CardTitle>
          </CardHeader>
          <CardContent>Atualizações com comandos simples.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agente Notificador</CardTitle>
          </CardHeader>
          <CardContent>Alertas proativos sobre conversas críticas.</CardContent>
        </Card>
      </section>
      <footer className="container mx-auto py-10 text-center text-white/60">© {new Date().getFullYear()} Guido</footer>
    </main>
  )
}
```

### Login (`/login`)
Referência: block `login-02` (estrutura). Componentes: `Card`, `Label`, `Input`, `Button`, `Separator`.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-[var(--color-accent)] text-black">G</div>
            Guido
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Acessar sua conta</CardTitle>
              <CardDescription>Informe seu e-mail para receber o link</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="voce@exemplo.com" required />
                </div>
                <Button type="submit" className="w-full">Enviar link</Button>
              </form>
            </CardContent>
            <CardFooter className="text-center text-sm text-white/70">Ao continuar, você concorda com os termos.</CardFooter>
          </Card>
        </div>
      </section>
      <aside className="relative hidden lg:block bg-[var(--color-bg)]">
        <img src="/placeholder.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      </aside>
    </main>
  )
}
```

### Dashboard (`/app`)
Referência: block `dashboard-01` (cards métricas). Componentes: `Card`, `Badge`, `Button`.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <div className="font-semibold">Guido</div>
          <nav className="flex items-center gap-2">
            <Button variant="secondary" as="a" href="/settings">Conta</Button>
            <Button variant="ghost">Sair</Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto grid gap-6 py-8 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Conversas pendentes</CardDescription>
            <CardTitle>8</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Novos leads</CardDescription>
            <CardTitle>12</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Visitas agendadas</CardDescription>
            <CardTitle>5</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Propostas enviadas</CardDescription>
            <CardTitle>3</CardTitle>
          </CardHeader>
        </Card>
      </main>
    </div>
  )
}
```

### Notas de compatibilidade
- Evite Radix e componentes que dependam de React 18 (dialog, drawer, dropdown, tabs, tooltip, select, avatar, sidebar avançado).
- Use blocks apenas como guia de layout e classes. Recrie com componentes base quando necessário.

### Segurança (páginas)
- Landing é pública e não deve carregar sessão/token.
- Login não deve expor chaves secretas; apenas `anon` em runtime.
- Dashboard deve buscar dados respeitando RLS; nenhuma credencial sensível no cliente.


