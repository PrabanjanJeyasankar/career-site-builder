'use client'

import { DeviceSwitcher } from '@/components/ui/device-switcher'
import {
  normalizeSectionOrder,
  type SectionKey,
} from '@/hooks/use-section-order'
import type {
  Job,
  LifeSection,
  Location,
  Perk,
  Testimonial,
  ValueItem,
} from '@/types/database'
import { CSSProperties, useState } from 'react'
import type { HeroEditorInitialData } from './editor-page-client'
import { HeroSectionPreview } from './hero/preview'
import { JobsPreview } from './jobs/preview'
import { LifeSectionPreview } from './life/preview'
import { LocationsPreview } from './locations/preview'
import { PerksPreview } from './perks/preview'
import { TestimonialsPreview } from './testimonials/preview'
import { ValueItemsPreview } from './values/preview'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export function PreviewPageClient({
  heroData,
  lifeData,
  testimonialsData,
  valueItemsData,
  locationsData,
  perksData,
  jobsData,
  sectionOrder,
}: {
  heroData: HeroEditorInitialData
  lifeData: LifeSection
  testimonialsData: Testimonial[]
  valueItemsData: ValueItem[]
  locationsData: Location[]
  perksData: Perk[]
  jobsData: Job[]
  sectionOrder: string[] | null
}) {
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const frame =
    device === 'desktop'
      ? 'w-full'
      : device === 'tablet'
      ? 'w-[768px]'
      : 'w-[390px]'

  const themeStyle: CSSProperties = {
    ['--primary' as keyof CSSProperties]: heroData.primaryColor,
    ['--secondary' as keyof CSSProperties]: heroData.secondaryColor,
  }

  return (
    <div
      className='relative h-full min-h-screen flex flex-col rounded-none'
      style={themeStyle}>
      <div className='absolute right-6 top-6 z-20'>
        <DeviceSwitcher value={device} onChange={setDevice} />
      </div>

      <div className='flex-1 flex items-center justify-center rounded-none '>
        <div className={`${frame} overflow-hidden shadow-2xl rounded-none `}>
          <HeroSectionPreview data={heroData} device={device} />
          <PreviewSectionOrder
            order={sectionOrder}
            device={device}
            heroData={heroData}
            lifeData={lifeData}
            valueItemsData={valueItemsData}
            testimonialsData={testimonialsData}
            locationsData={locationsData}
            perksData={perksData}
          />
          <div id='jobs'>
            <JobsPreview data={jobsData} device={device} />
          </div>
        </div>
      </div>
    </div>
  )
}

type PreviewSectionOrderProps = {
  order: string[] | null
  device: DeviceMode
  heroData: HeroEditorInitialData
  lifeData: LifeSection
  valueItemsData: ValueItem[]
  testimonialsData: Testimonial[]
  locationsData: Location[]
  perksData: Perk[]
}

function PreviewSectionOrder({
  order,
  device,
  heroData,
  lifeData,
  valueItemsData,
  testimonialsData,
  locationsData,
  perksData,
}: PreviewSectionOrderProps) {
  const normalized = normalizeSectionOrder(order)
  const sections: Record<SectionKey, React.ReactNode> = {
    life: <LifeSectionPreview data={lifeData} device={device} />,
    values: (
      <ValueItemsPreview
        data={valueItemsData}
        device={device}
        primaryColor={heroData.primaryColor}
        secondaryColor={heroData.secondaryColor}
      />
    ),
    testimonials: (
      <TestimonialsPreview data={testimonialsData} device={device} />
    ),
    locations: <LocationsPreview data={locationsData} device={device} />,
    perks: (
      <PerksPreview
        data={perksData}
        device={device}
        primaryColor={heroData.primaryColor}
        secondaryColor={heroData.secondaryColor}
      />
    ),
  }

  return (
    <>
      {normalized.map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
    </>
  )
}
