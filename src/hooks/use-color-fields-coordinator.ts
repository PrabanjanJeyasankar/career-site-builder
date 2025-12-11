// use-color-fields-coordinator.ts

import { useCallback } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

import { useColorPicker } from './use-color-picker'

type UseColorFieldsCoordinatorOptions = {
  setValue: UseFormSetValue<CompanyProfileFormValues>
}

export function useColorFieldsCoordinator({
  setValue,
}: UseColorFieldsCoordinatorOptions) {
  const primaryColorPicker = useColorPicker({
    onChange: (color) => {
      setValue('primary_color', color, { shouldDirty: true, shouldTouch: true })
    },
  })

  const secondaryColorPicker = useColorPicker({
    onChange: (color) => {
      setValue('secondary_color', color, {
        shouldDirty: true,
        shouldTouch: true,
      })
    },
  })

  const togglePrimaryPicker = useCallback(() => {
    primaryColorPicker.toggle()
    secondaryColorPicker.close()
  }, [primaryColorPicker, secondaryColorPicker])

  const toggleSecondaryPicker = useCallback(() => {
    secondaryColorPicker.toggle()
    primaryColorPicker.close()
  }, [primaryColorPicker, secondaryColorPicker])

  const closePrimaryPicker = useCallback(() => {
    primaryColorPicker.close()
  }, [primaryColorPicker])

  const closeSecondaryPicker = useCallback(() => {
    secondaryColorPicker.close()
  }, [secondaryColorPicker])

  return {
    primary: {
      ...primaryColorPicker,
      toggle: togglePrimaryPicker,
      close: closePrimaryPicker,
    },
    secondary: {
      ...secondaryColorPicker,
      toggle: toggleSecondaryPicker,
      close: closeSecondaryPicker,
    },
  }
}
