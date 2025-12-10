'use client'

import { DeviceSwitcher } from '@/components/ui/device-switcher'
import type { LifeSection } from '@/types/database'
import { useState } from 'react'
import type { HeroEditorInitialData } from './editor-page-client'
import { HeroSectionPreview } from './hero-section-preview'
import { LifeSectionPreview } from './life-section-preview'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

type PreviewPageClientProps = {
  heroData: HeroEditorInitialData
  lifeData: LifeSection
}

export function PreviewPageClient({
  heroData,
  lifeData,
}: PreviewPageClientProps) {
  console.warn(lifeData)
  const [device, setDevice] = useState<DeviceMode>('desktop')

  const frameWidth =
    device === 'desktop'
      ? 'w-full'
      : device === 'tablet'
      ? 'w-[768px]'
      : 'w-[390px]'

  return (
    <div className='relative flex min-h-screen flex-col bg-slate-950'>
      <div className='absolute top-6 right-8 z-20'>
        <DeviceSwitcher value={device} onChange={setDevice} />
      </div>
      <div className='flex flex-1 items-center justify-center '>
        <div
          className={`relative ${frameWidth} max-w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl`}>
          <HeroSectionPreview data={heroData} device={device} />
          <LifeSectionPreview data={lifeData} device={device} />
        </div>
      </div>
    </div>
  )
}
