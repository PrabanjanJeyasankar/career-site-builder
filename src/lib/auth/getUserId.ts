'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getCurrentUserId() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    throw new Error('Not authenticated')
  }

  return data.user.id
}
