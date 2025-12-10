// src/lib/auth/getUser.ts
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export interface UserWithCompany {
  id: string
  email: string
  name?: string
  avatar?: string
  company: {
    id: string
    name: string
  }
  role: 'owner' | 'admin' | 'editor'
}

export async function getCurrentUserWithCompany(): Promise<UserWithCompany> {
  const supabase = await createSupabaseServerClient()

  const { data: user, error: authError } = await supabase.auth.getUser()

  if (authError || !user.user) {
    throw new Error('Not authenticated')
  }

  const { data: companyUser, error: companyError } = await supabase
    .from('company_users')
    .select(
      `
      role,
      email,
      companies!inner (
        id,
        name
      )
    `
    )
    .eq('user_id', user.user.id)
    .single()

  if (companyError || !companyUser) {
    throw new Error('User is not associated with any company')
  }

  const company = Array.isArray(companyUser.companies)
    ? companyUser.companies[0]
    : (companyUser.companies as { id: string; name: string })

  const userMetadata = user.user.user_metadata || {}
  const email = user.user.email || companyUser.email

  const name =
    userMetadata.name || userMetadata.full_name || email.split('@')[0]

  const avatar =
    userMetadata.avatar_url ||
    userMetadata.picture ||
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name)}`

  return {
    id: user.user.id,
    email,
    name,
    avatar,
    company: {
      id: company.id,
      name: company.name,
    },
    role: companyUser.role,
  }
}
