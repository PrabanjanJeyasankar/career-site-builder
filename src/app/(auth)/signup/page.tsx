// page.tsx

import AuthLayout from '@/components/auth/AuthLayout'
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <AuthLayout description='Create your company career site'>
      <SignupForm />
    </AuthLayout>
  )
}
