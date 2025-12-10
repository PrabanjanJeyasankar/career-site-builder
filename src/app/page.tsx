// page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect('/login')
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      Main Page
    </div>
  )
}
