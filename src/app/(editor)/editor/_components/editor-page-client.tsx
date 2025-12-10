'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { useEffect } from 'react'

import type { LifeSection } from '@/types/database'
import { HeroSectionEditor } from './hero-section-editor'
import { LifeSectionEditor } from './life-section-editor'

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
}

export function EditorPageClient({
  heroData,
  lifeData,
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
    </div>
  )
}
