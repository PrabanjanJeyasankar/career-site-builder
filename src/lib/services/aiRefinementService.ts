// aiRefinementService.ts

import type {
  ColorExtractionResult,
  CompanyInfo,
  LLMProvider,
  OllamaAIRefinementConfig,
  OpenAIRefinementConfig,
  PipelineLog,
  RawMetadata,
} from '@/lib/services/types'

import {
  buildHeuristicProfile,
  ensureCompleteProfile,
} from '@/lib/utils/metadataUtils'

export interface IAIRefinementService {
  refine(
    rawMetadata: RawMetadata,
    colors: ColorExtractionResult,
    bestImageUrl: string | null,
    url: string
  ): Promise<CompanyInfo>
}

export function normalizeLLMProvider(value?: string | null): LLMProvider {
  const normalized = value?.toLowerCase().trim()
  return normalized === 'ollama' ? 'ollama' : 'openai'
}

function buildProfilePrompt(
  rawMetadata: RawMetadata,
  colors: ColorExtractionResult,
  bestImageUrl: string | null,
  url: string
): string {
  return `You are a professional branding and design assistant helping to create career site content.

TASK: Analyze the provided company metadata and generate a structured JSON profile for their careers page.

IMPORTANT: This is a legitimate business tool for creating career sites. Your job is to extract and enhance text content only.

Required JSON format (respond ONLY with valid JSON, no other text):
{
  "company_name": "string (REQUIRED - Extract from title/og:title/name. Examples: 'Reddit', 'Airbnb', 'Stripe')",
  "tagline": "string (required, short catchy phrase, max 80 chars)",
  "description": "string (required, 2-3 sentences about company, max 1000 chars)",
  "hero_title": "string (required, 4-140 chars, e.g. 'Careers at [Company]')",
  "hero_subtitle": "string (required, 4-180 chars, engaging subtitle)",
  "hero_description": "string (required, 20-500 chars, why join this company)",
  "cta_label": "string (required, 2-40 chars, e.g. 'View Open Positions' or 'Explore Careers')"
}

CRITICAL INSTRUCTIONS:
1. ALL 7 fields MUST be present in your response
2. company_name is MANDATORY - extract it from: metadata.title, metadata['og:title'], metadata.name, or the URL domain
3. If you see "Reddit" in title or URL, company_name should be "Reddit" - NEVER leave it empty!
4. Create a professional tagline (one catchy sentence, max 80 chars)
5. Write description (2-3 sentences about what the company does)
6. Set hero_title to "Careers at [CompanyName]" using the extracted company name
7. Create engaging hero_subtitle that attracts talent (focus on culture/mission)
8. Write compelling hero_description explaining why someone should join (20-500 chars)
9. Set cta_label to action-oriented text like "View Open Positions", "Explore Careers", "Join Our Team"

Company URL: ${url}

Metadata to analyze:
${JSON.stringify(rawMetadata, null, 2)}

EXAMPLE OUTPUT for reddit.com:
{
  "company_name": "Reddit",
  "tagline": "The front page of the internet",
  "description": "Reddit is a network of communities where people can find their interests and connect with others.",
  "hero_title": "Careers at Reddit",
  "hero_subtitle": "Join a community-driven company making an impact",
  "hero_description": "Build products that millions of people use every day to connect, share, and discover.",
  "cta_label": "View Open Positions"
}

Remember: company_name MUST have a value! Respond with ONLY the complete JSON object with all 7 fields. No explanations, no markdown, just pure JSON.`
}

