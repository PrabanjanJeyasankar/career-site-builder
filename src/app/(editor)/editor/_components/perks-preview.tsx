'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { Perk } from '@/types/database'
import { SectionHeading } from './section-heading'

type PerksPreviewProps = {
  data: Perk[]
  device: DeviceType
}

export function PerksPreview({ data, device }: PerksPreviewProps) {
  const sizes = {
    mobile: {
      section: 'py-16',
      heading: 'text-2xl',
      subheading: 'text-xs',
      label: 'text-sm',
      description: 'text-sm',
    },
    tablet: {
      section: 'py-16',
      heading: 'text-2xl',
      subheading: 'text-xs',
      label: 'text-sm',
      description: 'text-sm',
    },
    desktop: {
      section: 'py-16',
      heading: 'text-2xl',
      subheading: 'text-xs',
      label: 'text-sm',
      description: 'text-base',
    },
  }[device]

  return (
    <section className={`w-full bg-background ${sizes.section}`}>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Benefits & perks'
            title='What makes working here special'
            description='Highlight the advantages of working with your team.'
          />
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {data.map((perk) => (
            <div
              key={perk.id}
              className='flex h-full flex-col items-center pt-4 text-center'>
              <div className='group/icon relative inline-flex min-w-[9rem] items-center justify-center rounded-[1.75rem] bg-chart-2/10 px-6 pb-6 pt-7'>
                {perk.icon ? (
                  <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-2/15 text-xl text-chart-2'>
                    {perk.icon}
                  </div>
                ) : (
                  <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-2/15 text-xs text-chart-2/80'>
                    Icon
                  </div>
                )}
              </div>

              <div className='mt-4 w-full max-w-xs'>
                <h3
                  className={`${sizes.label} mb-3 font-semibold text-foreground`}>
                  {perk.label}
                </h3>

                <p
                  className={`${sizes.description} w-full max-w-xs break-words text-muted-foreground leading-relaxed`}>
                  {perk.description || 'Describe this benefit...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
