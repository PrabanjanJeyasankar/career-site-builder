// logoutAction.ts
'use server'

import { createSupabaseServerClientForActions } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  const supabase = await createSupabaseServerClientForActions()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error('Failed to sign out')
  }

  redirect('/login')
}
