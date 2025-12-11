'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { ValueItem } from '@/types/database'
import { SectionHeading } from './section-heading'

type ValueItemsPreviewProps = {
  data: ValueItem[]
  device: DeviceType
}

export function ValueItemsPreview({ data, device }: ValueItemsPreviewProps) {
  const sizes = {
    mobile: {
      section: 'py-16',
      heading: 'text-2xl',
      subheading: 'text-xs',
      title: 'text-sm',
      description: 'text-sm',
    },
    tablet: {
      section: 'py-16',
      heading: 'text-2xl',
      subheading: 'text-xs',
      title: 'text-sm',
      description: 'text-sm',
    },
    desktop: {
      section: 'py-16',
      heading: 'text-2xl',
      subheading: 'text-xs',
      title: 'text-sm',
      description: 'text-base',
    },
  }[device]

  return (
    <section className={`w-full bg-background ${sizes.section}`}>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Values'
            title='Our Values'
            description='The principles that guide everything we do.'
          />
        </div>

        <div className='grid grid-cols-1 gap-y-12 gap-x-16 md:grid-cols-2'>
          {data.map((valueItem) => (
            <article
              key={valueItem.id}
              className='flex h-full flex-col items-center pt-8 text-center'>
              <div className='relative inline-flex min-w-[9rem] items-center justify-center rounded-[1.75rem] bg-chart-1/10 px-6 pb-6 pt-7'>
                <div className='flex w-full flex-col items-center gap-3'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-1/15 text-xl text-chart-1'>
                    {valueItem.icon || '✨'}
                  </div>
                  <div className='w-full text-center'>
                    <h3
                      className={`${sizes.title} w-full font-semibold text-foreground`}>
                      {valueItem.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className='mt-5 flex w-full flex-1 items-center wrap-break-word justify-center'>
                <p
                  className={`${sizes.description} w-full max-w-md text-balance leading-relaxed text-muted-foreground`}>
                  {valueItem.description || 'Describe this value...'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
