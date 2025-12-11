import { AlertTriangle, Palette } from 'lucide-react'

import { BrandAssetsForm } from './_components/BrandAssetsForm'

import { getCurrentCompanyName } from '@/lib/db/company'
import { getCompanyProfileForCurrentCompany } from '@/lib/db/fetchSectionData'
import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

export default async function BrandAssetsPage() {
  const [companyResult, profileResult] = await Promise.allSettled([
    getCurrentCompanyName(),
    getCompanyProfileForCurrentCompany(),
  ])

  const companyName =
    companyResult.status === 'fulfilled' ? companyResult.value : 'Your company'
  const profile =
    profileResult.status === 'fulfilled' ? profileResult.value : null
  const authErrored =
    companyResult.status === 'rejected' || profileResult.status === 'rejected'

  const defaultValues: CompanyProfileFormValues = {
    company_name: profile?.company_name ?? companyName ?? '',
    tagline: profile?.tagline ?? '',
    description: profile?.description ?? '',
    logo_url: profile?.logo_url ?? '',
    favicon_url: profile?.favicon_url ?? '',
    primary_color: profile?.primary_color ?? '',
    secondary_color: profile?.secondary_color ?? '',
    hero_title: profile?.hero_title ?? '',
    hero_subtitle: profile?.hero_subtitle ?? '',
    hero_description: profile?.hero_description ?? '',
    hero_cta_label: profile?.hero_cta_label ?? '',
    hero_background_url: profile?.hero_background_url ?? '',
    social_preview_url: profile?.social_preview_url ?? '',
  }

  const lastUpdatedLabel = profile?.updated_at
    ? new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(profile.updated_at))
    : undefined

  return (
    <div className='mx-auto w-full max-w-5xl space-y-8 p-6'>
      <div className='space-y-2'>
        <p className='text-sm font-medium text-primary/80'>Brand</p>
        <h1 className='flex items-center gap-2 text-3xl font-semibold tracking-tight'>
          <Palette className='size-7 text-primary' />
          <span>Brand assets</span>
        </h1>
        <p className='text-muted-foreground max-w-2xl text-sm'>
          Keep your company profile, hero, and social preview in sync. These
          inputs write directly to the <code>company_profile</code> table in
          Supabase.
        </p>
      </div>

      <BrandAssetsForm
        defaultValues={defaultValues}
        lastUpdatedLabel={lastUpdatedLabel}
      />

      {authErrored && (
        <div className='rounded-lg border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='size-4' />
            <span>
              We could not load live data from Supabase. Double-check your
              `.env` keys and sign in to preview real company content—editing
              still works with the placeholder values above.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
