// page.tsx
import { getCurrentUserWithCompany } from '@/lib/auth/getUser'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  try {
    await getCurrentUserWithCompany()
    redirect('/editor')
  } catch {
    redirect('/login')
  }
}
