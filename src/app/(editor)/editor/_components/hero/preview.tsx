'use client'

import { Button } from '@/components/ui/button'
import type { DeviceType } from '@/components/ui/device-switcher'
import Image from 'next/image'
import type { HeroEditorInitialData } from '../editor-page-client'

type HeroSectionPreviewProps = {
  data: HeroEditorInitialData
  device: DeviceType
}

export function HeroSectionPreview({ data, device }: HeroSectionPreviewProps) {
  const sizes = {
    mobile: {
      title: 'text-2xl',
      subtitle: 'text-base',
      description: 'text-sm',
      logo: 'h-16 w-16',
      height: 'min-h-[300px]',
      gap: 'gap-6',
    },
    tablet: {
      title: 'text-3xl',
      subtitle: 'text-lg',
      description: 'text-base',
      logo: 'h-20 w-20',
      height: 'min-h-[360px]',
      gap: 'gap-7',
    },
    desktop: {
      title: 'text-4xl',
      subtitle: 'text-lg',
      description: 'text-base',
      logo: 'h-20 w-20',
      height: 'min-h-[420px]',
      gap: 'gap-8',
    },
  }[device]

  return (
    <section className='relative overflow-hidden bg-gray-900 text-white'>
      <div className='absolute inset-0 pointer-events-none'>
        {data.heroBackgroundUrl && (
          <Image
            src={data.heroBackgroundUrl}
            alt=''
            fill
            unoptimized
            priority
            sizes='(min-width: 1024px) 1200px, 100vw'
            className='object-cover'
          />
        )}
      </div>
      <div className='absolute inset-0 pointer-events-none backdrop-blur-2xl bg-black/30' />

      <div
        className={`relative flex flex-col items-center justify-center px-4 py-10 ${sizes.height}`}>
        <div className='mb-4'>
          {data.logoUrl ? (
            <Image
              src={data.logoUrl}
              alt={`${data.companyName} logo`}
              width={96}
              height={96}
              className={`${sizes.logo} rounded-full object-contain`}
            />
          ) : (
            <div
              className={`${sizes.logo} flex items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs`}>
              Logo
            </div>
          )}
        </div>

        <div className={`flex flex-col items-center text-center ${sizes.gap}`}>
          <h1 className={`${sizes.title} font-semibold`}>{data.heroTitle}</h1>
          <p className={`${sizes.subtitle} text-white/80`}>
            {data.heroSubtitle}
          </p>
          <p className={`${sizes.description} max-w-xl text-white/80`}>
            {data.heroDescription}
          </p>

          <Button
            onClick={() => {
              document.getElementById('jobs')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }}
            style={{ backgroundColor: data.primaryColor }}
            className='mt-2 rounded-md px-6 text-sm font-semibold text-white shadow-md'>
            {data.heroCtaLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
