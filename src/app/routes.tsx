import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import AuthCallback from '@/pages/AuthCallback'
import Dashboard from '@/pages/Dashboard'
import Integrations from '@/pages/Integrations'
import Conversas from '@/pages/Conversas'
import Clientes from '@/pages/Clientes'
import ClienteDetail from '@/pages/ClienteDetail'
import { Lembretes } from '@/pages/Lembretes'
import { Configuracoes } from '@/pages/Configuracoes'
import PaymentSuccess from '@/pages/PaymentSuccess'
import TermosDeUso from '@/pages/TermosDeUso'
import PoliticaDePrivacidade from '@/pages/PoliticaDePrivacidade'


// Auth
import { AuthProvider, useAuth } from '@/hooks/useAuth'

// Toast
import { ToastProvider } from '@/contexts/ToastContext'

function PrivateRoute({ children, ...rest }: { children: React.ReactNode;[k: string]: unknown }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <Route
      {...rest}
      render={({ location }: { location: { pathname: string } }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <PrivateRoute exact path="/app">
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/integrations">
          <Integrations />
        </PrivateRoute>
        <PrivateRoute path="/conversations">
          <Conversas />
        </PrivateRoute>
        <PrivateRoute path="/lembretes">
          <Lembretes />
        </PrivateRoute>
        <PrivateRoute exact path="/clientes">
          <Clientes />
        </PrivateRoute>
        <PrivateRoute path="/clientes/:clienteId">
          <ClienteDetail />
        </PrivateRoute>
        <PrivateRoute path="/configuracoes">
          <Configuracoes />
        </PrivateRoute>

        {/* Páginas públicas legais */}
        <Route path="/termos-de-uso" component={TermosDeUso} />
        <Route path="/politica-de-privacidade" component={PoliticaDePrivacidade} />

        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}

export default function Routes() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}


