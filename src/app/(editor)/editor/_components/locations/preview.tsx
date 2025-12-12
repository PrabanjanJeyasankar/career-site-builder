'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { Location } from '@/types/database'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import { SectionHeading } from '../section-heading'

type LocationsPreviewProps = {
  data: Location[]
  device: DeviceType
}

export function LocationsPreview({ data, device }: LocationsPreviewProps) {
  const sizes = {
    mobile: {
      heading: 'text-2xl',
      subheading: 'text-xs',
      city: 'text-sm',
      country: 'text-xs',
      address: 'text-xs',
      image: 'h-32',
      section: 'py-16',
      grid: 'grid-cols-1 gap-6 justify-items-stretch',
      card: 'p-5',
    },
    tablet: {
      heading: 'text-2xl',
      subheading: 'text-xs',
      city: 'text-sm',
      country: 'text-xs',
      address: 'text-sm',
      image: 'h-40',
      section: 'py-16',
      grid: 'grid-cols-2 gap-8 justify-items-start',
      card: 'p-5',
    },
    desktop: {
      heading: 'text-2xl',
      subheading: 'text-xs',
      city: 'text-sm',
      country: 'text-[0.7rem]',
      address: 'text-sm',
      image: 'h-48',
      section: 'py-16',
      grid: 'grid-cols-3 gap-8 justify-items-start',
      card: 'p-5',
    },
  }[device]

  return (
    <section className={`w-full bg-background ${sizes.section}`}>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='mb-12 md:mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Locations'
            title='Where we work from'
            description='Show the hubs and spaces where your teams collaborate.'
            className='text-center md:text-left'
          />
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-stretch sm:justify-items-start`}>
          {data.map((location) => (
            <div
              key={location.id}
              className='flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card'>
              <div className={`relative w-full ${sizes.image} bg-chart-3/10`}>
                {location.image_url ? (
                  <Image
                    src={location.image_url}
                    alt={`${location.city}, ${location.country}`}
                    fill
                    sizes='100vw'
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-chart-3'>
                    <MapPin className='h-8 w-8' />
                  </div>
                )}
              </div>

              <div className={`${sizes.card} flex flex-1 flex-col gap-2.5`}>
                <h3
                  className={`${sizes.city} mb-1.5 font-semibold text-foreground`}>
                  {location.city}
                </h3>

                <p
                  className={`${sizes.country} font-medium uppercase tracking-[0.14em] text-muted-foreground`}>
                  {location.country}
                </p>

                {location.address && (
                  <p className={`${sizes.address} text-muted-foreground`}>
                    {location.address}
                  </p>
                )}

                {location.map_url && (
                  <div className='mt-auto flex justify-end'>
                    <a
                      href={location.map_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`${sizes.address} inline-flex items-center gap-1 text-primary`}>
                      <MapPin className='h-3 w-3' />
                      View on map
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
