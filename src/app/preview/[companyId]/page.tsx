// preview/[companyId]/page.tsx

import { PreviewPageClient } from '@/app/(editor)/editor/_components/preview-page-client'
import { getCompanyNameById } from '@/lib/db/company'
import {
  getCompanyProfileByCompanyId,
  getJobsByCompanyId,
  getLifeSectionByCompanyId,
  getLocationsByCompanyId,
  getPerksByCompanyId,
  getTestimonialsByCompanyId,
  getValueItemsByCompanyId,
} from '@/lib/db/fetchSectionData'
import type { LifeSection } from '@/types/database'
import { notFound } from 'next/navigation'

type PreviewPageProps = {
  params: Promise<{
    companyId: string
  }>
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { companyId } = await params

  if (!companyId) {
    notFound()
  }

  const [
    companyNameResult,
    profileResult,
    lifeResult,
    testimonialsResult,
    valueItemsResult,
    locationsResult,
    perksResult,
    jobsResult,
  ] = await Promise.allSettled([
    getCompanyNameById(companyId),
    getCompanyProfileByCompanyId(companyId),
    getLifeSectionByCompanyId(companyId),
    getTestimonialsByCompanyId(companyId),
    getValueItemsByCompanyId(companyId),
    getLocationsByCompanyId(companyId),
    getPerksByCompanyId(companyId),
    getJobsByCompanyId(companyId),
  ])

  const companyName =
    companyNameResult.status === 'fulfilled' && companyNameResult.value
      ? companyNameResult.value
      : null

  if (!companyName) {
    // If the company itself is missing, avoid leaking information and 404.
    notFound()
  }

  const profile =
    profileResult.status === 'fulfilled' ? profileResult.value : null

  const life: LifeSection =
    lifeResult.status === 'fulfilled' && lifeResult.value
      ? lifeResult.value
      : {
          company_id: companyId,
          heading: '',
          description_primary: '',
          description_secondary: '',
          image_url: '',
          updated_at: '',
        }

  const testimonials =
    testimonialsResult.status === 'fulfilled' ? testimonialsResult.value : []
  const valueItems =
    valueItemsResult.status === 'fulfilled' ? valueItemsResult.value : []
  const locations =
    locationsResult.status === 'fulfilled' ? locationsResult.value : []
  const perks = perksResult.status === 'fulfilled' ? perksResult.value : []
  const jobs = jobsResult.status === 'fulfilled' ? jobsResult.value : []

  const heroData = {
    companyName,
    logoUrl: profile?.logo_url ?? '',
    heroTitle:
      profile?.hero_title ??
      (companyName ? `Careers at ${companyName}` : 'Careers'),
    heroSubtitle:
      profile?.hero_subtitle ??
      `At ${companyName}, we are building the future of work.`,
    heroDescription:
      profile?.hero_description ??
      `${companyName} is looking for people who care deeply about craft, collaboration, and impact.`,
    heroCtaLabel: profile?.hero_cta_label ?? 'View jobs',
    heroBackgroundUrl: profile?.hero_background_url ?? '',
    primaryColor: profile?.primary_color ?? '#059669',
    secondaryColor: profile?.secondary_color ?? '#f5f5f5',
  }

  return (
    <PreviewPageClient
      heroData={heroData}
      lifeData={life}
      testimonialsData={testimonials}
      valueItemsData={valueItems}
      locationsData={locations}
      perksData={perks}
      jobsData={jobs}
    />
  )
}
