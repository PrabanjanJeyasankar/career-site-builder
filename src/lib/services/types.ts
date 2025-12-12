// types.ts

export type CompanyInfo = {
  company_name: string
  tagline: string
  description: string
  favicon_url: string
  logo_url: string
  social_preview_url: string
  primary_color: string
  secondary_color: string
  hero_title: string
  hero_subtitle: string
  hero_description: string
  hero_background_url: string
  cta_label: string
}

export type MetaTags = {
  title?: string
  description?: string
  favicon?: string
  'og:title'?: string
  'og:description'?: string
  'og:image'?: string | string[]
  'twitter:title'?: string
  'twitter:description'?: string
  'twitter:image'?: string | string[]
} & Record<string, string | string[] | undefined>

export type JsonLdEntry = {
  logo?: string | string[]
  name?: string
} & Record<string, string | string[] | number | boolean | null | undefined>

export type RawMetadata = {
  metaTags?: MetaTags
  jsonLd?: JsonLdEntry[]
  favicon?: string | null
  h1?: string
  allH1s?: string[]
  allH2s?: string[]
  wordCount?: number
  url?: string
} & Record<
  string,
  string | number | boolean | null | undefined | MetaTags | JsonLdEntry[]
>

export type LogMeta = Record<
  string,
  string | number | boolean | null | undefined
>

export type PipelineLog = {
  step: string
  info: string
  meta?: LogMeta
}

export type ColorExtractionResult = {
  primary: string
  secondary: string
}

export type ScraperConfig = {
  token: string
  timeout?: number
}

export type ColorExtractorConfig = {
  apiKey: string
  apiSecret: string
}

export type OpenAIRefinementConfig = {
  apiKey: string
  model?: string
}

export type OllamaAIRefinementConfig = {
  baseUrl?: string
  model?: string
}

export type LLMProvider = 'openai' | 'ollama'
