/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'

import type { CompanyProfile } from '@/types/database'

const urlField = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || value.length === 0 || /^https?:\/\//i.test(value),
    'Enter a valid URL'
  )

const hexColor = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) =>
      !value ||
      value.length === 0 ||
      /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value),
    'Enter a valid hex color (e.g. #5038ee)'
  )

export const companyProfileFormSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .max(80, 'Company name must be under 80 characters'),
  tagline: z
    .string()
    .trim()
    .max(160, 'Tagline must be under 160 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be under 1000 characters')
    .optional(),
  logo_url: urlField,
  favicon_url: urlField,
  primary_color: hexColor,
  secondary_color: hexColor,
  hero_title: z
    .string()
    .trim()
    .min(4, 'Hero title is required')
    .max(140, 'Hero title must be under 140 characters'),
  hero_subtitle: z
    .string()
    .trim()
    .min(4, 'Hero subtitle is required')
    .max(180, 'Hero subtitle must be under 180 characters'),
  hero_description: z
    .string()
    .trim()
    .min(20, 'Hero description is required')
    .max(500, 'Hero description must be under 500 characters'),
  hero_cta_label: z
    .string()
    .trim()
    .min(2, 'CTA label is required')
    .max(40, 'CTA label must be under 40 characters'),
  hero_background_url: urlField,
  social_preview_url: urlField,
})

export type CompanyProfileFormValues = z.infer<typeof companyProfileFormSchema>

export type CompanyProfileUpsertPayload = Omit<
  CompanyProfile,
  'company_id' | 'updated_at'
>

type OptionalField =
  | 'tagline'
  | 'description'
  | 'logo_url'
  | 'favicon_url'
  | 'primary_color'
  | 'secondary_color'
  | 'hero_background_url'
  | 'social_preview_url'

export function normalizeCompanyProfilePayload(
  values: CompanyProfileFormValues
): CompanyProfileUpsertPayload {
  const optionalFields = new Set<OptionalField>([
    'tagline',
    'description',
    'logo_url',
    'favicon_url',
    'primary_color',
    'secondary_color',
    'hero_background_url',
    'social_preview_url',
  ])

  return Object.entries(values).reduce((acc, [key, value]) => {
    const trimmed = typeof value === 'string' ? value.trim() : value ?? ''
    const field = key as keyof CompanyProfileUpsertPayload

    if (
      optionalFields.has(field as OptionalField) &&
      (!trimmed || trimmed.length === 0)
    ) {
      ;(acc as any)[field] = null
    } else {
      ;(acc as any)[field] = trimmed
    }

    return acc
  }, {} as CompanyProfileUpsertPayload)
}
