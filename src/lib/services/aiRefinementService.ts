// aiRefinementService.ts

import type {
  AIRefinementConfig,
  ColorExtractionResult,
  CompanyInfo,
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

export class GeminiAIRefinementService implements IAIRefinementService {
  constructor(
    private readonly config: AIRefinementConfig,
    private readonly logs: PipelineLog[]
  ) {}

  async refine(
    rawMetadata: RawMetadata,
    colors: ColorExtractionResult,
    bestImageUrl: string | null,
    url: string
  ): Promise<CompanyInfo> {
    const prompt = this.buildPrompt(rawMetadata, colors, bestImageUrl, url)

    try {
      console.log('aiRefinement: sending prompt to Gemini', {
        promptChars: prompt.length,
        hasBestImage: Boolean(bestImageUrl),
      })
      this.logs.push({
        step: 'gemini:request',
        info: 'Sending prompt to Gemini',
        meta: {
          promptChars: prompt.length,
          hasBestImage: Boolean(bestImageUrl),
        },
      })

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        console.warn('aiRefinement: request failed; using heuristic')
        this.logs.push({
          step: 'gemini:response',
          info: 'Gemini request failed; using heuristic',
          meta: { status: response.status, statusText: response.statusText },
        })
        return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
      }

      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
      }
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

      console.log('aiRefinement: response received', {
        hasText: Boolean(text),
        candidates: data?.candidates?.length ?? 0,
      })
      this.logs.push({
        step: 'gemini:response',
        info: 'Gemini response received',
        meta: {
          hasText: Boolean(text),
          candidates: data?.candidates?.length ?? 0,
        },
      })

      const parsed = this.parseResponse(text)
      if (parsed) {
        console.log('aiRefinement: parsed successfully')
        this.logs.push({
          step: 'gemini:parse',
          info: 'Gemini parsed successfully',
        })
        return parsed
      }

      console.warn('aiRefinement: parse failed; using heuristic')
      this.logs.push({
        step: 'gemini:parse',
        info: 'Gemini parse failed; using heuristic',
      })
      return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
    } catch (error) {
      console.warn('aiRefinement: error; using heuristic', error)
      this.logs.push({
        step: 'gemini:error',
        info: 'Gemini error; using heuristic',
      })
      return buildHeuristicProfile(rawMetadata, colors, bestImageUrl)
    }
  }

  private buildPrompt(
    rawMetadata: RawMetadata,
    colors: ColorExtractionResult,
    bestImageUrl: string | null,
    url: string
  ): string {
    return `
You are a branding assistant.
You receive scraped metadata, a company URL, a best image URL, and extracted colors. 
Return a JSON object with these keys only:
{
  "company_name": "",
  "tagline": "",
  "description": "",
  "favicon_url": "",
  "logo_url": "",
  "social_preview_url": "",
  "primary_color": "",
  "secondary_color": "",
  "hero_title": "",
  "hero_subtitle": "",
  "hero_description": "",
  "hero_background_url": "",
  "cta_label": ""
}

Rules:
- Keep professional tone; no fictional facts.
- Trim text; no HTML.
- If a value is missing, craft a concise, credible fallback.
- Colors must be valid HEX, use provided primary/secondary.
- Hero background is conceptual (describe an image, not a real URL).

Input URL: ${url}
Best image: ${bestImageUrl ?? 'none'}
Colors: primary=${colors.primary}, secondary=${colors.secondary}
Raw metadata (JSON):
${JSON.stringify(rawMetadata, null, 2)}
`
  }

  private parseResponse(text?: string | null): CompanyInfo | null {
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
      return ensureCompleteProfile(parsed)
    } catch (error) {
      console.warn('aiRefinement: failed to parse response', error)
      return null
    }
  }
}
