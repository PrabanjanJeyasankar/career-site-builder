'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { CompanyProfile, LifeSection } from '@/types/database'
import { getCurrentUserCompanyId } from './company'

export async function getCompanyProfileForCurrentCompany(): Promise<CompanyProfile | null> {
  const supabase = await createSupabaseServerClient()
  const companyId = await getCurrentUserCompanyId()

  const { data, error } = await supabase
    .from('company_profile')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to fetch company profile', error)
    throw new Error('Unable to load company profile')
  }

  return data as CompanyProfile | null
}

export async function getLifeSectionForCurrentCompany(): Promise<LifeSection | null> {
  const supabase = await createSupabaseServerClient()
  const companyId = await getCurrentUserCompanyId()

  const { data, error } = await supabase
    .from('life_section')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch life section', error)
    return null
  }

  if (!data) return null

  return data as LifeSection
}
