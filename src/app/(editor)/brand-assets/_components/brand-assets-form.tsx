// brand-assets-form.tsx
'use client'

import { useCallback } from 'react'
import { useWatch } from 'react-hook-form'

import { saveCompanyProfile } from '@/lib/actions/companyProfile'
import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'

import { useAIBrandGenerator } from '@/hooks/use-ai-brand-generator'
import { useBrandAssetsForm } from '@/hooks/use-brand-assets-form'
import { useColorPicker } from '@/hooks/use-color-picker'
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
          const nav = unsavedChanges.pendingNavigation.current
          unsavedChanges.pendingNavigation.current = undefined
          nav()
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

  const primaryColorPicker = useColorPicker({
    onChange: (color) => {
      setValue('primary_color', color, { shouldDirty: true, shouldTouch: true })
      secondaryColorPicker.close()
    },
  })

  const secondaryColorPicker = useColorPicker({
    onChange: (color) => {
      setValue('secondary_color', color, {
        shouldDirty: true,
        shouldTouch: true,
      })
      primaryColorPicker.close()
    },
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

  const onSubmit = useCallback(
    async (values: CompanyProfileFormValues) => {
      resetStatus()

      const result = await saveCompanyProfile(values)
      if (result?.error) {
        handleError(result.error)
        return
      }

      handleSuccess(values)
    },
    [resetStatus, handleSuccess, handleError]
  )

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
          handleSubmit(onSubmit)(event)
        }}
        className='space-y-8'>
        <FormStatusBanner status={status} message={message} />

        <BrandIdentitySection
          register={register}
          control={control}
          errors={errors}>
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
              isPickerOpen={primaryColorPicker.isOpen}
              pickerRef={primaryColorPicker.pickerRef}
              error={errors.primary_color}
              onTogglePicker={() => {
                primaryColorPicker.toggle()
                secondaryColorPicker.close()
              }}
              onColorChange={primaryColorPicker.handleColorChange}
              onInputChange={(e) => {
                primaryColorOnChange(e)
                primaryColorPicker.close()
              }}
              inputProps={{ ...primaryColorField, ref: primaryColorRef }}
            />

            <ColorPickerField
              id='secondary_color'
              label='Secondary color'
              tooltipContent='Backgrounds for cards and subtle UI.'
              color={secondaryColor}
              isPickerOpen={secondaryColorPicker.isOpen}
              pickerRef={secondaryColorPicker.pickerRef}
              error={errors.secondary_color}
              onTogglePicker={() => {
                secondaryColorPicker.toggle()
                primaryColorPicker.close()
              }}
              onColorChange={secondaryColorPicker.handleColorChange}
              onInputChange={(e) => {
                secondaryColorOnChange(e)
                secondaryColorPicker.close()
              }}
              inputProps={{ ...secondaryColorField, ref: secondaryColorRef }}
            />
          </div>
        </BrandIdentitySection>

        <HeroContentSection
          register={register}
          control={control}
          errors={errors}
        />

        <SocialSEOSection control={control} errors={errors} />

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
        onSave={() => handleSubmit(onSubmit)()}
        onCancel={unsavedChanges.cancelNavigation}
      />
    </TooltipProvider>
  )
}
