'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { useEffect } from 'react'

import type {
  Job,
  LifeSection,
  Location,
  Perk,
  Testimonial,
  ValueItem,
} from '@/types/database'
import { HeroSectionEditor } from './hero-section-editor'
import { JobsEditor } from './jobs-editor'
import { LifeSectionEditor } from './life-section-editor'
import { LocationsEditor } from './locations-editor'
import { PerksEditor } from './perks-editor'
import { TestimonialsEditor } from './testimonials-editor'
import { ValueItemsEditor } from './value-items-editor'

export type HeroEditorInitialData = {
  companyName: string
  logoUrl: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroCtaLabel: string
  heroBackgroundUrl: string
  primaryColor: string
}

type EditorPageClientProps = {
  heroData: HeroEditorInitialData
  lifeData: LifeSection
  testimonialsData: Testimonial[]
  valueItemsData: ValueItem[]
  locationsData: Location[]
  perksData: Perk[]
  jobsData: Job[]
}

export function EditorPageClient({
  heroData,
  lifeData,
  testimonialsData,
  valueItemsData,
  locationsData,
  perksData,
  jobsData,
}: EditorPageClientProps) {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    window.scrollTo(0, el.offsetTop)
  }, [])

  return (
    <div className='relative'>
      <div className='absolute top-4 right-4 z-30'>
        <Button
          size='sm'
          className='cursor-pointer flex items-center gap-2'
          onClick={() => window.open('/preview', '_blank')}>
          <Eye className='h-4 w-4' />
          Preview
        </Button>
      </div>

      <motion.div id='hero'>
        <HeroSectionEditor initialData={heroData} />
      </motion.div>

      <motion.div id='life'>
        <LifeSectionEditor initial={lifeData} />
      </motion.div>

      <motion.div id='values'>
        <ValueItemsEditor initial={valueItemsData} />
      </motion.div>

      <motion.div id='testimonials'>
        <TestimonialsEditor initial={testimonialsData} />
      </motion.div>

      <motion.div id='locations'>
        <LocationsEditor initial={locationsData} />
      </motion.div>

      <motion.div id='perks'>
        <PerksEditor initial={perksData} />
      </motion.div>

      <motion.div id='jobs'>
        <JobsEditor initial={jobsData} />
      </motion.div>
    </div>
  )
}
