'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { Testimonial } from '@/types/database'
import Image from 'next/image'
import { SectionHeading } from './section-heading'
import { TestimonialLayout } from './testimonial-layout'

type TestimonialsPreviewProps = {
  data: Testimonial[]
  device: DeviceType
}

export function TestimonialsPreview({
  data,
  device,
}: TestimonialsPreviewProps) {
  const sizes = {
    mobile: {
      section: 'py-10',
      heading: 'text-xl',
      subheading: 'text-xs',
      quote: 'text-sm',
      name: 'text-sm',
      role: 'text-xs',
      avatarWrapper: '',
      layoutGap: 'gap-6',
      stackDirection: 'flex-col',
      quoteMaxWidth: 'max-w-none',
    },
    tablet: {
      section: 'py-14',
      heading: 'text-2xl',
      subheading: 'text-sm',
      quote: 'text-sm',
      name: 'text-sm',
      role: 'text-xs',
      avatarWrapper: '',
      layoutGap: 'gap-10',
      stackDirection: 'flex-col md:flex-row',
      quoteMaxWidth: 'md:max-w-2xl',
    },
    desktop: {
      section: 'py-20',
      heading: 'text-[2.1rem]',
      subheading: 'text-sm',
      quote: 'text-base',
      name: 'text-base',
      role: 'text-sm',
      avatarWrapper: '',
      layoutGap: 'gap-12',
      stackDirection: 'flex-col md:flex-row',
      quoteMaxWidth: 'md:max-w-3xl',
    },
  }[device]

  return (
    <section className={`w-full bg-background ${sizes.section}`}>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Testimonials'
            title='What our team says'
            description='A few words from the people behind the work.'
          />
        </div>

        <div className='space-y-[5rem]'>
          {data.map((testimonial) => {
            const name = testimonial.employee_name || 'Team member'
            const role = testimonial.role || 'Role'
            const firstInitial = name.charAt(0).toUpperCase()

            const avatarTile = (
              <div className='relative h-20 w-20 overflow-hidden rounded-3xl bg-chart-1/15'>
                {testimonial.avatar_url ? (
                  <Image
                    src={testimonial.avatar_url}
                    alt={name}
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-base font-semibold text-chart-1'>
                    {firstInitial}
                  </div>
                )}
              </div>
            )

            const nameNode = (
              <div className={`${sizes.name} font-semibold text-foreground`}>
                {name}
              </div>
            )

            const roleNode = (
              <div className={`${sizes.role} text-muted-foreground`}>
                {role}
              </div>
            )

            const quoteNode = (
              <p
                className={`${sizes.quote} ${sizes.quoteMaxWidth} text-balance leading-relaxed text-muted-foreground italic`}>
                {testimonial.quote}
              </p>
            )

            return (
              <TestimonialLayout
                key={testimonial.id}
                avatarTile={avatarTile}
                name={nameNode}
                role={roleNode}
                quote={quoteNode}
                stackDirectionClass={sizes.stackDirection}
                gapClass={sizes.layoutGap}
                avatarWrapperClass={sizes.avatarWrapper}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
