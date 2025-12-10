'use server'

import { createSupabaseServerClientForActions } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(email: string, password: string) {
  const supabase = await createSupabaseServerClientForActions()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  if (!data.user) {
    return { error: 'Login failed - no user data returned' }
  }

  redirect('/')
}
