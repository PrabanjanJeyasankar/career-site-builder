// aiProfile.ts
'use server'

import type { CompanyInfo, PipelineLog } from '@/lib/services/types'

import {
  OllamaAIRefinementService,
  OpenAIRefinementService,
  normalizeLLMProvider,
} from '@/lib/services/aiRefinementService'
import { ImaggaColorExtractionService } from '@/lib/services/colorExtractionService'
import { PuppeteerMetadataScraperService } from '@/lib/services/metadataScraperService'
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

    const scraperService = new PuppeteerMetadataScraperService(
      { timeout: 90000 },
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
    const requestedLLM = process.env.LLM ?? 'openai'
    const llmProvider = normalizeLLMProvider(requestedLLM)

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

    console.log('aiProfile: LLM provider selected', {
      requested: requestedLLM,
      provider: llmProvider,
    })
    logs.push({
      step: 'llm:provider',
      info: `Using ${llmProvider} provider`,
      meta: { requested: requestedLLM },
    })

    const openaiApiKey = process.env.OPENAI_API_KEY
    const openaiModel = process.env.OPENAI_MODEL
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL
    const ollamaModel = process.env.OLLAMA_MODEL

    let companyInfo: CompanyInfo

    if (llmProvider === 'ollama') {
      const aiService = new OllamaAIRefinementService(
        { baseUrl: ollamaBaseUrl, model: ollamaModel },
        logs
      )
      companyInfo = await aiService.refine(
        rawMetadata,
        colors,
        bestImageUrl,
        url
      )
    } else if (openaiApiKey) {
      const aiService = new OpenAIRefinementService(
        { apiKey: openaiApiKey, model: openaiModel },
        logs
      )
      companyInfo = await aiService.refine(
        rawMetadata,
        colors,
        bestImageUrl,
        url
      )
    } else {
      console.warn('aiProfile: missing OpenAI API key; using heuristic profile')
      logs.push({
        step: 'openai:skip',
        info: 'Missing OPENAI_API_KEY; using heuristic',
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
