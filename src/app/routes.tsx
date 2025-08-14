import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Integrations from '@/pages/Integrations'
import Conversas from '@/pages/Conversas'
import Clientes from '@/pages/Clientes'
import ClienteDetail from '@/pages/ClienteDetail'

// Auth
import { AuthProvider, useAuth } from '@/hooks/useAuth'

function PrivateRoute({ children, ...rest }: { children: React.ReactNode; [k: string]: unknown }) {
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
        <PrivateRoute exact path="/app">
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/integrations">
          <Integrations />
        </PrivateRoute>
        <PrivateRoute path="/conversations">
          <Conversas />
        </PrivateRoute>
        <PrivateRoute exact path="/clientes">
          <Clientes />
        </PrivateRoute>
        <PrivateRoute path="/clientes/:clienteId">
          <ClienteDetail />
        </PrivateRoute>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}

export default function Routes() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}


