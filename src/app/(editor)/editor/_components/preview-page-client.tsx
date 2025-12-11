'use client'

import { DeviceSwitcher } from '@/components/ui/device-switcher'
import type {
  Job,
  LifeSection,
  Location,
  Perk,
  Testimonial,
  ValueItem,
} from '@/types/database'
import { useState } from 'react'
import type { HeroEditorInitialData } from './editor-page-client'
import { HeroSectionPreview } from './hero-section-preview'
import { JobsPreview } from './jobs-preview'
import { LifeSectionPreview } from './life-section-preview'
import { LocationsPreview } from './locations-preview'
import { PerksPreview } from './perks-preview'
import { TestimonialsPreview } from './testimonials-preview'
import { ValueItemsPreview } from './value-items-preview'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export function PreviewPageClient({
  heroData,
  lifeData,
  testimonialsData,
  valueItemsData,
  locationsData,
  perksData,
  jobsData,
}: {
  heroData: HeroEditorInitialData
  lifeData: LifeSection
  testimonialsData: Testimonial[]
  valueItemsData: ValueItem[]
  locationsData: Location[]
  perksData: Perk[]
  jobsData: Job[]
}) {
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const frame =
    device === 'desktop'
      ? 'w-full'
      : device === 'tablet'
      ? 'w-[768px]'
      : 'w-[390px]'

  return (
    <div className='relative h-full min-h-screen bg-slate-950 flex flex-col'>
      <div className='absolute right-6 top-6 z-20'>
        <DeviceSwitcher value={device} onChange={setDevice} />
      </div>

      <div className='flex-1 flex items-center justify-center '>
        <div
          className={`${frame} rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900`}>
          <HeroSectionPreview data={heroData} device={device} />
          <LifeSectionPreview data={lifeData} device={device} />
          <ValueItemsPreview data={valueItemsData} device={device} />
          <TestimonialsPreview data={testimonialsData} device={device} />
          <LocationsPreview data={locationsData} device={device} />
          <PerksPreview data={perksData} device={device} />
          <JobsPreview data={jobsData} device={device} />
        </div>
      </div>
    </div>
  )
}
