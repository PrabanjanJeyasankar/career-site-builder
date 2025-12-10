'use server'

import { createSupabaseServerClientForActions } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  const supabase = await createSupabaseServerClientForActions()
  await supabase.auth.signOut()
  redirect('/login')
}
