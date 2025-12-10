// preview/page.tsx
import { PreviewPageClient } from '@/app/(editor)/editor/_components/preview-page-client'

import { getCurrentCompanyName } from '@/lib/db/company'
import {
  getCompanyProfileForCurrentCompany,
  getLifeSectionForCurrentCompany,
} from '@/lib/db/fetchSectionData'
import type { LifeSection } from '@/types/database'

export default async function PreviewPage() {
  const [companyResult, profileResult, lifeResult] = await Promise.allSettled([
    getCurrentCompanyName(),
    getCompanyProfileForCurrentCompany(),
    getLifeSectionForCurrentCompany(),
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
  }

  return <PreviewPageClient heroData={heroData} lifeData={life} />
}
