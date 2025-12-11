'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { ValueItem } from '@/types/database'
import { SectionHeading } from '../section-heading'
import { ValuePerkPreviewCard } from '../value-perk-preview-card'

type ValueItemsPreviewProps = {
  data: ValueItem[]
  device: DeviceType
  primaryColor?: string
  secondaryColor?: string
}

export function ValueItemsPreview({
  data,
  device,
  primaryColor,
  secondaryColor,
}: ValueItemsPreviewProps) {
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

  const tileColor = secondaryColor || primaryColor
  const iconColor = primaryColor || secondaryColor

  return (
    <section className={`w-full bg-background ${sizes.section}`}>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Values'
            title='Our Values'
            description='The principles that guide everything we do.'
          />
        </div>

        <div className='grid grid-cols-1 gap-y-12 gap-x-16 md:grid-cols-2'>
          {data.map((valueItem) => (
            <ValuePerkPreviewCard
              key={valueItem.id}
              icon={valueItem.icon}
              title={valueItem.title}
              description={valueItem.description}
              variant='value'
              titleClassName={sizes.title}
              descriptionClassName={sizes.description}
              className='pt-8'
              tileBgColor={tileColor}
              tileBgOpacity={0.1}
              iconBgColor={iconColor}
              iconBgOpacity={0.2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
