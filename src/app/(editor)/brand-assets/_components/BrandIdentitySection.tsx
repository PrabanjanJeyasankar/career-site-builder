// BrandIdentitySection.tsx

import { Brush, Info } from 'lucide-react'
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

const TEXTAREA_CLASSNAME =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-sm rounded-md border bg-transparent px-3 py-2 shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50'

type BrandIdentitySectionProps = {
  register: UseFormRegister<CompanyProfileFormValues>
  errors: FieldErrors<CompanyProfileFormValues>
  children?: React.ReactNode
}

export function BrandIdentitySection({
  register,
  errors,
  children,
}: BrandIdentitySectionProps) {
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
          <Field>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='logo_url'>Logo URL</FieldLabel>
              <InfoTooltip content='Prefer a transparent PNG or SVG stored in your CDN.' />
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
              <InfoTooltip content='Used for the browser tab icon and social previews.' />
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
