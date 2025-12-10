// page.tsx

import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout description='Welcome back, sign in to continue'>
      <LoginForm />
    </AuthLayout>
  )
}
