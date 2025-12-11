// aiProfile.ts
'use server'

import type { CompanyInfo, PipelineLog } from '@/lib/services/types'

import { GeminiAIRefinementService } from '@/lib/services/aiRefinementService'
import { ImaggaColorExtractionService } from '@/lib/services/colorExtractionService'
import { ApifyMetadataScraperService } from '@/lib/services/metadataScraperService'
import { selectBestImage } from '@/lib/utils/metadataUtils'

export async function fetchCompanyProfileFromUrl(url: string): Promise<{
  success: boolean
  data?: CompanyInfo
  error?: string
  logs: PipelineLog[]
}> {
  const logs: PipelineLog[] = []

  if (!url || !/^https?:\/\//i.test(url)) {
    logs.push({ step: 'validate', info: 'Invalid URL', meta: { url } })
    return { success: false, error: 'Please enter a valid URL.', logs }
  }

  try {
    logs.push({ step: 'start', info: 'Pipeline started', meta: { url } })
    console.log('aiProfile: pipeline started', { url })

    const apifyToken = process.env.APIFY_TOKEN
    if (!apifyToken) {
      throw new Error('Missing APIFY_TOKEN environment variable')
    }

    const scraperService = new ApifyMetadataScraperService(
      { token: apifyToken, timeout: 90000 },
      logs
    )

    const rawMetadata = await scraperService.scrape(url)
    console.log('aiProfile: metadata scraped', {
      hasMetaTags: Boolean(rawMetadata.metaTags),
      jsonLdCount: Array.isArray(rawMetadata.jsonLd)
        ? rawMetadata.jsonLd.length
        : 0,
    })

    const bestImageUrl = selectBestImage(rawMetadata)
    console.log('aiProfile: best image selected', { bestImageUrl })
    logs.push({
      step: 'image:select',
      info: 'Selected best image',
      meta: { selected: bestImageUrl ?? null },
    })

    const imaggaApiKey = process.env.IMAGGA_API_KEY
    const imaggaApiSecret = process.env.IMAGGA_API_SECRET

    let colors = { primary: '#5038EE', secondary: '#F5F5F5' }

    if (imaggaApiKey && imaggaApiSecret) {
      const colorService = new ImaggaColorExtractionService(
        { apiKey: imaggaApiKey, apiSecret: imaggaApiSecret },
        logs
      )
      colors = await colorService.extract(bestImageUrl)
      console.log('aiProfile: colors extracted', colors)
    } else {
      console.warn(
        'aiProfile: missing Imagga credentials; using default colors'
      )
      logs.push({
        step: 'colors:skip',
        info: 'Missing Imagga credentials; using defaults',
      })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY

    let companyInfo: CompanyInfo

    if (geminiApiKey) {
      const aiService = new GeminiAIRefinementService(
        { apiKey: geminiApiKey },
        logs
      )
      companyInfo = await aiService.refine(
        rawMetadata,
        colors,
        bestImageUrl,
        url
      )
    } else {
      console.warn('aiProfile: missing Gemini API key; using heuristic profile')
      logs.push({
        step: 'gemini:skip',
        info: 'Missing GEMINI_API_KEY; using heuristic',
      })
      const { buildHeuristicProfile } = await import(
        '@/lib/utils/metadataUtils'
      )
      companyInfo = buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
    }

    logs.push({ step: 'complete', info: 'Pipeline finished', meta: { url } })
    console.log('aiProfile: pipeline complete')

    return { success: true, data: companyInfo, logs }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to generate brand assets. Please try again.'
    logs.push({ step: 'error', info: message })
    console.error('aiProfile: pipeline failed', error)
    return {
      success: false,
      error: message,
      logs,
    }
  }
}
