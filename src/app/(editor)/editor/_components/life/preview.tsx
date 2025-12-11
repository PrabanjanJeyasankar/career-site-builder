'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { LifeSection } from '@/types/database'
import Image from 'next/image'

type LifeSectionPreviewProps = {
  data: LifeSection
  device: DeviceType
}

export function LifeSectionPreview({ data, device }: LifeSectionPreviewProps) {
  const sizes = {
    mobile: {
      heading: 'text-xl',
      primary: 'text-xs',
      secondary: 'text-xs',
      image: 'max-h-[140px]',
      section: 'py-4',
      grid: 'flex flex-col gap-4',
    },
    tablet: {
      heading: 'text-2xl',
      primary: 'text-sm',
      secondary: 'text-sm',
      image: 'max-h-[200px]',
      section: 'py-6',
      grid: 'flex flex-col gap-8',
    },
    desktop: {
      heading: 'text-4xl',
      primary: 'text-base',
      secondary: 'text-base',
      image: 'md:max-h-[400px] sm:max-h-80 max-h-[180px]',
      section: 'py-20',
      grid: 'md:grid md:grid-cols-2 gap-16 flex flex-col',
    },
  }[device]

  return (
    <section className={`w-full bg-background ${sizes.section}`}>
      <div className='mx-auto max-w-6xl px-4 mb-12'>
        <div className='space-y-3'>
          <span className='text-[0.7rem] font-medium uppercase tracking-[0.2em] text-primary'>
            Culture
          </span>
          <h2
            className={`${sizes.heading} font-semibold tracking-tight text-foreground`}>
            {data.heading || 'Life at your company'}
          </h2>
        </div>
      </div>

      <div className={`mx-auto max-w-6xl px-4 items-center ${sizes.grid}`}>
        <div className='space-y-6 leading-relaxed'>
          <p className={`${sizes.primary} text-muted-foreground`}>
            {data.description_primary ||
              'Describe your workplace culture and environment.'}
          </p>

          <p className={`${sizes.secondary} text-muted-foreground`}>
            {data.description_secondary ||
              'Describe mission, values, growth and opportunities.'}
          </p>
        </div>

        <div className='relative w-full rounded-2xl overflow-hidden flex items-center justify-center'>
          {data.image_url ? (
            <Image
              src={data.image_url}
              alt='Life section image'
              width={600}
              height={400}
              className={`object-contain w-full h-auto ${sizes.image}`}
              priority
            />
          ) : (
            <div className='w-full bg-gray-200 rounded-2xl min-h-[120px]' />
          )}
        </div>
      </div>
    </section>
  )
}
