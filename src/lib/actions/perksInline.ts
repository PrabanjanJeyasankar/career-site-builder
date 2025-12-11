'use server'

import { getCurrentUserCompanyId } from '@/lib/db/company'
import { createSupabaseServerClientForActions } from '@/lib/supabase/server'

export async function savePerkInline(input: {
  id?: string
  label?: string
  description?: string
  icon?: string
}) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const payload: {
      id?: string
      company_id: string
      label?: string
      description?: string
      icon?: string
    } = { company_id: companyId }

    if (input.id !== undefined) payload.id = input.id
    if (input.label !== undefined) payload.label = input.label.trim() || 'New Perk'
    if (input.description !== undefined) payload.description = input.description
    if (input.icon !== undefined) payload.icon = input.icon

    const result = await supabase
      .from('perks')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('savePerkInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function deletePerkInline(id: string) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const result = await supabase
      .from('perks')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('deletePerkInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function createPerkInline() {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const result = await supabase
      .from('perks')
      .insert({
        company_id: companyId,
        label: 'New Perk',
        description: 'Describe this benefit...',
        icon: null,
      })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('createPerkInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
