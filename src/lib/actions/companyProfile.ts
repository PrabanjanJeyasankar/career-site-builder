'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { getCurrentUserCompanyId } from '@/lib/db/company'
import { createSupabaseServerClientForActions } from '@/lib/supabase/server'
import {
  companyProfileFormSchema,
  normalizeCompanyProfilePayload,
  type CompanyProfileFormValues,
} from '@/lib/validation/companyProfileSchema'

export async function saveCompanyProfile(
  values: CompanyProfileFormValues
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createSupabaseServerClientForActions()
  const companyId = await getCurrentUserCompanyId()

  const parsed = companyProfileFormSchema.parse(values)
  const payload = normalizeCompanyProfilePayload(parsed)

  const { error } = await supabase
    .from('company_profile')
    .upsert(
      {
        company_id: companyId,
        ...payload,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'company_id',
      }
    )

  if (error) {
    console.error('Failed to save company profile', error)
    return { error: 'Unable to save brand assets. Please try again.' }
  }

  revalidatePath('/brand-assets')
  return { success: true }
}

const heroInlineUpdateSchema = z.object({
  heroTitle: z
    .string()
    .trim()
    .max(140, 'Hero title must be under 140 characters')
    .optional(),
  heroSubtitle: z
    .string()
    .trim()
    .max(180, 'Hero subtitle must be under 180 characters')
    .optional(),
  heroDescription: z
    .string()
    .trim()
    .max(500, 'Hero description must be under 500 characters')
    .optional(),
  heroCtaLabel: z
    .string()
    .trim()
    .max(40, 'CTA label must be under 40 characters')
    .optional(),
  heroBackgroundUrl: z
    .string()
    .trim()
    .optional(),
  logoUrl: z
    .string()
    .trim()
    .optional(),
})

export type HeroInlineUpdateInput = z.infer<typeof heroInlineUpdateSchema>

type HeroInlineUpdatePayload = {
  hero_title?: string | null
  hero_subtitle?: string | null
  hero_description?: string | null
  hero_cta_label?: string | null
  hero_background_url?: string | null
  logo_url?: string | null
}

export async function saveHeroSectionInline(
  input: HeroInlineUpdateInput
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createSupabaseServerClientForActions()
  const companyId = await getCurrentUserCompanyId()

  const payload = heroInlineUpdateSchema.parse(input)

  const update: HeroInlineUpdatePayload = {}

  if (payload.heroTitle !== undefined) {
    update.hero_title =
      payload.heroTitle.length > 0 ? payload.heroTitle : null
  }

  if (payload.heroSubtitle !== undefined) {
    update.hero_subtitle =
      payload.heroSubtitle.length > 0 ? payload.heroSubtitle : null
  }

  if (payload.heroDescription !== undefined) {
    update.hero_description =
      payload.heroDescription.length > 0 ? payload.heroDescription : null
  }

  if (payload.heroCtaLabel !== undefined) {
    update.hero_cta_label =
      payload.heroCtaLabel.length > 0 ? payload.heroCtaLabel : null
  }

  if (payload.heroBackgroundUrl !== undefined) {
    update.hero_background_url =
      payload.heroBackgroundUrl.length > 0 ? payload.heroBackgroundUrl : null
  }

  if (payload.logoUrl !== undefined) {
    update.logo_url = payload.logoUrl.length > 0 ? payload.logoUrl : null
  }

  const { error } = await supabase
    .from('company_profile')
    .upsert(
      {
        company_id: companyId,
        ...update,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'company_id',
      }
    )

  if (error) {
    console.error('Failed to save hero section inline', error)
    return { error: 'Unable to save hero section. Please try again.' }
  }

  revalidatePath('/editor')
  return { success: true }
}
