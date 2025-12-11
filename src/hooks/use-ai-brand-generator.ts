// use-ai-brand-generator.ts

import { useCallback, useState, useTransition } from 'react'

import { fetchCompanyProfileFromUrl } from '@/lib/actions/aiProfile'
import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

type UseAIBrandGeneratorOptions = {
  onSuccess?: (data: CompanyProfileFormValues) => void
  onError?: (error: string) => void
}

export function useAIBrandGenerator({
  onSuccess,
  onError,
}: UseAIBrandGeneratorOptions = {}) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const validateUrl = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setError('Please enter a valid URL.')
      return false
    }
    setError(null)
    return true
  }, [])

  const generate = useCallback(() => {
    if (!validateUrl(url)) return

    startTransition(async () => {
      setError(null)

      const result = await fetchCompanyProfileFromUrl(url.trim())

      if (result.logs?.length) {
        console.log('AI pipeline logs', result.logs)
      }

      if (!result.success || !result.data) {
        const errorMessage = result.error || 'Unable to fetch company info.'
        setError(errorMessage)
        onError?.(errorMessage)
        return
      }

      const mappedData: CompanyProfileFormValues = {
        company_name: result.data.company_name,
        tagline: result.data.tagline,
        description: result.data.description,
        favicon_url: result.data.favicon_url,
        logo_url: result.data.logo_url,
        social_preview_url: result.data.social_preview_url,
        primary_color: result.data.primary_color,
        secondary_color: result.data.secondary_color,
        hero_title: result.data.hero_title,
        hero_subtitle: result.data.hero_subtitle,
        hero_description: result.data.hero_description,
        hero_cta_label: result.data.cta_label,
        hero_background_url: result.data.hero_background_url,
      }

      onSuccess?.(mappedData)
    })
  }, [url, validateUrl, onSuccess, onError])

  const updateUrl = useCallback((value: string) => {
    setUrl(value)
    setError(null)
  }, [])

  return {
    url,
    error,
    isPending,
    updateUrl,
    generate,
  }
}
