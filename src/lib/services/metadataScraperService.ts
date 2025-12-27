// metadataScraperService.ts

import puppeteer from 'puppeteer'

import type {
  PipelineLog,
  RawMetadata,
  ScraperConfig,
} from '@/lib/services/types'

export interface IMetadataScraperService {
  scrape(url: string): Promise<RawMetadata>
}

export class PuppeteerMetadataScraperService
  implements IMetadataScraperService
{
  constructor(
    private readonly config: ScraperConfig,
    private readonly logs: PipelineLog[]
  ) {}

  async scrape(url: string): Promise<RawMetadata> {
    console.log('metadataScraper: requesting metadata', { url })
    this.logs.push({
      step: 'metadata:request',
      info: 'Launching browser to scrape metadata',
      meta: { url },
    })

    let browser = null

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      const page = await browser.newPage()
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )

      const timeout = this.config.timeout ?? 90000
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout,
      })

      const metadata = await page.evaluate(() => {
        const metaTags: Record<string, string> = {}
        const metas = document.querySelectorAll('meta')

        metas.forEach((meta) => {
          const name =
            meta.getAttribute('name') ||
            meta.getAttribute('property') ||
            meta.getAttribute('http-equiv')
          const content = meta.getAttribute('content')

          if (name && content) {
            metaTags[name] = content
          }
        })

        const title = document.title || ''

        const jsonLdScripts = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        )
        const jsonLd = jsonLdScripts
          .map((script) => {
            try {
              return JSON.parse(script.textContent || '{}')
            } catch {
              return null
            }
          })
          .filter(Boolean)

        const images: string[] = []
        const imgElements = document.querySelectorAll('img')
        imgElements.forEach((img) => {
          const src = img.src
          if (
            src &&
            !src.includes('data:') &&
            (src.startsWith('http') || src.startsWith('/'))
          ) {
            images.push(src)
          }
        })

        const favicon = document.querySelector(
          'link[rel="icon"], link[rel="shortcut icon"]'
        )
        const faviconUrl = favicon?.getAttribute('href') || null

        const description =
          metaTags['description'] || metaTags['og:description'] || ''

        return {
          title,
          description,
          metaTags,
          jsonLd,
          images,
          faviconUrl,
          url: window.location.href,
        }
      })

      console.log('metadataScraper: metadata received', {
        hasMetaTags: Boolean(Object.keys(metadata.metaTags).length > 0),
        imageCount: metadata.images.length,
        jsonLdCount: metadata.jsonLd.length,
      })

      this.logs.push({
        step: 'metadata:received',
        info: 'Metadata scraped successfully',
        meta: {
          hasMetaTags: Boolean(Object.keys(metadata.metaTags).length > 0),
          imageCount: metadata.images.length,
          jsonLdCount: metadata.jsonLd.length,
        },
      })

      return metadata as unknown as RawMetadata
    } catch (error) {
      console.error('metadataScraper: scraping failed', error)
      this.logs.push({
        step: 'metadata:error',
        info: 'Failed to scrape metadata',
        meta: { url, error: String(error) },
      })

      if (
        error instanceof Error &&
        error.message.includes('Navigation timeout')
      ) {
        throw new Error(
          'Request timed out. The website may be slow to respond or blocking scrapers.'
        )
      }

      throw error
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
}
