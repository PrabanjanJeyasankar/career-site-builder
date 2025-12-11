// SocialSEOSection.tsx

import { Info, Share2 } from 'lucide-react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

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

type SocialSEOSectionProps = {
  register: UseFormRegister<CompanyProfileFormValues>
  errors: FieldErrors<CompanyProfileFormValues>
}

export function SocialSEOSection({ register, errors }: SocialSEOSectionProps) {
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
        <Field>
          <div className='flex items-center gap-2'>
            <FieldLabel htmlFor='social_preview_url'>
              Social preview image
            </FieldLabel>
            <InfoTooltip content='Recommended 1200 x 630 px JPG/PNG used for Open Graph tags.' />
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
