'use client'

import { ImageUploadDialog } from '@/components/common/ImageUploadDialog'
import { Button } from '@/components/ui/button'
import { saveLifeSectionInline } from '@/lib/actions/lifeSectionInline'
import type { LifeSection } from '@/types/database'
import { Replace } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type EditorProps = {
  initial: LifeSection
}

export function LifeSectionEditor({ initial }: EditorProps) {
  const [data, setData] = useState(initial)

  const [editingHeading, setEditingHeading] = useState(false)
  const [editingPrimary, setEditingPrimary] = useState(false)
  const [editingSecondary, setEditingSecondary] = useState(false)

  const headingRef = useRef<HTMLInputElement | null>(null)
  const primaryRef = useRef<HTMLTextAreaElement | null>(null)
  const secondaryRef = useRef<HTMLTextAreaElement | null>(null)

  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  async function handleImageUpload(url: string) {
    const next = { ...data, image_url: url }
    setData(next)
    await save({ image_url: url })
  }

  async function save(patch: Partial<LifeSection>) {
    const payload = {
      heading: patch.heading ?? undefined,
      descriptionPrimary: patch.description_primary ?? undefined,
      descriptionSecondary: patch.description_secondary ?? undefined,
      image: patch.image_url ?? undefined,
    }

    console.log('[LifeSectionEditor] Saving life section...', payload)

    try {
      const result = await saveLifeSectionInline(payload)
      console.log('[LifeSectionEditor] Save completed', { result })

      if (!result.success) {
        console.error(
          '[LifeSectionEditor] Save failed with error:',
          result.error
        )
      }
    } catch (error) {
      console.error('[LifeSectionEditor] Save failed', error)
    }
  }

  useEffect(() => {
    if (editingHeading && headingRef.current) {
      headingRef.current.focus()
      headingRef.current.select()
    }
  }, [editingHeading])

  useEffect(() => {
    if (editingPrimary && primaryRef.current) {
      const el = primaryRef.current
      el.focus()
      const len = el.value.length
      el.setSelectionRange(len, len)
    }
  }, [editingPrimary])

  useEffect(() => {
    if (editingSecondary && secondaryRef.current) {
      const el = secondaryRef.current
      el.focus()
      const len = el.value.length
      el.setSelectionRange(len, len)
    }
  }, [editingSecondary])

  return (
    <section className='w-full bg-background py-16'>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-12 max-w-3xl space-y-3'>
          <span className='text-[0.7rem] font-medium uppercase tracking-[0.2em] text-primary'>
            Culture
          </span>
          <div onClick={(e) => e.detail === 2 && setEditingHeading(true)}>
            {editingHeading ? (
              <input
                ref={headingRef}
                value={data.heading ?? ''}
                onChange={(e) => setData({ ...data, heading: e.target.value })}
                onBlur={() => {
                  save({ heading: data.heading })
                  setEditingHeading(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    save({ heading: data.heading })
                    setEditingHeading(false)
                  }
                }}
                className='w-full bg-transparent text-2xl font-semibold tracking-tight text-foreground outline-none md:text-3xl'
                placeholder='Life at your company'
              />
            ) : (
              <h2 className='cursor-text text-2xl font-semibold tracking-tight text-foreground md:text-3xl'>
                {data.heading || 'Life at your company'}
              </h2>
            )}
          </div>
        </div>
      </div>

      <div className='mx-auto grid max-w-5xl grid-cols-1 items-center gap-16 px-4 md:grid-cols-2'>
        <div className='space-y-6 leading-relaxed'>
          <div onClick={(e) => e.detail === 2 && setEditingPrimary(true)}>
            {editingPrimary ? (
              <textarea
                ref={primaryRef}
                value={data.description_primary ?? ''}
                onChange={(e) =>
                  setData({ ...data, description_primary: e.target.value })
                }
                onBlur={() => {
                  save({ description_primary: data.description_primary })
                  setEditingPrimary(false)
                }}
                rows={3}
                className='w-full resize-none bg-transparent text-sm text-muted-foreground outline-none md:text-base'
                placeholder='Describe your workplace culture and environment.'
              />
            ) : (
              <p className='cursor-text text-sm text-muted-foreground md:text-base'>
                {data.description_primary ||
                  'Describe your workplace culture and environment.'}
              </p>
            )}
          </div>

          <div onClick={(e) => e.detail === 2 && setEditingSecondary(true)}>
            {editingSecondary ? (
              <textarea
                ref={secondaryRef}
                value={data.description_secondary ?? ''}
                onChange={(e) =>
                  setData({ ...data, description_secondary: e.target.value })
                }
                onBlur={() => {
                  save({ description_secondary: data.description_secondary })
                  setEditingSecondary(false)
                }}
                rows={3}
                className='w-full resize-none bg-transparent text-xs text-muted-foreground outline-none md:text-sm'
                placeholder='Describe mission, values, growth and opportunities.'
              />
            ) : (
              <p className='cursor-text text-sm text-muted-foreground md:text-sm'>
                {data.description_secondary ||
                  'Describe mission, values, growth and opportunities.'}
              </p>
            )}
          </div>
        </div>

        <div className='group relative w-full rounded-2xl overflow-hidden flex items-center justify-center'>
          {data.image_url ? (
            <Image
              src={data.image_url}
              alt='Life Section Image'
              width={600}
              height={400}
              className='object-contain max-h-[400px] w-auto h-auto'
            />
          ) : (
            <div className='w-full bg-gray-200 rounded-2xl min-h-[200px]' />
          )}

          <div className='absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity'>
            <Button
              size='sm'
              variant='secondary'
              className='cursor-pointer flex items-center gap-2 text-white'
              onClick={() => setImageDialogOpen(true)}>
              <Replace className='h-4 w-4' />
              Replace
            </Button>
          </div>
        </div>
      </div>

      <ImageUploadDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onUpload={handleImageUpload}
        existingUrl={data.image_url ?? undefined}
        title='Upload life section image'
        description='Select an image that represents your company culture'
        allowedFormats={['image/jpeg', 'image/png', 'image/webp']}
      />
    </section>
  )
}
