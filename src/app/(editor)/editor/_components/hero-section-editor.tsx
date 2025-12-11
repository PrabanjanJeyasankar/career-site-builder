'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { saveHeroSectionInline } from '@/lib/actions/companyProfile'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { ImageIcon, Replace } from 'lucide-react'
import type { HeroEditorInitialData } from './editor-page-client'

type HeroSectionEditorProps = {
  initialData: HeroEditorInitialData
}

type HeroEditableState = {
  logoUrl: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroCtaLabel: string
  heroBackgroundUrl: string
}

export function HeroSectionEditor({ initialData }: HeroSectionEditorProps) {
  const [state, setState] = useState<HeroEditableState>({
    logoUrl: initialData.logoUrl,
    heroTitle: initialData.heroTitle,
    heroSubtitle: initialData.heroSubtitle,
    heroDescription: initialData.heroDescription,
    heroCtaLabel: initialData.heroCtaLabel,
    heroBackgroundUrl: initialData.heroBackgroundUrl,
  })

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isEditingCta, setIsEditingCta] = useState(false)
  const [isHoveringLogo, setIsHoveringLogo] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'logo' | 'background' | null>(
    null
  )
  const [dialogUrl, setDialogUrl] = useState('')

  const titleRef = useRef<HTMLInputElement | null>(null)
  const subtitleRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  const ctaRef = useRef<HTMLInputElement | null>(null)

  function openDialog(type: 'logo' | 'background', existing: string) {
    setDialogType(type)
    setDialogUrl(existing)
    setDialogOpen(true)
  }

  async function submitDialog() {
    if (!dialogUrl.trim()) return
    if (dialogType === 'logo') {
      await saveAll({ logoUrl: dialogUrl.trim() })
    }
    if (dialogType === 'background') {
      await saveAll({ heroBackgroundUrl: dialogUrl.trim() })
    }
    setDialogOpen(false)
  }

  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
    }
  }, [isEditingTitle])

  useEffect(() => {
    if (isEditingSubtitle && subtitleRef.current) {
      subtitleRef.current.focus()
      subtitleRef.current.select()
    }
  }, [isEditingSubtitle])

  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      const el = descriptionRef.current
      el.focus()
      const length = el.value.length
      el.setSelectionRange(length, length)
    }
  }, [isEditingDescription])

  useEffect(() => {
    if (isEditingCta && ctaRef.current) {
      ctaRef.current.focus()
      ctaRef.current.select()
    }
  }, [isEditingCta])

  async function saveAll(nextPartial: Partial<HeroEditableState>) {
    const nextState = { ...state, ...nextPartial }
    setState(nextState)

    setIsSaving(true)
    setError(null)

    const result = await saveHeroSectionInline({
      heroTitle: nextState.heroTitle.trim(),
      heroSubtitle: nextState.heroSubtitle.trim(),
      heroDescription: nextState.heroDescription.trim(),
      heroCtaLabel: nextState.heroCtaLabel.trim(),
      heroBackgroundUrl: nextState.heroBackgroundUrl.trim(),
      logoUrl: nextState.logoUrl.trim() || undefined,
    })

    if (result.error) setError(result.error)
    setIsSaving(false)
  }

  return (
    <>
      {/* Floating Helper Button */}

      {/* Main Editor */}
      <section className='relative overflow-hidden rounded-none border-none bg-gray-900 text-white shadow-lg'>
        {/* BACKGROUND LAYER (pointer-events disabled) */}
        <div className='absolute inset-0 pointer-events-none'>
          {state.heroBackgroundUrl && (
            <Image
              src={state.heroBackgroundUrl}
              alt=''
              fill
              unoptimized
              priority
              className='object-cover'
            />
          )}
        </div>

        {/* BLUR & GRADIENT LAYER (pointer-events disabled) */}
        <div className='absolute inset-0 pointer-events-none'>
          {state.heroBackgroundUrl && (
            <Image
              src={state.heroBackgroundUrl}
              alt=''
              fill
              unoptimized
              priority
              className='scale-110 object-cover blur-3xl opacity-80'
            />
          )}
        </div>

        <div className='relative flex min-h-[420px] flex-col items-center justify-center px-4 py-12'>
          {/* CHANGE BACKGROUND BUTTON */}
          <div className='absolute bottom-4 right-4 flex gap-2 z-20'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => openDialog('background', state.heroBackgroundUrl)}
              className='cursor-pointer flex items-center gap-2 border-white/20 bg-black/20 text-xs text-white hover:bg-white/10 hover:text-white'>
              <ImageIcon className='h-4 w-4' />
              Change background
            </Button>
          </div>

          {/* LOGO */}
          <div
            className='mb-6 flex items-center justify-center z-20'
            onMouseEnter={() => setIsHoveringLogo(true)}
            onMouseLeave={() => setIsHoveringLogo(false)}>
            <div className='relative'>
              {state.logoUrl ? (
                <Image
                  src={state.logoUrl}
                  alt={`${initialData.companyName} logo`}
                  width={140}
                  height={140}
                  className='h-28 w-28 rounded-full object-contain'
                />
              ) : (
                <div className='flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-medium text-white/80'>
                  Logo
                </div>
              )}

              {isHoveringLogo && (
                <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40 z-30'>
                  <Button
                    size='sm'
                    variant='secondary'
                    className='cursor-pointer h-7 px-3 text-xs flex items-center gap-2'
                    onClick={() => openDialog('logo', state.logoUrl)}>
                    <Replace className='h-3 w-3' />
                    Replace
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className='mx-auto flex max-w-2xl flex-col items-center gap-8 text-center z-20'>
            <div
              onClick={(e) => e.detail === 2 && setIsEditingTitle(true)}
              className='w-full'>
              {isEditingTitle ? (
                <input
                  ref={titleRef}
                  value={state.heroTitle}
                  onChange={(e) =>
                    setState({ ...state, heroTitle: e.target.value })
                  }
                  onBlur={() => {
                    saveAll({ heroTitle: state.heroTitle })
                    setIsEditingTitle(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveAll({ heroTitle: state.heroTitle })
                      setIsEditingTitle(false)
                    }
                  }}
                  className='w-full bg-transparent text-center text-4xl font-semibold outline-none'
                  placeholder='Add a hero title'
                />
              ) : (
                <h1 className='cursor-text text-5xl font-semibold'>
                  {state.heroTitle || 'Add a hero title'}
                </h1>
              )}
            </div>

            {/* SUBTITLE */}
            <div
              onClick={(e) => e.detail === 2 && setIsEditingSubtitle(true)}
              className='w-full'>
              {isEditingSubtitle ? (
                <input
                  ref={subtitleRef}
                  value={state.heroSubtitle}
                  onChange={(e) =>
                    setState({ ...state, heroSubtitle: e.target.value })
                  }
                  onBlur={() => {
                    saveAll({ heroSubtitle: state.heroSubtitle })
                    setIsEditingSubtitle(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveAll({ heroSubtitle: state.heroSubtitle })
                      setIsEditingSubtitle(false)
                    }
                  }}
                  className='w-full bg-transparent text-center text-lg outline-none'
                  placeholder='Add a hero subtitle'
                />
              ) : (
                <p className='cursor-text text-xl font-medium text-white/90'>
                  {state.heroSubtitle || 'Add a hero subtitle'}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div
              onClick={(e) => e.detail === 2 && setIsEditingDescription(true)}
              className='w-full'>
              {isEditingDescription ? (
                <textarea
                  ref={descriptionRef}
                  value={state.heroDescription}
                  onChange={(e) =>
                    setState({ ...state, heroDescription: e.target.value })
                  }
                  onBlur={() => {
                    saveAll({ heroDescription: state.heroDescription })
                    setIsEditingDescription(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveAll({ heroDescription: state.heroDescription })
                      setIsEditingDescription(false)
                    }
                  }}
                  rows={4}
                  className='mx-auto w-full max-w-xl bg-transparent text-center outline-none'
                  placeholder='Describe what makes your company and roles special.'
                />
              ) : (
                <p className='mx-auto max-w-xl cursor-text text-sm text-white/70 leading-relaxed'>
                  {state.heroDescription ||
                    'Describe what makes your company and roles special.'}
                </p>
              )}
            </div>

            {/* CTA */}
            <div className='mt-4'>
              {isEditingCta ? (
                <input
                  ref={ctaRef}
                  value={state.heroCtaLabel}
                  onChange={(e) =>
                    setState({ ...state, heroCtaLabel: e.target.value })
                  }
                  onBlur={() => {
                    saveAll({ heroCtaLabel: state.heroCtaLabel })
                    setIsEditingCta(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveAll({ heroCtaLabel: state.heroCtaLabel })
                      setIsEditingCta(false)
                    }
                  }}
                  className='h-10 rounded-md bg-white/10 px-4 text-white outline-none'
                  placeholder='View jobs'
                />
              ) : (
                <Button
                  size='lg'
                  onClick={(e) => e.detail === 2 && setIsEditingCta(true)}
                  style={{ backgroundColor: initialData.primaryColor }}
                  className='rounded-md px-6 text-sm font-semibold text-white shadow-md hover:opacity-90'>
                  {state.heroCtaLabel || 'View jobs'}
                </Button>
              )}
            </div>

            {error && <p className='mt-2 text-xs text-red-300'>{error}</p>}
          </div>
        </div>
      </section>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogType === 'logo'
                ? 'Replace Logo'
                : 'Change Background Image'}
            </AlertDialogTitle>

            <AlertDialogDescription>
              Paste the image URL you want to apply.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <input
            autoFocus
            value={dialogUrl}
            onChange={(e) => setDialogUrl(e.target.value)}
            className='mt-4 w-full rounded-md border bg-background p-2 text-sm outline-none'
            placeholder='Paste image URL…'
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitDialog}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
