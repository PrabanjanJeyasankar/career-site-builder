'use server'

import { getCurrentUserCompanyId } from '@/lib/db/company'
import { createSupabaseServerClientForActions } from '@/lib/supabase/server'

export async function saveLocationInline(input: {
  id?: string
  city?: string
  country?: string
  address?: string
  mapUrl?: string
  imageUrl?: string
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
      city?: string
      country?: string
      address?: string
      map_url?: string
      image_url?: string
      order_index?: number
    } = { company_id: companyId }

    if (input.id !== undefined) payload.id = input.id
    if (input.city !== undefined) payload.city = input.city.trim() || 'New City'
    if (input.country !== undefined) payload.country = input.country.trim() || 'Country'
    if (input.address !== undefined) payload.address = input.address
    if (input.mapUrl !== undefined) payload.map_url = input.mapUrl
    if (input.imageUrl !== undefined) payload.image_url = input.imageUrl
    if (input.orderIndex !== undefined) payload.order_index = input.orderIndex

    const result = await supabase
      .from('locations')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('saveLocationInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function deleteLocationInline(id: string) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const result = await supabase
      .from('locations')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('deleteLocationInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function createLocationInline() {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const { count } = await supabase
      .from('locations')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    const result = await supabase
      .from('locations')
      .insert({
        company_id: companyId,
        city: 'New City',
        country: 'Country',
        address: null,
        map_url: null,
        image_url: null,
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
    console.error('createLocationInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
