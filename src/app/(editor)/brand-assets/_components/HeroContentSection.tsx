// HeroContentSection.tsx

import { Image as ImageIcon, Info, Megaphone, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { ImageUploadDialog } from '@/components/common/ImageUploadDialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

const TEXTAREA_CLASSNAME =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-sm rounded-md border bg-transparent px-3 py-2 shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50'

type HeroContentSectionProps = {
  register: UseFormRegister<CompanyProfileFormValues>
  control: Control<CompanyProfileFormValues>
  errors: FieldErrors<CompanyProfileFormValues>
}

export function HeroContentSection({
  register,
  control,
  errors,
}: HeroContentSectionProps) {
  const [heroImageDialogOpen, setHeroImageDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Megaphone className='size-5 text-primary' />
          <span>Hero content</span>
        </CardTitle>
        <CardDescription>
          Control the headline, supporting copy, and CTA visitors see first.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='grid gap-6 md:grid-cols-2'>
          <Field>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='hero_title'>Hero title</FieldLabel>
              <InfoTooltip content='The main headline at the top of your careers site.' />
            </div>
            <Input
              id='hero_title'
              placeholder='Build a career that matters'
              {...register('hero_title')}
            />
            <FieldError errors={[errors.hero_title]} />
          </Field>

          <Field>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='hero_subtitle'>Hero subtitle</FieldLabel>
              <InfoTooltip content='Supporting text to frame the hero story.' />
            </div>
            <Input
              id='hero_subtitle'
              placeholder='Our teams craft candidate experiences people love.'
              {...register('hero_subtitle')}
            />
            <FieldError errors={[errors.hero_subtitle]} />
          </Field>
        </div>

        <Field>
          <div className='flex items-center gap-2'>
            <FieldLabel htmlFor='hero_description'>Hero description</FieldLabel>
            <InfoTooltip content='Explain your mission in a few concise sentences.' />
          </div>
          <textarea
            id='hero_description'
            rows={4}
            placeholder='Explain what your team is building and why someone should join.'
            className={TEXTAREA_CLASSNAME}
            {...register('hero_description')}
          />
          <FieldError errors={[errors.hero_description]} />
        </Field>

        <div className='grid gap-6 md:grid-cols-2'>
          <Field>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='hero_cta_label'>CTA label</FieldLabel>
              <InfoTooltip content="Button label visitors click, e.g. 'View open roles'." />
            </div>
            <Input
              id='hero_cta_label'
              placeholder='View open roles'
              {...register('hero_cta_label')}
            />
            <FieldError errors={[errors.hero_cta_label]} />
          </Field>

          <Controller
            name='hero_background_url'
            control={control}
            render={({ field }) => (
              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='hero_background_url'>
                    Hero background image
                  </FieldLabel>
                  <InfoTooltip content='Optional high-resolution visual that sits behind the hero.' />
                </div>
                {field.value ? (
                  <div className='group relative flex items-center gap-3 rounded-md border bg-card p-3'>
                    <div className='relative h-12 w-20 overflow-hidden rounded bg-muted'>
                      <Image
                        src={field.value}
                        alt='Hero background'
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        Hero image uploaded
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {field.value}
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 shrink-0'
                      onClick={() => field.onChange('')}>
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full justify-start'
                    onClick={() => setHeroImageDialogOpen(true)}>
                    <ImageIcon className='mr-2 h-4 w-4' />
                    Upload hero image
                  </Button>
                )}
                <FieldError errors={[errors.hero_background_url]} />
                <ImageUploadDialog
                  open={heroImageDialogOpen}
                  onOpenChange={setHeroImageDialogOpen}
                  onUpload={field.onChange}
                  existingUrl={field.value}
                  title='Upload hero background image'
                  description='Select a high-resolution image for your hero section'
                  allowedFormats={['image/jpeg', 'image/png', 'image/webp']}
                />
              </Field>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function InfoTooltip({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type='button'
          aria-label='Field info'
          className='text-primary/80 hover:text-primary p-1 transition-colors'>
          <Info className='size-4' aria-hidden='true' />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side='top'
        align='start'
        className='max-w-xs border border-primary/50 text-primary-foreground text-xs font-medium shadow-lg'>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
