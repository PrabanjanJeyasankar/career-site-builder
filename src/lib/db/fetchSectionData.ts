'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type {
  CompanyProfile,
  Job,
  LifeSection,
  Location,
  Perk,
  Testimonial,
  ValueItem,
} from '@/types/database'
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

export async function getTestimonialsForCurrentCompany(): Promise<
  Testimonial[]
> {
  const supabase = await createSupabaseServerClient()
  const companyId = await getCurrentUserCompanyId()

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('company_id', companyId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Failed to fetch testimonials', error)
    return []
  }

  return data as Testimonial[]
}

export async function getValueItemsForCurrentCompany(): Promise<ValueItem[]> {
  const supabase = await createSupabaseServerClient()
  const companyId = await getCurrentUserCompanyId()

  const { data, error } = await supabase
    .from('value_items')
    .select('*')
    .eq('company_id', companyId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Failed to fetch value items', error)
    return []
  }

  return data as ValueItem[]
}

export async function getLocationsForCurrentCompany(): Promise<Location[]> {
  const supabase = await createSupabaseServerClient()
  const companyId = await getCurrentUserCompanyId()

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('company_id', companyId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Failed to fetch locations', error)
    return []
  }

  return data as Location[]
}

export async function getPerksForCurrentCompany(): Promise<Perk[]> {
  const supabase = await createSupabaseServerClient()
  const companyId = await getCurrentUserCompanyId()

  const { data, error } = await supabase
    .from('perks')
    .select('*')
    .eq('company_id', companyId)

  if (error) {
    console.error('Failed to fetch perks', error)
    return []
  }

  return data as Perk[]
}

export async function getJobsForCurrentCompany(): Promise<Job[]> {
  const supabase = await createSupabaseServerClient()
  const companyId = await getCurrentUserCompanyId()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId)
    .order('posted_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch jobs', error)
    return []
  }

  return data as Job[]
}
