// BrandIdentitySection.tsx

import { Brush, Image as ImageIcon, Info, X } from 'lucide-react'
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

type BrandIdentitySectionProps = {
  register: UseFormRegister<CompanyProfileFormValues>
  control: Control<CompanyProfileFormValues>
  errors: FieldErrors<CompanyProfileFormValues>
  children?: React.ReactNode
}

export function BrandIdentitySection({
  register,
  control,
  errors,
  children,
}: BrandIdentitySectionProps) {
  const [logoDialogOpen, setLogoDialogOpen] = useState(false)
  const [faviconDialogOpen, setFaviconDialogOpen] = useState(false)

  return (
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
        {children}

        <div className='grid gap-6 md:grid-cols-2'>
          <Field>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='company_name'>Company name</FieldLabel>
              <InfoTooltip content='Appears anywhere the company name is referenced.' />
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
              <InfoTooltip content='A short line that describes your mission in one sentence.' />
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
            <FieldLabel htmlFor='description'>Company description</FieldLabel>
            <InfoTooltip content='Used for metadata and the About section of the profile.' />
          </div>
          <textarea
            id='description'
            rows={4}
            placeholder='Share what makes your team unique...'
            className={TEXTAREA_CLASSNAME}
            {...register('description')}
          />
          <FieldError errors={[errors.description]} />
        </Field>

        <div className='grid gap-6 md:grid-cols-2'>
          <Controller
            name='logo_url'
            control={control}
            render={({ field }) => (
              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='logo_url'>Logo</FieldLabel>
                  <InfoTooltip content='Prefer a transparent PNG or SVG for best results.' />
                </div>
                {field.value ? (
                  <div className='group relative flex items-center gap-3 rounded-md border bg-card p-3'>
                    <div className='relative h-12 w-12 overflow-hidden rounded bg-muted'>
                      <Image
                        src={field.value}
                        alt='Logo'
                        fill
                        className='object-contain'
                        unoptimized
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        Logo uploaded
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
                    onClick={() => setLogoDialogOpen(true)}>
                    <ImageIcon className='mr-2 h-4 w-4' />
                    Upload logo
                  </Button>
                )}
                <FieldError errors={[errors.logo_url]} />
                <ImageUploadDialog
                  open={logoDialogOpen}
                  onOpenChange={setLogoDialogOpen}
                  onUpload={field.onChange}
                  existingUrl={field.value}
                  title='Upload company logo'
                  description='Select a logo file from your computer'
                  allowedFormats={['image/png', 'image/svg+xml', 'image/webp']}
                />
              </Field>
            )}
          />

          <Controller
            name='favicon_url'
            control={control}
            render={({ field }) => (
              <Field>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='favicon_url'>Favicon</FieldLabel>
                  <InfoTooltip content='Used for the browser tab icon and social previews.' />
                </div>
                {field.value ? (
                  <div className='group relative flex items-center gap-3 rounded-md border bg-card p-3'>
                    <div className='relative h-12 w-12 overflow-hidden rounded bg-muted'>
                      <Image
                        src={field.value}
                        alt='Favicon'
                        fill
                        className='object-contain'
                        unoptimized
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        Favicon uploaded
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
                    onClick={() => setFaviconDialogOpen(true)}>
                    <ImageIcon className='mr-2 h-4 w-4' />
                    Upload favicon
                  </Button>
                )}
                <FieldError errors={[errors.favicon_url]} />
                <ImageUploadDialog
                  open={faviconDialogOpen}
                  onOpenChange={setFaviconDialogOpen}
                  onUpload={field.onChange}
                  existingUrl={field.value}
                  title='Upload favicon'
                  description='Select a favicon file from your computer'
                  allowedFormats={['image/png', 'image/x-icon']}
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
