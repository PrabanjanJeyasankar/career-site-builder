// company.ts
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { CompanyUser } from '@/types/database'

const supabasePromise = createSupabaseServerClient()

export async function getCurrentUserCompanyId(): Promise<string> {
  const supabase = await supabasePromise
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!data) throw new Error('User is not associated with any company')
  return data.company_id
}

export async function getCurrentCompanyUser(): Promise<CompanyUser> {
  const supabase = await supabasePromise
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data } = await supabase
    .from('company_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!data) throw new Error('User is not associated with a company')
  return data as CompanyUser
}

export async function hasRole(
  allowedRoles: Array<'owner' | 'admin' | 'editor'>
): Promise<boolean> {
  try {
    const companyUser = await getCurrentCompanyUser()
    return allowedRoles.includes(companyUser.role)
  } catch {
    return false
  }
}

export async function getCurrentCompanyName(): Promise<string> {
  const supabase = await supabasePromise
  const companyId = await getCurrentUserCompanyId()

  const { data } = await supabase
    .from('companies')
    .select('name')
    .eq('id', companyId)
    .single()

  if (!data) throw new Error('Company not found')
  return data.name
}
