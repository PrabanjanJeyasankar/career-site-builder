// SocialSEOSection.tsx

import { Image as ImageIcon, Info, Share2, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { Control, FieldErrors } from 'react-hook-form'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

type SocialSEOSectionProps = {
  control: Control<CompanyProfileFormValues>
  errors: FieldErrors<CompanyProfileFormValues>
}

export function SocialSEOSection({ control, errors }: SocialSEOSectionProps) {
  const [socialImageDialogOpen, setSocialImageDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Share2 className='size-5 text-primary' />
          <span>Social & SEO</span>
        </CardTitle>
        <CardDescription>
          Provide an image optimized for Slack, LinkedIn, and iMessage previews.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <Controller
          name='social_preview_url'
          control={control}
          render={({ field }) => (
            <Field>
              <div className='flex items-center gap-2'>
                <FieldLabel htmlFor='social_preview_url'>
                  Social preview image
                </FieldLabel>
                <InfoTooltip content='Recommended 1200 x 630 px JPG/PNG used for Open Graph tags.' />
              </div>
              {field.value ? (
                <div className='group relative flex items-center gap-3 rounded-md border bg-card p-3'>
                  <div className='relative h-12 w-20 overflow-hidden rounded bg-muted'>
                    <Image
                      src={field.value}
                      alt='Social preview'
                      fill
                      className='object-cover'
                      unoptimized
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>
                      Social preview uploaded
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
                  onClick={() => setSocialImageDialogOpen(true)}>
                  <ImageIcon className='mr-2 h-4 w-4' />
                  Upload social preview
                </Button>
              )}
              <FieldError errors={[errors.social_preview_url]} />
              <ImageUploadDialog
                open={socialImageDialogOpen}
                onOpenChange={setSocialImageDialogOpen}
                onUpload={field.onChange}
                existingUrl={field.value}
                title='Upload social preview image'
                description='Select an image for social media and messaging previews'
                allowedFormats={['image/jpeg', 'image/png', 'image/webp']}
              />
            </Field>
          )}
        />
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
