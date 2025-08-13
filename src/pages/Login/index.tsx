import React from 'react'
import { LoginForm } from '@/components/LoginForm'

export default function Login() {
  const handleLoginSuccess = () => {
    // Optional: redirect logic or additional actions after successful email sent
    // Login link sent successfully
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}


