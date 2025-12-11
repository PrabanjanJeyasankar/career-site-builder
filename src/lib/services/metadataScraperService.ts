// metadataScraperService.ts

import type {
  PipelineLog,
  RawMetadata,
  ScraperConfig,
} from '@/lib/services/types'

export interface IMetadataScraperService {
  scrape(url: string): Promise<RawMetadata>
}

export class ApifyMetadataScraperService implements IMetadataScraperService {
  constructor(
    private readonly config: ScraperConfig,
    private readonly logs: PipelineLog[]
  ) {}

  async scrape(url: string): Promise<RawMetadata> {
    console.log('metadataScraper: requesting metadata', { url })
    this.logs.push({
      step: 'metadata:request',
      info: 'Requesting Apify metadata',
      meta: { url },
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout ?? 90000
    )

    try {
      const response = await fetch(
        `https://api.apify.com/v2/acts/codescraper~website-metadata-extractor/run-sync-get-dataset-items?token=${this.config.token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startUrls: [{ url }],
            disableDomainAnalysis: false,
          }),
          cache: 'no-store',
          signal: controller.signal,
        }
      )

      const responseText = await response.text()
      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error('metadataScraper: request failed', {
          status: response.status,
          statusText: response.statusText,
        })
        this.logs.push({
          step: 'metadata:response',
          info: 'Apify request failed',
          meta: {
            status: response.status,
            statusText: response.statusText,
            bodySample: responseText.slice(0, 200),
          },
        })
        throw new Error(`Apify request failed with status ${response.status}`)
      }

      if (!responseText || responseText.trim().length === 0) {
        console.error('metadataScraper: empty response')
        this.logs.push({
          step: 'metadata:empty',
          info: 'Apify returned empty response',
          meta: { url, status: response.status },
        })
        throw new Error(
          'Apify returned empty response. The website may be blocking scrapers or the request timed out.'
        )
      }

      const parsed = this.parseResponse(responseText)

      console.log('metadataScraper: metadata received', {
        itemCount: parsed.length,
        hasMetaTags: Boolean(parsed[0]?.metaTags),
      })
      this.logs.push({
        step: 'metadata:received',
        info: 'Metadata received',
        meta: {
          itemCount: parsed.length,
          hasMetaTags: Boolean(parsed[0]?.metaTags),
        },
      })

      return parsed[0] ?? {}
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('metadataScraper: request timeout')
        this.logs.push({
          step: 'metadata:timeout',
          info: 'Apify request timed out',
          meta: { url },
        })
        throw new Error(
          'Request timed out. The website may be slow to respond or blocking scrapers.'
        )
      }
      throw error
    }
  }

  private parseResponse(responseText: string): RawMetadata[] {
    try {
      const parsed = JSON.parse(responseText) as
        | RawMetadata[]
        | Record<string, unknown>

      if (!Array.isArray(parsed)) {
        const keys = parsed ? Object.keys(parsed) : []
        console.error('metadataScraper: unexpected response shape', {
          parsedType: typeof parsed,
          keys,
        })
        this.logs.push({
          step: 'metadata:shape',
          info: 'Unexpected Apify response shape',
          meta: { parsedType: typeof parsed, keys: keys.join(',') },
        })
        throw new Error('Unexpected Apify response format')
      }

      return parsed
    } catch (error) {
      console.error('metadataScraper: JSON parse error', { error })
      this.logs.push({
        step: 'metadata:parse',
        info: 'Failed to parse Apify JSON',
        meta: { bodySample: responseText.slice(0, 200) },
      })
      throw new Error('Apify returned invalid JSON')
    }
  }
}
