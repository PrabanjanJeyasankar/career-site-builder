// use-ai-brand-generator.ts

import { useCallback, useState, useTransition } from 'react'

import { fetchCompanyProfileFromUrl } from '@/lib/actions/aiProfile'
import { saveCompanyProfile } from '@/lib/actions/companyProfile'
import type { CompanyProfileFormValues } from '@/lib/validation/companyProfileSchema'

type UseAIBrandGeneratorOptions = {
  onSuccess?: (data: CompanyProfileFormValues) => void
  onError?: (error: string) => void
}

export type GenerationStep =
  | 'idle'
  | 'scraping'
  | 'extracting-colors'
  | 'generating-content'
  | 'saving'
  | 'complete'

export function useAIBrandGenerator({
  onSuccess,
  onError,
}: UseAIBrandGeneratorOptions = {}) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState<GenerationStep>('idle')

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
      setCurrentStep('scraping')

      // Add delay to ensure UI updates
      await new Promise((resolve) => setTimeout(resolve, 100))

      const result = await fetchCompanyProfileFromUrl(url.trim())

      if (result.logs?.length) {
        console.log('AI pipeline logs', result.logs)
      }

      // Set to extracting colors (this happens during the scraping phase)
      setCurrentStep('extracting-colors')
      await new Promise((resolve) => setTimeout(resolve, 100))

      if (!result.success || !result.data) {
        const errorMessage = result.error || 'Unable to fetch company info.'
        setError(errorMessage)
        setCurrentStep('idle')
        onError?.(errorMessage)
        return
      }

      // Set to generating content
      setCurrentStep('generating-content')
      await new Promise((resolve) => setTimeout(resolve, 100))

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

      console.log('🎨 AI Generated Data (before save):', mappedData)

      setCurrentStep('saving')
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Automatically save to database
      const saveResult = await saveCompanyProfile(mappedData)

      if (saveResult.error) {
        console.error(
          '❌ Failed to auto-save AI generated data:',
          saveResult.error
        )
        setError(saveResult.error)
        setCurrentStep('idle')
        onError?.(saveResult.error)
        return
      }

      console.log('✅ AI generated data saved to database successfully')
      setCurrentStep('complete')

      setTimeout(() => {
        setCurrentStep('idle')
      }, 3000)

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
    currentStep,
    updateUrl,
    generate,
  }
}
