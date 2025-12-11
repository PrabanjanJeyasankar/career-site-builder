'use server'

import { getCurrentUserCompanyId } from '@/lib/db/company'
import { createSupabaseServerClientForActions } from '@/lib/supabase/server'

const ALLOWED_SECTIONS = ['life', 'values', 'testimonials', 'locations', 'perks'] as const
type AllowedSection = (typeof ALLOWED_SECTIONS)[number]

export async function saveSectionOrder(order: AllowedSection[]) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()
    if (!companyId) throw new Error('Company not found')

    const filtered = order.filter((item): item is AllowedSection =>
      ALLOWED_SECTIONS.includes(item as AllowedSection)
    )

    const { error } = await supabase
      .from('company_section_order')
      .upsert({
        company_id: companyId,
        section_order: filtered,
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('saveSectionOrder error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
