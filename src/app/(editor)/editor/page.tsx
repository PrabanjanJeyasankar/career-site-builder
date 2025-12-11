// editor/page.tsx
import {
  EditorPageClient,
  type HeroEditorInitialData,
} from './_components/editor-page-client'

import { getCurrentCompanyName } from '@/lib/db/company'
import {
  getCompanyProfileForCurrentCompany,
  getJobsForCurrentCompany,
  getLifeSectionForCurrentCompany,
  getLocationsForCurrentCompany,
  getPerksForCurrentCompany,
  getTestimonialsForCurrentCompany,
  getValueItemsForCurrentCompany,
} from '@/lib/db/fetchSectionData'
import { LifeSection } from '@/types/database'

export default async function EditorPage() {
  const [
    companyResult,
    profileResult,
    lifeResult,
    testimonialsResult,
    valueItemsResult,
    locationsResult,
    perksResult,
    jobsResult,
  ] = await Promise.allSettled([
    getCurrentCompanyName(),
    getCompanyProfileForCurrentCompany(),
    getLifeSectionForCurrentCompany(),
    getTestimonialsForCurrentCompany(),
    getValueItemsForCurrentCompany(),
    getLocationsForCurrentCompany(),
    getPerksForCurrentCompany(),
    getJobsForCurrentCompany(),
  ])

  const companyName =
    companyResult.status === 'fulfilled' ? companyResult.value : 'Your company'

  const profile =
    profileResult.status === 'fulfilled' ? profileResult.value : null

  const life: LifeSection =
    lifeResult.status === 'fulfilled' && lifeResult.value
      ? lifeResult.value
      : {
          company_id: '',
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

  const heroData: HeroEditorInitialData = {
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
  }

  return (
    <EditorPageClient
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
