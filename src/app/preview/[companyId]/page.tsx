// preview/[companyId]/page.tsx

import { PreviewPageClient } from '@/app/(editor)/editor/_components/preview-page-client'
import { getCompanyNameById } from '@/lib/db/company'
import {
  getCompanyProfileByCompanyId,
  getJobsByCompanyId,
  getLifeSectionByCompanyId,
  getLocationsByCompanyId,
  getPerksByCompanyId,
  getSectionOrderByCompanyId,
  getTestimonialsByCompanyId,
  getValueItemsByCompanyId,
} from '@/lib/db/fetchSectionData'
import type { LifeSection } from '@/types/database'
import type { Metadata, Viewport } from 'next'
import { redirect } from 'next/navigation'

type PreviewPageProps = {
  params: Promise<{
    companyId: string
  }>
}

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<Metadata> {
  const { companyId } = await params

  const [companyNameResult, profileResult] = await Promise.allSettled([
    getCompanyNameById(companyId),
    getCompanyProfileByCompanyId(companyId),
  ])

  const companyName =
    companyNameResult.status === 'fulfilled' && companyNameResult.value
      ? companyNameResult.value
      : null

  const rawFavicon =
    profileResult.status === 'fulfilled'
      ? profileResult.value?.favicon_url
      : undefined
  const faviconUrl = rawFavicon?.trim() || undefined

  const title = companyName ? `Careers at ${companyName}` : 'Careers'
  const description =
    profileResult.status === 'fulfilled' && profileResult.value?.description
      ? profileResult.value.description
      : companyName
      ? `Explore open roles and life at ${companyName}.`
      : 'Explore open roles and company culture.'
  const socialImage =
    profileResult.status === 'fulfilled'
      ? profileResult.value?.social_preview_url ?? undefined
      : undefined

  return {
    title,
    description,
    icons: faviconUrl
      ? {
          icon: faviconUrl,
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    twitter: {
      card: socialImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { companyId } = await params

  if (!companyId) {
    redirect('/preview')
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
    sectionOrderResult,
  ] = await Promise.allSettled([
    getCompanyNameById(companyId),
    getCompanyProfileByCompanyId(companyId),
    getLifeSectionByCompanyId(companyId),
    getTestimonialsByCompanyId(companyId),
    getValueItemsByCompanyId(companyId),
    getLocationsByCompanyId(companyId),
    getPerksByCompanyId(companyId),
    getJobsByCompanyId(companyId),
    getSectionOrderByCompanyId(companyId),
  ])

  const companyName =
    companyNameResult.status === 'fulfilled' && companyNameResult.value
      ? companyNameResult.value
      : null

  if (!companyName) {
    redirect('/preview')
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
  const sectionOrder =
    sectionOrderResult.status === 'fulfilled'
      ? sectionOrderResult.value?.section_order ?? null
      : null

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
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: companyName,
            url: typeof window === 'undefined' ? undefined : undefined,
            logo: profile?.logo_url ?? undefined,
          }),
        }}
      />
      {jobs.length > 0 && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              jobs.map((job) => ({
                '@context': 'https://schema.org',
                '@type': 'JobPosting',
                title: job.title,
                description: job.description,
                datePosted: job.posted_at,
                employmentType: job.employment_type,
                hiringOrganization: {
                  '@type': 'Organization',
                  name: companyName,
                  logo: profile?.logo_url ?? undefined,
                },
                jobLocationType:
                  job.work_type === 'remote' ? 'TELECOMMUTE' : undefined,
                applicantLocationRequirements:
                  job.work_type === 'remote'
                    ? [
                        {
                          '@type': 'Country',
                          name: 'Worldwide',
                        },
                      ]
                    : undefined,
              }))
            ),
          }}
        />
      )}
      <PreviewPageClient
        heroData={heroData}
        lifeData={life}
        testimonialsData={testimonials}
        valueItemsData={valueItems}
        locationsData={locations}
        perksData={perks}
        jobsData={jobs}
        sectionOrder={sectionOrder}
      />
    </>
  )
}
