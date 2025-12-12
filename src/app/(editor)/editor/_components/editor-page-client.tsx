'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CircleArrowOutUpRight, GripVertical } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import {
  SectionKey,
  normalizeSectionOrder,
  reorder,
  useSectionOrderStore,
} from '@/hooks/use-section-order'
import { saveSectionOrder } from '@/lib/actions/sectionOrder'
import type {
  Job,
  LifeSection,
  Location,
  Perk,
  Testimonial,
  ValueItem,
} from '@/types/database'

import { JobsEditor } from './jobs-editor'

import { HeroSectionEditor } from './hero/editor'
import { LifeSectionEditor } from './life/editor'
import { LocationsEditor } from './locations/editor'
import { PerksEditor } from './perks/editor'
import { TestimonialsEditor } from './testimonials/editor'
import { ValueItemsEditor } from './values/editor'

export type HeroEditorInitialData = {
  companyName: string
  logoUrl: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroCtaLabel: string
  heroBackgroundUrl: string
  primaryColor: string
  secondaryColor: string
}

type EditorPageClientProps = {
  heroData: HeroEditorInitialData
  lifeData: LifeSection
  testimonialsData: Testimonial[]
  valueItemsData: ValueItem[]
  locationsData: Location[]
  perksData: Perk[]
  jobsData: Job[]
  sectionOrder: string[] | null
  previewUrl: string
}

export function EditorPageClient({
  heroData,
  lifeData,
  testimonialsData,
  valueItemsData,
  locationsData,
  perksData,
  jobsData,
  sectionOrder,
  previewUrl,
}: EditorPageClientProps) {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const heroThemeStyle: Record<string, string> = {
    '--primary': heroData.primaryColor,
    '--secondary': heroData.secondaryColor,
  }

  return (
    <div className='relative'>
      {/* GLOBAL ACTION — uses globals.css primary */}
      <div className='absolute top-4 right-4 z-30'>
        <Button
          size='sm'
          className='flex items-center gap-2'
          onClick={() => window.open(previewUrl, '_blank')}>
          <CircleArrowOutUpRight className='h-4 w-4' />
          Preview
        </Button>
      </div>

      {/* THEMED CONTENT ONLY */}
      <div style={heroThemeStyle}>
        <motion.div id='hero'>
          <HeroSectionEditor initialData={heroData} />
        </motion.div>

        <SectionOrderList
          initialOrder={sectionOrder}
          life={<LifeSectionEditor initial={lifeData} />}
          values={
            <ValueItemsEditor
              initial={valueItemsData}
              primaryColor={heroData.primaryColor}
              secondaryColor={heroData.secondaryColor}
            />
          }
          testimonials={<TestimonialsEditor initial={testimonialsData} />}
          locations={<LocationsEditor initial={locationsData} />}
          perks={
            <PerksEditor
              initial={perksData}
              primaryColor={heroData.primaryColor}
              secondaryColor={heroData.secondaryColor}
            />
          }
        />

        <motion.div id='jobs'>
          <JobsEditor initial={jobsData} />
        </motion.div>
      </div>
    </div>
  )
}

type SectionOrderListProps = {
  initialOrder: string[] | null
  life: React.ReactNode
  values: React.ReactNode
  testimonials: React.ReactNode
  locations: React.ReactNode
  perks: React.ReactNode
}

function SectionOrderList({
  initialOrder,
  life,
  values,
  testimonials,
  locations,
  perks,
}: SectionOrderListProps) {
  const { order, setOrder } = useSectionOrderStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setOrder(normalizeSectionOrder(initialOrder))
  }, [initialOrder, setOrder])

  const items: Record<SectionKey, React.ReactNode> = {
    life,
    values,
    testimonials,
    locations,
    perks,
  }

  return (
    <div className='space-y-4'>
      {order.map((key) => (
        <motion.div id={key} key={key}>
          <DraggableSection
            sectionKey={key}
            onMove={async (next) => {
              setOrder(next)
              setSaving(true)
              setSaved(false)
              const result = await saveSectionOrder(next)
              if (!result.success) {
                console.error('Failed to save section order', result.error)
              }
              setSaving(false)
              setSaved(true)
              setTimeout(() => setSaved(false), 1600)
            }}
            saving={saving}
            saved={saved}>
            {items[key]}
          </DraggableSection>
        </motion.div>
      ))}
    </div>
  )
}

type DraggableSectionProps = {
  sectionKey: SectionKey
  children: React.ReactNode
  saving: boolean
  saved: boolean
  onMove: (next: SectionKey[]) => void
}

function DraggableSection({
  sectionKey,
  children,
  saving,
  saved,
  onMove,
}: DraggableSectionProps) {
  const { order } = useSectionOrderStore()
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', sectionKey)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingOver(false)
    const fromKey = e.dataTransfer.getData('text/plain') as SectionKey
    if (!fromKey || fromKey === sectionKey) return

    const fromIndex = order.indexOf(fromKey)
    const toIndex = order.indexOf(sectionKey)
    if (fromIndex === -1 || toIndex === -1) return

    const next = reorder(order, fromIndex, toIndex)
    onMove(next)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-none border transition-all ${
        isDraggingOver
          ? 'border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/20'
          : 'border-transparent'
      }`}>
      <div className='absolute left-3 top-3 flex items-center gap-2 text-xs text-muted-foreground'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-primary'>
          <GripVertical className='h-4 w-4' />
        </div>
        <span className='font-medium capitalize'>{sectionKey}</span>
        {saving && (
          <span className='text-[11px] text-muted-foreground'>Saving…</span>
        )}
        {!saving && saved && (
          <span className='text-[11px] text-primary font-medium'>Saved</span>
        )}
      </div>
      <div className='pt-12'>{children}</div>
    </div>
  )
}
