import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { Button } from '@/components/ui'

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <div className="font-semibold">Guido</div>
          <nav className="flex items-center gap-2">
            <a href="/settings"><Button variant="secondary">Conta</Button></a>
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


