'use client'

import Image from 'next/image'

import { Button } from '@/components/ui/button'
import type { DeviceType } from '@/components/ui/device-switcher'

import type { HeroEditorInitialData } from './editor-page-client'

type HeroSectionPreviewProps = {
  data: HeroEditorInitialData
  device?: DeviceType
}

export function HeroSectionPreview({
  data,
  device = 'desktop',
}: HeroSectionPreviewProps) {
  const getDeviceClasses = () => {
    if (device === 'mobile') {
      return {
        section:
          'relative overflow-hidden rounded-none border-none bg-gray-900 text-white shadow-lg',
        content:
          'relative flex min-h-[300px] flex-col items-center justify-center px-4 py-8',
        logoContainer: 'mb-4 flex items-center justify-center z-20',
        logo: 'h-16 w-16 rounded-full object-contain',
        logoPlaceholder:
          'flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-medium text-white/80',
        textContainer:
          'mx-auto flex max-w-2xl flex-col items-center gap-6 text-center z-20',
        title: 'text-2xl font-semibold',
        subtitle: 'text-base text-white/80',
        description: 'mx-auto max-w-xl text-sm text-white/80',
        buttonContainer: 'mt-3',
        button:
          'rounded-md px-5 text-sm font-semibold text-white shadow-md hover:opacity-90',
      }
    } else if (device === 'tablet') {
      return {
        section:
          'relative overflow-hidden rounded-none border-none bg-gray-900 text-white shadow-lg',
        content:
          'relative flex min-h-[360px] flex-col items-center justify-center px-6 py-10',
        logoContainer: 'mb-5 flex items-center justify-center z-20',
        logo: 'h-18 w-18 rounded-full object-contain',
        logoPlaceholder:
          'flex h-18 w-18 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-medium text-white/80',
        textContainer:
          'mx-auto flex max-w-2xl flex-col items-center gap-7 text-center z-20',
        title: 'text-3xl font-semibold',
        subtitle: 'text-lg text-white/80',
        description: 'mx-auto max-w-xl text-white/80',
        buttonContainer: 'mt-4',
        button:
          'rounded-md px-6 text-sm font-semibold text-white shadow-md hover:opacity-90',
      }
    } else {
      return {
        section:
          'relative overflow-hidden rounded-none border-none bg-gray-900 text-white shadow-lg',
        content:
          'relative flex min-h-[420px] flex-col items-center justify-center px-4 py-12',
        logoContainer: 'mb-6 flex items-center justify-center z-20',
        logo: 'h-20 w-20 rounded-full object-contain',
        logoPlaceholder:
          'flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-medium text-white/80',
        textContainer:
          'mx-auto flex max-w-2xl flex-col items-center gap-8 text-center z-20',
        title: 'text-4xl font-semibold',
        subtitle: 'text-lg text-white/80',
        description: 'mx-auto max-w-xl text-white/80',
        buttonContainer: 'mt-4',
        button:
          'rounded-md px-6 text-sm font-semibold text-white shadow-md hover:opacity-90',
      }
    }
  }

  const classes = getDeviceClasses()

  return (
    <section className={classes.section}>
      {/* BACKGROUND LAYER */}
      <div className='absolute inset-0 pointer-events-none'>
        {data.heroBackgroundUrl && (
          <Image
            src={data.heroBackgroundUrl}
            alt=''
            fill
            unoptimized
            priority
            className='object-cover'
          />
        )}
      </div>

      {/* BLUR & GRADIENT LAYER */}
      <div className='absolute inset-0 pointer-events-none'>
        {data.heroBackgroundUrl && (
          <Image
            src={data.heroBackgroundUrl}
            alt=''
            fill
            unoptimized
            priority
            className='scale-110 object-cover blur-3xl opacity-80'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60' />
      </div>

      <div className={classes.content}>
        {/* LOGO */}
        <div className={classes.logoContainer}>
          <div className='relative'>
            {data.logoUrl ? (
              <Image
                src={data.logoUrl}
                alt={`${data.companyName} logo`}
                width={96}
                height={96}
                className={classes.logo}
              />
            ) : (
              <div className={classes.logoPlaceholder}>Logo</div>
            )}
          </div>
        </div>

        {/* HERO TEXT */}
        <div className={classes.textContainer}>
          <h1 className={classes.title}>
            {data.heroTitle || 'Add a hero title'}
          </h1>
          <p className={classes.subtitle}>
            {data.heroSubtitle || 'Add a hero subtitle'}
          </p>
          <p className={classes.description}>
            {data.heroDescription ||
              'Describe what makes your company and roles special.'}
          </p>

          <div className={classes.buttonContainer}>
            <Button
              size='lg'
              type='button'
              style={{ backgroundColor: data.primaryColor }}
              className={classes.button}>
              {data.heroCtaLabel || 'View jobs'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
