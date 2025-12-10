// page.tsx

import AuthLayout from '../_components/AuthLayout'
import LoginForm from '../_components/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout description='Welcome back, sign in to continue'>
      <LoginForm />
    </AuthLayout>
  )
}
