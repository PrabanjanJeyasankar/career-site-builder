'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { Perk } from '@/types/database'
import { SectionHeading } from '../section-heading'
import { ValuePerkPreviewCard } from '../value-perk-preview-card'

type PerksPreviewProps = {
  data: Perk[]
  device: DeviceType
  primaryColor?: string
  secondaryColor?: string
}

export function PerksPreview({
  data,
  device,
  primaryColor,
  secondaryColor,
}: PerksPreviewProps) {
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

  const tileColor = secondaryColor || primaryColor
  const iconColor = primaryColor || secondaryColor

  return (
    <section className={`w-full bg-background ${sizes.section}`}>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Benefits & perks'
            title='What makes working here special'
            description='Highlight the advantages of working with your team.'
          />
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {data.map((perk) => (
            <ValuePerkPreviewCard
              key={perk.id}
              icon={perk.icon}
              title={perk.label}
              description={perk.description}
              variant='perk'
              titleClassName={sizes.label}
              descriptionClassName={sizes.description}
              className='pt-4'
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
