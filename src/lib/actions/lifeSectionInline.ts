'use server'

import { getCurrentUserCompanyId } from '@/lib/db/company'
import { createSupabaseServerClientForActions } from '@/lib/supabase/server'

export async function saveLifeSectionInline(input: {
  heading?: string
  descriptionPrimary?: string
  descriptionSecondary?: string
  image?: string
}) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    // Build payload so that only provided fields are updated
    const payload: {
      company_id: string
      heading?: string
      description_primary?: string
      description_secondary?: string
      image_url?: string
    } = { company_id: companyId }

    if (input.heading !== undefined) payload.heading = input.heading
    if (input.descriptionPrimary !== undefined)
      payload.description_primary = input.descriptionPrimary
    if (input.descriptionSecondary !== undefined)
      payload.description_secondary = input.descriptionSecondary
    if (input.image !== undefined) payload.image_url = input.image

    // Upsert so a row is created if it doesn't exist yet
    const result = await supabase
      .from('life_section')
      .upsert(payload, { onConflict: 'company_id' })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('saveLifeSectionInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
