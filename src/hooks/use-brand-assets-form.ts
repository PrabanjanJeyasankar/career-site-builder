// use-brand-assets-form.ts

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  companyProfileFormSchema,
  type CompanyProfileFormValues,
} from '@/lib/validation/companyProfileSchema'

type FormStatus = 'idle' | 'success' | 'error'

type UseBrandAssetsFormOptions = {
  defaultValues: CompanyProfileFormValues
  onSuccess?: (values: CompanyProfileFormValues) => void
  onError?: (error: string) => void
}

export function useBrandAssetsForm({
  defaultValues,
  onSuccess,
  onError,
}: UseBrandAssetsFormOptions) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const form = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileFormSchema),
    defaultValues,
  })

  const handleSuccess = useCallback(
    (values: CompanyProfileFormValues) => {
      setStatus('success')
      setMessage('Brand assets were saved successfully.')
      form.reset(values)
      onSuccess?.(values)
    },
    [form, onSuccess]
  )

  const handleError = useCallback(
    (error: string) => {
      setStatus('error')
      setMessage(error)
      onError?.(error)
    },
    [onError]
  )

  const resetStatus = useCallback(() => {
    setStatus('idle')
    setMessage('')
  }, [])

  return {
    form,
    status,
    message,
    handleSuccess,
    handleError,
    resetStatus,
  }
}
