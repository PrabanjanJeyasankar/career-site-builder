// BrandAssetsForm.tsx
'use client'

import { useWatch } from 'react-hook-form'

import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'

import { useAIBrandGenerator } from '@/hooks/use-ai-brand-generator'
import { useBrandAssetsForm } from '@/hooks/use-brand-assets-form'
import { useColorFieldsCoordinator } from '@/hooks/use-color-fields-coordinator'
import { useFormSubmission } from '@/hooks/use-form-submission'
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard'

import { AIBrandGenerator } from './AIBrandGenerator'
import { BrandIdentitySection } from './BrandIdentitySection'
import { ColorPickerField } from './ColorPickerField'
import { FormStatusBanner } from './FormStatusBanner'
import { HeroContentSection } from './HeroContentSection'
import { SocialSEOSection } from './SocialSEOSection'
import { UnsavedChangesDialog } from './UnsavedChangesDialog'

type BrandAssetsFormProps = {
  defaultValues: CompanyProfileFormValues
  lastUpdatedLabel?: string
}

export function BrandAssetsForm({
  defaultValues,
  lastUpdatedLabel,
}: BrandAssetsFormProps) {
  const { form, status, message, handleSuccess, handleError, resetStatus } =
    useBrandAssetsForm({
      defaultValues,
      onSuccess: () => {
        unsavedChanges.allowNavigation()
        if (unsavedChanges.pendingNavigation.current) {
          const navigate = unsavedChanges.pendingNavigation.current
          unsavedChanges.pendingNavigation.current = undefined
          navigate()
        }
      },
    })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    setValue,
  } = form

  const primaryColor = useWatch({ control, name: 'primary_color' }) || '#5038ee'
  const secondaryColor =
    useWatch({ control, name: 'secondary_color' }) || '#f5f5f5'

  const colorFields = useColorFieldsCoordinator({ setValue })

  const { submitForm } = useFormSubmission({
    onSuccess: handleSuccess,
    onError: handleError,
    resetStatus,
  })

  const aiBrandGenerator = useAIBrandGenerator({
    onSuccess: (data) => {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof CompanyProfileFormValues, value, {
          shouldDirty: true,
        })
      })
      handleSuccess(data)
      resetStatus()
      setTimeout(() => {
        handleSuccess({
          ...data,
          ...form.getValues(),
        })
      }, 100)
    },
    onError: handleError,
  })

  const unsavedChanges = useUnsavedChangesGuard({ isDirty })

  const {
    ref: primaryColorRef,
    onChange: primaryColorOnChange,
    ...primaryColorField
  } = register('primary_color')

  const {
    ref: secondaryColorRef,
    onChange: secondaryColorOnChange,
    ...secondaryColorField
  } = register('secondary_color')

  return (
    <TooltipProvider delayDuration={150}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit(submitForm)(event)
        }}
        className='space-y-8'>
        <FormStatusBanner status={status} message={message} />

        <BrandIdentitySection register={register} errors={errors}>
          <AIBrandGenerator
            url={aiBrandGenerator.url}
            error={aiBrandGenerator.error}
            isPending={aiBrandGenerator.isPending}
            onUrlChange={aiBrandGenerator.updateUrl}
            onGenerate={aiBrandGenerator.generate}
          />

          <div className='grid gap-6 md:grid-cols-2'>
            <ColorPickerField
              id='primary_color'
              label='Primary color'
              tooltipContent='Buttons and key accents use this color.'
              color={primaryColor}
              isPickerOpen={colorFields.primary.isOpen}
              pickerRef={colorFields.primary.pickerRef}
              error={errors.primary_color}
              onTogglePicker={colorFields.primary.toggle}
              onColorChange={colorFields.primary.handleColorChange}
              onInputChange={(e) => {
                primaryColorOnChange(e)
                colorFields.primary.close()
              }}
              inputProps={{ ...primaryColorField, ref: primaryColorRef }}
            />

            <ColorPickerField
              id='secondary_color'
              label='Secondary color'
              tooltipContent='Backgrounds for cards and subtle UI.'
              color={secondaryColor}
              isPickerOpen={colorFields.secondary.isOpen}
              pickerRef={colorFields.secondary.pickerRef}
              error={errors.secondary_color}
              onTogglePicker={colorFields.secondary.toggle}
              onColorChange={colorFields.secondary.handleColorChange}
              onInputChange={(e) => {
                secondaryColorOnChange(e)
                colorFields.secondary.close()
              }}
              inputProps={{ ...secondaryColorField, ref: secondaryColorRef }}
            />
          </div>
        </BrandIdentitySection>

        <HeroContentSection register={register} errors={errors} />

        <SocialSEOSection register={register} errors={errors} />

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

      <UnsavedChangesDialog
        open={unsavedChanges.showPrompt}
        onOpenChange={unsavedChanges.setShowPrompt}
        onDiscard={unsavedChanges.confirmNavigation}
        onSave={() => handleSubmit(submitForm)()}
        onCancel={unsavedChanges.cancelNavigation}
      />
    </TooltipProvider>
  )
}
