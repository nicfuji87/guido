import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

// Simple auth state placeholder (Fase 5 vai trocar por sessão Supabase)
const useAuth = () => ({ isAuthenticated: false })

function PrivateRoute({ children, ...rest }: { children: React.ReactNode; [k: string]: unknown }) {
  const { isAuthenticated } = useAuth()
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

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/app">
          <Dashboard />
        </PrivateRoute>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}


