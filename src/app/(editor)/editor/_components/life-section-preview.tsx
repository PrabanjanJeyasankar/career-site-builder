'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { LifeSection } from '@/types/database'
import Image from 'next/image'

type LifeSectionPreviewProps = {
  data: LifeSection
  device?: DeviceType
}

export function LifeSectionPreview({
  data,
  device = 'desktop',
}: LifeSectionPreviewProps) {
  const getDeviceClasses = () => {
    if (device === 'mobile') {
      return {
        section: 'w-full py-4 bg-white',
        heading: 'mx-auto max-w-3xl px-4 mb-4 text-center pb-4',
        headingText: 'text-xl font-semibold text-gray-900',
        grid: 'mx-auto max-w-6xl flex flex-col gap-4 px-4 items-center',
        textContainer: 'space-y-4 leading-relaxed',
        primaryText: 'text-xs text-gray-700',
        secondaryText: 'text-xs text-gray-600',
        imageContainer:
          'relative w-full rounded-2xl overflow-hidden flex items-center justify-center min-h-[120px] mt-4',
        image: 'object-contain w-full h-full max-h-[140px]',
        fallbackImage: 'w-full bg-gray-200 rounded-2xl min-h-[120px]',
      }
    } else if (device === 'tablet') {
      return {
        section: 'w-full py-6 bg-white',
        heading: 'mx-auto max-w-3xl px-6 mb-6 text-center pb-6',
        headingText: 'text-2xl font-semibold text-gray-900',
        grid: 'mx-auto max-w-6xl flex flex-col gap-8 px-6 items-center',
        textContainer: 'space-y-6 leading-relaxed',
        primaryText: 'text-base text-gray-700',
        secondaryText: 'text-sm text-gray-600',
        imageContainer:
          'relative w-full rounded-2xl overflow-hidden flex items-center justify-center min-h-[180px] mt-4',
        image: 'object-contain w-full h-full max-h-[200px]',
        fallbackImage: 'w-full bg-gray-200 rounded-2xl min-h-[180px]',
      }
    } else {
      return {
        section: 'w-full py-6 xs:py-8 sm:py-16 md:py-20 bg-white',
        heading:
          'mx-auto max-w-3xl px-3 xs:px-4 sm:px-6 mb-4 xs:mb-6 text-center pb-4 xs:pb-6 sm:pb-8',
        headingText:
          'text-lg xs:text-xl sm:text-3xl md:text-4xl font-semibold text-gray-900',
        grid: 'mx-auto max-w-6xl flex flex-col md:grid md:grid-cols-2 gap-4 xs:gap-6 sm:gap-12 md:gap-16 px-3 xs:px-4 sm:px-6 items-center',
        textContainer: 'space-y-4 xs:space-y-6 sm:space-y-8 leading-relaxed',
        primaryText: 'text-sm xs:text-base sm:text-lg text-gray-700',
        secondaryText: 'text-xs xs:text-sm sm:text-base text-gray-600',
        imageContainer:
          'relative w-full rounded-2xl overflow-hidden flex items-center justify-center min-h-[120px] xs:min-h-[160px] sm:min-h-[220px] md:min-h-[260px] mt-4 md:mt-0',
        image:
          'object-contain w-full h-full max-h-[140px] xs:max-h-[180px] sm:max-h-80 md:max-h-[400px]',
        fallbackImage:
          'w-full bg-gray-200 rounded-2xl min-h-[120px] xs:min-h-[160px] sm:min-h-[220px] md:min-h-[260px]',
      }
    }
  }

  const classes = getDeviceClasses()

  return (
    <section className={classes.section}>
      {/* CENTERED HEADING */}
      <div className={classes.heading}>
        <h2 className={classes.headingText}>
          {data.heading || 'Life at your company'}
        </h2>
      </div>

      {/* MAIN GRID */}
      <div className={classes.grid}>
        {/* LEFT TEXT */}
        <div className={classes.textContainer}>
          <p className={classes.primaryText}>
            {data.description_primary ||
              'Describe your workplace culture and environment.'}
          </p>

          <p className={classes.secondaryText}>
            {data.description_secondary ||
              'Describe mission, values, growth and opportunities.'}
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className={classes.imageContainer}>
          {data.image_url ? (
            <Image
              src={data.image_url}
              alt='Life section image'
              width={600}
              height={400}
              className={classes.image}
              sizes='(max-width: 480px) 100vw, (max-width: 768px) 100vw, 50vw'
              priority
            />
          ) : (
            <div className={classes.fallbackImage} />
          )}
        </div>
      </div>
    </section>
  )
}
