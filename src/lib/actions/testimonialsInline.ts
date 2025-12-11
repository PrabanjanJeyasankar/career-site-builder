'use server'

import { getCurrentUserCompanyId } from '@/lib/db/company'
import { createSupabaseServerClientForActions } from '@/lib/supabase/server'

export async function saveTestimonialInline(input: {
  id?: string
  employeeName?: string
  role?: string
  quote?: string
  avatarUrl?: string
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
      employee_name?: string
      role?: string
      quote?: string
      avatar_url?: string
      order_index?: number
    } = { company_id: companyId }

    if (input.id !== undefined) payload.id = input.id
    if (input.employeeName !== undefined)
      payload.employee_name = input.employeeName.trim() || 'New Employee'
    if (input.role !== undefined) payload.role = input.role.trim() || 'Position'
    if (input.quote !== undefined)
      payload.quote = input.quote.trim() || 'Add your testimonial here...'
    if (input.avatarUrl !== undefined) payload.avatar_url = input.avatarUrl
    if (input.orderIndex !== undefined) payload.order_index = input.orderIndex

    const result = await supabase
      .from('testimonials')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('saveTestimonialInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function deleteTestimonialInline(id: string) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const result = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('deleteTestimonialInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function createTestimonialInline() {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const { count } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    const result = await supabase
      .from('testimonials')
      .insert({
        company_id: companyId,
        employee_name: 'New Employee',
        role: 'Position',
        quote: 'Add your testimonial here...',
        avatar_url: null,
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
    console.error('createTestimonialInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
