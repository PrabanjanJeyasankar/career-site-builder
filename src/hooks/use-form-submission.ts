// use-form-submission.ts

import { useCallback } from 'react'

import { saveCompanyProfile } from '@/lib/actions/companyProfile'
import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

type UseFormSubmissionOptions = {
  onSuccess: (values: CompanyProfileFormValues) => void
  onError: (error: string) => void
  resetStatus: () => void
}

export function useFormSubmission({
  onSuccess,
  onError,
  resetStatus,
}: UseFormSubmissionOptions) {
  const submitForm = useCallback(
    async (values: CompanyProfileFormValues) => {
      resetStatus()

      const result = await saveCompanyProfile(values)

      if (result?.error) {
        onError(result.error)
        return { success: false }
      }

      onSuccess(values)
      return { success: true }
    },
    [resetStatus, onSuccess, onError]
  )

  return { submitForm }
}
