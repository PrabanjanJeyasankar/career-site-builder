'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { CompanyUser } from '@/types/database'

export async function getCurrentUserCompanyId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('User not authenticated')

  const { data } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!data) return null

  return data.company_id
}

export async function getCurrentCompanyUser(): Promise<CompanyUser> {
  const supabase = await createSupabaseServerClient()

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
  const supabase = await createSupabaseServerClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) throw new Error('User is not associated with any company')

  const { data } = await supabase
    .from('companies')
    .select('name')
    .eq('id', companyId)
    .single()

  if (!data) throw new Error('Company not found')

  return data.name
}

export async function getCompanyNameById(
  companyId: string
): Promise<string | null> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('companies')
    .select('name')
    .eq('id', companyId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch company name by id', error)
    return null
  }

  return data?.name ?? null
}