function parseCompanyInfoFromText(
  text?: string | null,
  colors?: ColorExtractionResult,
  bestImageUrl?: string | null
): CompanyInfo | null {
  if (!text) return null

  try {
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}')

    if (jsonStart === -1 || jsonEnd === -1) {
      console.warn('aiRefinement: response missing JSON braces')
      return null
    }

    const sliced = text.slice(jsonStart, jsonEnd + 1)
    const parsed = JSON.parse(sliced) as Partial<CompanyInfo>

    console.log('\n🔍 AI Response Parsed Fields:')
    console.log('- company_name:', parsed.company_name ? '✅' : '❌ MISSING')
    console.log('- tagline:', parsed.tagline ? '✅' : '❌ MISSING')
    console.log('- description:', parsed.description ? '✅' : '❌ MISSING')
    console.log('- hero_title:', parsed.hero_title ? '✅' : '❌ MISSING')
    console.log('- hero_subtitle:', parsed.hero_subtitle ? '✅' : '❌ MISSING')
    console.log(
      '- hero_description:',
      parsed.hero_description ? '✅' : '❌ MISSING'
    )
    console.log('- cta_label:', parsed.cta_label ? '✅' : '❌ MISSING')
    console.log('')

    // Fix: Ensure company_name is never empty string
    if (!parsed.company_name || parsed.company_name.trim() === '') {
      console.warn(
        '⚠️  AI returned empty company_name, using fallback from hero_title or metadata'
      )
      // Try to extract from hero_title like "Careers at Reddit" -> "Reddit"
      if (parsed.hero_title) {
        const match = parsed.hero_title.match(/Careers at (.+)/i)
        if (match && match[1]) {
          parsed.company_name = match[1].trim()
          console.log(
            '✅ Extracted company_name from hero_title:',
            parsed.company_name
          )
        }
      }
    }

    // Add colors and URLs from scraping (not from LLM)
    const enrichedData: Partial<CompanyInfo> = {
      ...parsed,
      primary_color: colors?.primary || '#5038EE',
      secondary_color: colors?.secondary || '#F5F5F5',
      favicon_url: '',
      logo_url: bestImageUrl || '',
      social_preview_url: bestImageUrl || '',
      hero_background_url: bestImageUrl || '',
    }

    console.log('🎨 Added scraped data (colors & URLs):')
    console.log('- primary_color:', enrichedData.primary_color)
    console.log('- secondary_color:', enrichedData.secondary_color)
    console.log('- logo_url:', enrichedData.logo_url ? '✅' : '(empty)')
    console.log(
      '- social_preview_url:',
      enrichedData.social_preview_url ? '✅' : '(empty)'
    )
    console.log(
      '- hero_background_url:',
      enrichedData.hero_background_url ? '✅' : '(empty)'
    )
    console.log('')

    return ensureCompleteProfile(enrichedData)
  } catch (error) {
    console.warn('aiRefinement: failed to parse response', error)
    return null
  }
}

function buildPreview(value: string, max = 500): string {
  return value.length > max ? `${value.slice(0, max)}...` : value
}

export class OpenAIRefinementService implements IAIRefinementService {
  private readonly apiKey: string
  private readonly model: string

  constructor(
    private readonly config: OpenAIRefinementConfig,
    private readonly logs: PipelineLog[]
  ) {
    this.apiKey = this.config.apiKey
    this.model = this.config.model ?? 'gpt-3.5-turbo'
  }

  async refine(
    rawMetadata: RawMetadata,
    colors: ColorExtractionResult,
    bestImageUrl: string | null,
    url: string
  ): Promise<CompanyInfo> {
    const prompt = buildProfilePrompt(rawMetadata, colors, bestImageUrl, url)

    try {
      console.log('\n========================================')
      console.log('🤖 AI REFINEMENT SERVICE: OpenAI')
      console.log('========================================')
      console.log('Model:', this.model)
      console.log('API Endpoint: https://api.openai.com/v1/chat/completions')
      console.log('Prompt length:', prompt.length, 'characters')
      console.log('Has best image:', Boolean(bestImageUrl))
      console.log('========================================\n')

      this.logs.push({
        step: 'openai:request',
        info: 'Sending prompt to OpenAI',
        meta: {
          promptChars: prompt.length,
          hasBestImage: Boolean(bestImageUrl),
          model: this.model,
          promptPreview: buildPreview(prompt),
        },
      })

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1000,
          }),
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.warn('aiRefinement: OpenAI request failed; using heuristic', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
        this.logs.push({
          step: 'openai:error',
          info: 'OpenAI request failed; using heuristic',
          meta: { status: response.status, statusText: response.statusText },
        })
        return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }

      const output = data?.choices?.[0]?.message?.content

      console.log('\n========================================')
      console.log('✅ OpenAI RAW RESPONSE')
      console.log('========================================')
      console.log('Full API Response:')
      console.log(JSON.stringify(data, null, 2))
      console.log('\n--- Extracted Content ---')
      console.log(output)
      console.log('========================================\n')

