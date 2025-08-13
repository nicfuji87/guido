import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label, Input, Button } from '@/components/ui'

export default function Login() {
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
              <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
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
      <aside className="relative hidden bg-[var(--color-bg)] lg:block">
        <img src="/placeholder.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      </aside>
    </main>
  )
}


