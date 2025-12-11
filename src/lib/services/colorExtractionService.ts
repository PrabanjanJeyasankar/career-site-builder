// colorExtractionService.ts

import type {
  ColorExtractionResult,
  ColorExtractorConfig,
  PipelineLog,
} from '@/lib/services/types'

import { normalizeHex, sortColorsByBrightness } from '@/lib/utils/colorUtils'

export interface IColorExtractionService {
  extract(imageUrl: string | null): Promise<ColorExtractionResult>
}

export class ImaggaColorExtractionService implements IColorExtractionService {
  private readonly defaultColors: ColorExtractionResult = {
    primary: '#5038EE',
    secondary: '#F5F5F5',
  }

  constructor(
    private readonly config: ColorExtractorConfig,
    private readonly logs: PipelineLog[]
  ) {}

  async extract(imageUrl: string | null): Promise<ColorExtractionResult> {
    if (!imageUrl) {
      console.log('colorExtractor: skipping (no image)')
      this.logs.push({
        step: 'colors:skip',
        info: 'No image available for color extraction; using defaults',
        meta: { imageUrl: null },
      })
      return this.defaultColors
    }

    const auth = Buffer.from(
      `${this.config.apiKey}:${this.config.apiSecret}`
    ).toString('base64')

    console.log('colorExtractor: requesting colors')
    this.logs.push({
      step: 'colors:request',
      info: 'Requesting Imagga colors',
      meta: { imageUrl },
    })

    try {
      const response = await fetch(
        `https://api.imagga.com/v2/colors?image_url=${encodeURIComponent(
          imageUrl
        )}`,
        {
          headers: { Authorization: `Basic ${auth}` },
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        console.warn('colorExtractor: request failed; using defaults')
        this.logs.push({
          step: 'colors:response',
          info: 'Imagga request failed; using defaults',
          meta: { status: response.status, statusText: response.statusText },
        })
        return this.defaultColors
      }

      const data = (await response.json()) as {
        result?: {
          colors?: {
            image_colors?: Array<{ html_code: string; percentage: number }>
          }
        }
      }

      const colors = data?.result?.colors?.image_colors

      if (!colors || colors.length === 0) {
        console.log('colorExtractor: no colors returned; using defaults')
        this.logs.push({
          step: 'colors:empty',
          info: 'Imagga returned no colors; using defaults',
        })
        return this.defaultColors
      }

      const sorted = [...colors].sort(
        (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)
      )
      const [first, second] = sorted

      console.log('colorExtractor: colors received', {
        count: colors.length,
        top: first?.html_code,
        next: second?.html_code,
      })
      this.logs.push({
        step: 'colors:received',
        info: 'Imagga colors received',
        meta: {
          count: colors.length,
          top: first?.html_code ?? null,
          next: second?.html_code ?? null,
        },
      })

      const color1 =
        normalizeHex(first?.html_code) ?? this.defaultColors.primary
      const color2 =
        normalizeHex(second?.html_code) ??
        normalizeHex(first?.html_code) ??
        this.defaultColors.secondary

      const { darker, lighter } = sortColorsByBrightness(color1, color2)

      return {
        primary: darker,
        secondary: lighter,
      }
    } catch (error) {
      console.error('colorExtractor: error; using defaults', error)
      this.logs.push({
        step: 'colors:error',
        info: 'Color extraction error; using defaults',
      })
      return this.defaultColors
    }
  }
}
