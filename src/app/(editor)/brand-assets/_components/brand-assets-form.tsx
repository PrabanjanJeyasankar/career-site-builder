'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Brush, Info, Megaphone, Share2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { saveCompanyProfile } from '@/lib/actions/companyProfile'
import { cn } from '@/lib/utils'
import {
  companyProfileFormSchema,
  type CompanyProfileFormValues,
} from '@/lib/validation/companyProfileSchema'

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
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type BrandAssetsFormProps = {
  defaultValues: CompanyProfileFormValues
  lastUpdatedLabel?: string
}

export function BrandAssetsForm({
  defaultValues,
  lastUpdatedLabel,
}: BrandAssetsFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileFormSchema),
    defaultValues,
  })

  const primaryColor =
    useWatch({
      control,
      name: 'primary_color',
    }) || '#5038ee'
  const secondaryColor =
    useWatch({
      control,
      name: 'secondary_color',
    }) || '#f5f5f5'

  async function onSubmit(values: CompanyProfileFormValues) {
    setStatus('idle')
    setMessage('')

    const result = await saveCompanyProfile(values)
    if (result?.error) {
      setStatus('error')
      setMessage(result.error)
      return
    }

    setStatus('success')
    setMessage('Brand assets were saved successfully.')
    reset(values)
  }

  return (
    <TooltipProvider delayDuration={150}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {message && (
          <div
            className={cn(
              'rounded-lg border px-4 py-3 text-sm',
              status === 'error'
                ? 'border-destructive/50 bg-destructive/10 text-destructive'
                : 'border-emerald-500/40 bg-emerald-50 text-emerald-700'
            )}>
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brush className='size-5 text-primary' />
              <span>Brand identity</span>
            </CardTitle>
            <CardDescription>
              These details power your company profile, navigation, and SEO
              snippets.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='company_name'>Company name</FieldLabel>
                  <InfoTooltip
                    label='Company name info'
                    content='Appears anywhere the company name is referenced.'
                  />
                </div>
                <Input
                  id='company_name'
                  placeholder='WhiteCarrot'
                  {...register('company_name')}
                />
                <FieldError errors={[errors.company_name]} />
              </Field>

              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='tagline'>Tagline</FieldLabel>
                  <InfoTooltip
                    label='Tagline info'
                    content='A short line that describes your mission in one sentence.'
                  />
                </div>
                <Input
                  id='tagline'
                  placeholder='Build remarkable career sites'
                  {...register('tagline')}
                />
                <FieldError errors={[errors.tagline]} />
              </Field>
            </div>

            <Field>
              <div className='flex items-center gap-2'>
                <FieldLabel htmlFor='description'>
                  Company description
                </FieldLabel>
                <InfoTooltip
                  label='Company description info'
                  content='Used for metadata and the About section of the profile.'
                />
              </div>
              <textarea
                id='description'
                rows={4}
                placeholder='Share what makes your team unique...'
                className={textareaClassName}
                {...register('description')}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <div className='grid gap-6 md:grid-cols-2'>
              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='logo_url'>Logo URL</FieldLabel>
                  <InfoTooltip
                    label='Logo url info'
                    content='Prefer a transparent PNG or SVG stored in your CDN.'
                  />
                </div>
                <Input
                  id='logo_url'
                  type='url'
                  placeholder='https://cdn.example.com/logo.svg'
                  {...register('logo_url')}
                />
                <FieldError errors={[errors.logo_url]} />
              </Field>

              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='favicon_url'>Favicon URL</FieldLabel>
                  <InfoTooltip
                    label='Favicon url info'
                    content='Used for the browser tab icon and social previews.'
                  />
                </div>
                <Input
                  id='favicon_url'
                  type='url'
                  placeholder='https://cdn.example.com/favicon.png'
                  {...register('favicon_url')}
                />
                <FieldError errors={[errors.favicon_url]} />
              </Field>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='primary_color'>Primary color</FieldLabel>
                  <InfoTooltip
                    label='Primary color info'
                    content='Buttons and key accents use this color.'
                  />
                </div>
                <div className='flex items-center gap-3'>
                  <span
                    className='size-10 rounded-md border shadow-inner'
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Input
                    id='primary_color'
                    placeholder='#5038EE'
                    {...register('primary_color')}
                  />
                </div>
                <FieldError errors={[errors.primary_color]} />
              </Field>

              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='secondary_color'>
                    Secondary color
                  </FieldLabel>
                  <InfoTooltip
                    label='Secondary color info'
                    content='Backgrounds for cards and subtle UI.'
                  />
                </div>
                <div className='flex items-center gap-3'>
                  <span
                    className='size-10 rounded-md border shadow-inner'
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <Input
                    id='secondary_color'
                    placeholder='#F5F5F5'
                    {...register('secondary_color')}
                  />
                </div>
                <FieldError errors={[errors.secondary_color]} />
              </Field>
            </div>
          </CardContent>
        </Card>

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
                  <InfoTooltip
                    label='Hero title info'
                    content='The main headline at the top of your careers site.'
                  />
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
                  <InfoTooltip
                    label='Hero subtitle info'
                    content='Supporting text to frame the hero story.'
                  />
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
                <FieldLabel htmlFor='hero_description'>
                  Hero description
                </FieldLabel>
                <InfoTooltip
                  label='Hero description info'
                  content='Explain your mission in a few concise sentences.'
                />
              </div>
              <textarea
                id='hero_description'
                rows={4}
                placeholder='Explain what your team is building and why someone should join.'
                className={textareaClassName}
                {...register('hero_description')}
              />
              <FieldError errors={[errors.hero_description]} />
            </Field>

            <div className='grid gap-6 md:grid-cols-2'>
              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='hero_cta_label'>CTA label</FieldLabel>
                  <InfoTooltip
                    label='CTA label info'
                    content="Button label visitors click, e.g. 'View open roles'."
                  />
                </div>
                <Input
                  id='hero_cta_label'
                  placeholder='View open roles'
                  {...register('hero_cta_label')}
                />
                <FieldError errors={[errors.hero_cta_label]} />
              </Field>

              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='hero_background_url'>
                    Hero background image
                  </FieldLabel>
                  <InfoTooltip
                    label='Hero background info'
                    content='Optional high-resolution visual that sits behind the hero.'
                  />
                </div>
                <Input
                  id='hero_background_url'
                  type='url'
                  placeholder='https://cdn.example.com/hero.jpg'
                  {...register('hero_background_url')}
                />
                <FieldError errors={[errors.hero_background_url]} />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Share2 className='size-5 text-primary' />
              <span>Social & SEO</span>
            </CardTitle>
            <CardDescription>
              Provide an image optimized for Slack, LinkedIn, and iMessage
              previews.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <Field>
              <div className='flex items-center gap-2'>
                <FieldLabel htmlFor='social_preview_url'>
                  Social preview image
                </FieldLabel>
                <InfoTooltip
                  label='Social preview info'
                  content='Recommended 1200 x 630 px JPG/PNG used for Open Graph tags.'
                />
              </div>
              <Input
                id='social_preview_url'
                type='url'
                placeholder='https://cdn.example.com/social-preview.png'
                {...register('social_preview_url')}
              />
              <FieldError errors={[errors.social_preview_url]} />
            </Field>
          </CardContent>
        </Card>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-xs text-muted-foreground'>
            {lastUpdatedLabel ? (
              <>Last updated {lastUpdatedLabel}</>
            ) : (
              'Fill out these details to publish your company profile.'
            )}
          </div>
          <Button type='submit' disabled={isSubmitting || !isDirty}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  )
}

type InfoTooltipProps = {
  label: string
  content: string
}

function InfoTooltip({ label, content }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type='button'
          aria-label={label}
          className='text-primary/80 hover:text-primary  p-1 transition-colors'>
          <Info className='size-4' aria-hidden='true' />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side='top'
        align='start'
        className='max-w-xs border border-primary/50  text-primary-foreground text-xs font-medium shadow-lg'>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

const textareaClassName =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-sm rounded-md border bg-transparent px-3 py-2 shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50'
