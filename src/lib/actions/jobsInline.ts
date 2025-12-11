'use server'

import { getCurrentUserCompanyId } from '@/lib/db/company'
import { createSupabaseServerClientForActions } from '@/lib/supabase/server'

export async function saveJobInline(input: {
  id?: string
  title?: string
  department?: string
  location?: string
  workType?: 'remote' | 'hybrid' | 'onsite'
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship'
  description?: string
  applyUrl?: string
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
      department?: string
      location?: string
      work_type?: 'remote' | 'hybrid' | 'onsite'
      employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
      description?: string
      apply_url?: string
    } = { company_id: companyId }

    if (input.id !== undefined) payload.id = input.id
    if (input.title !== undefined)
      payload.title = input.title.trim() || 'New Position'
    if (input.department !== undefined)
      payload.department = input.department.trim() || 'Department'
    if (input.location !== undefined)
      payload.location = input.location.trim() || 'Location'
    if (input.workType !== undefined) payload.work_type = input.workType
    if (input.employmentType !== undefined)
      payload.employment_type = input.employmentType
    if (input.description !== undefined)
      payload.description = input.description.trim() || 'Add job description...'
    if (input.applyUrl !== undefined) {
      const trimmed = input.applyUrl.trim()
      if (!trimmed) {
        throw new Error('Apply URL is required')
      }
      payload.apply_url = trimmed
    }

    const result = await supabase
      .from('jobs')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('saveJobInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function deleteJobInline(id: string) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const result = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('deleteJobInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function createJobInline(input: {
  title: string
  department: string
  location: string
  workType: 'remote' | 'hybrid' | 'onsite'
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship'
  description: string
  applyUrl: string
}) {
  try {
    const supabase = await createSupabaseServerClientForActions()
    const companyId = await getCurrentUserCompanyId()

    if (!companyId) {
      throw new Error('Company ID is required but not found')
    }

    const title = input.title.trim()
    const department = input.department.trim()
    const location = input.location.trim()
    const description = input.description.trim()
    const applyUrl = input.applyUrl.trim()

    if (!title) {
      throw new Error('Title is required')
    }
    if (!department) {
      throw new Error('Department is required')
    }
    if (!location) {
      throw new Error('Location is required')
    }
    if (!description) {
      throw new Error('Description is required')
    }
    if (!applyUrl) {
      throw new Error('Apply URL is required')
    }

    const result = await supabase
      .from('jobs')
      .insert({
        company_id: companyId,
        title,
        department,
        location,
        work_type: input.workType,
        employment_type: input.employmentType,
        description,
        posted_at: new Date().toISOString(),
        apply_url: applyUrl,
      })
      .select()
      .single()

    if (result.error) {
      console.error('Database error:', result.error)
      throw new Error(`Database operation failed: ${result.error.message}`)
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('createJobInline error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