      this.logs.push({
        step: 'openai:response',
        info: 'OpenAI response received',
        meta: {
          hasOutput: Boolean(output),
          responsePreview: buildPreview(output ?? ''),
        },
      })

      const parsed = parseCompanyInfoFromText(output, colors, bestImageUrl)
      if (parsed) {
        console.log('aiRefinement: OpenAI parsed successfully')
        this.logs.push({
          step: 'openai:parse',
          info: 'OpenAI parsed successfully',
        })
        return parsed
      }

      console.warn('aiRefinement: OpenAI parse failed; using heuristic')
      this.logs.push({
        step: 'openai:parse',
        info: 'OpenAI parse failed; using heuristic',
      })
      return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
    } catch (error) {
      console.warn('aiRefinement: OpenAI error; using heuristic', error)
      this.logs.push({
        step: 'openai:error',
        info: 'OpenAI error; using heuristic',
      })
      return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
    }
  }
}

export class OllamaAIRefinementService implements IAIRefinementService {
  private readonly baseUrl: string
  private readonly model: string

  constructor(
    config: OllamaAIRefinementConfig,
    private readonly logs: PipelineLog[]
  ) {
    const rawBaseUrl = config.baseUrl?.replace(/\/$/, '')
    this.baseUrl = rawBaseUrl ?? 'http://localhost:11434'
    this.model = config.model ?? 'llama3.1'
  }

  async refine(
    rawMetadata: RawMetadata,
    colors: ColorExtractionResult,
    bestImageUrl: string | null,
    url: string
  ): Promise<CompanyInfo> {
    const prompt = buildProfilePrompt(rawMetadata, colors, bestImageUrl, url)

    try {
      console.log('\n========================================')
      console.log('🦙 AI REFINEMENT SERVICE: Ollama')
      console.log('========================================')
      console.log('Model:', this.model)
      console.log('Base URL:', this.baseUrl)
      console.log('API Endpoint:', `${this.baseUrl}/api/generate`)
      console.log('Prompt length:', prompt.length, 'characters')
      console.log('Has best image:', Boolean(bestImageUrl))
      console.log('========================================\n')

      this.logs.push({
        step: 'ollama:request',
        info: 'Sending prompt to Ollama',
        meta: {
          promptChars: prompt.length,
          hasBestImage: Boolean(bestImageUrl),
          model: this.model,
          baseUrl: this.baseUrl,
          promptPreview: buildPreview(prompt),
        },
      })

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        }),
        cache: 'no-store',
      })

      if (!response.ok) {
        console.warn('aiRefinement: Ollama request failed; using heuristic', {
          status: response.status,
          statusText: response.statusText,
        })
        this.logs.push({
          step: 'ollama:response',
          info: 'Ollama request failed; using heuristic',
          meta: { status: response.status, statusText: response.statusText },
        })
        return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
      }

      const data = (await response.json()) as { response?: string }

      console.log('\n========================================')
      console.log('✅ Ollama RAW RESPONSE')
      console.log('========================================')
      console.log('Full API Response:')
      console.log(JSON.stringify(data, null, 2))
      console.log('\n--- Extracted Content ---')
      console.log(data?.response)
      console.log('========================================\n')

      this.logs.push({
        step: 'ollama:response',
        info: 'Ollama response received',
        meta: {
          hasText: Boolean(data?.response),
          responsePreview: buildPreview(data?.response ?? ''),
        },
      })

      const parsed = parseCompanyInfoFromText(
        data?.response,
        colors,
        bestImageUrl
      )
      if (parsed) {
        console.log('aiRefinement: Ollama parsed successfully')
        this.logs.push({
          step: 'ollama:parse',
          info: 'Ollama parsed successfully',
        })
        return parsed
      }

      console.warn('aiRefinement: Ollama parse failed; using heuristic')
      this.logs.push({
        step: 'ollama:parse',
        info: 'Ollama parse failed; using heuristic',
      })
      return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
    } catch (error) {
      console.warn('aiRefinement: Ollama error; using heuristic', error)
      this.logs.push({
        step: 'ollama:error',
        info: 'Ollama error; using heuristic',
      })
      return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
    }
  }
}
