// loginAction.ts
'use server'

import { createSupabaseServerClientForActions } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function loginAction(email: string, password: string) {
  const supabase = await createSupabaseServerClientForActions()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error('Login failed - no user data received')
  }

  // Revalidate the page to update authentication state
  revalidatePath('/', 'layout')

  return { success: true }
}
