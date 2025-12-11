'use server'

import { getCurrentUserCompanyId } from '@/lib/db/company'
import { createSupabaseServerClientForActions } from '@/lib/supabase/server'

export async function saveValueItemInline(input: {
  id?: string
  title?: string
  description?: string
  icon?: string
  orderIndex?: number
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
      title?: string
      description?: string
      icon?: string
      order_index?: number
    } = { company_id: companyId }

    if (input.id !== undefined) payload.id = input.id
    if (input.title !== undefined)
      payload.title = input.title.trim() || 'New Value'
    if (input.description !== undefined) payload.description = input.description
    if (input.icon !== undefined) payload.icon = input.icon
    if (input.orderIndex !== undefined) payload.order_index = input.orderIndex

    const result = await supabase
      .from('value_items')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('saveValueItemInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function deleteValueItemInline(id: string) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const result = await supabase
      .from('value_items')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('deleteValueItemInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function createValueItemInline() {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const { count } = await supabase
      .from('value_items')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    const result = await supabase
      .from('value_items')
      .insert({
        company_id: companyId,
        title: 'New Value',
        description: 'Describe this company value...',
        icon: null,
        order_index: count || 0,
      })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('createValueItemInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
