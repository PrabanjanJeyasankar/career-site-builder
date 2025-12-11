// metadataUtils.ts

import type { CompanyInfo, RawMetadata } from '@/lib/services/types'

import { normalizeHex } from './colorUtils'
import { cleanText, pickMetaString } from './textUtils'

export function selectBestImage(raw: RawMetadata): string | null {
  const jsonLdEntries = Array.isArray(raw.jsonLd) ? raw.jsonLd : []
  const jsonLdLogos = jsonLdEntries
    .map((item) => {
      const logo = item?.logo
      if (Array.isArray(logo))
        return logo.filter((value) => Boolean(value && value.trim()))
      if (typeof logo === 'string' && logo.trim()) return [logo]
      return []
    })
    .flat()

  const ogImage = pickMetaString(raw.metaTags?.['og:image'])
  const twitterImage = pickMetaString(raw.metaTags?.['twitter:image'])
  const favicon = raw.metaTags?.favicon ?? raw.favicon ?? null

  return jsonLdLogos[0] || ogImage || twitterImage || favicon || null
}

export function buildHeuristicProfile(
  raw: RawMetadata,
  colors: { primary: string; secondary: string },
  bestImageUrl: string | null
): CompanyInfo {
  const meta = raw.metaTags ?? {}
  const jsonLdPrimary = Array.isArray(raw.jsonLd) ? raw.jsonLd[0] : undefined

  const title =
    pickMetaString(meta['og:title']) ||
    pickMetaString(meta.title) ||
    pickMetaString(meta['twitter:title']) ||
    jsonLdPrimary?.name ||
    'Your Company'

  const fallbackDescription =
    'We build products with care for people and business.'
  const description =
    pickMetaString(meta['og:description']) ||
    pickMetaString(meta.description) ||
    pickMetaString(meta['twitter:description']) ||
    fallbackDescription

  const logo =
    pickMetaString(jsonLdPrimary?.logo) ||
    pickMetaString(meta['og:image']) ||
    pickMetaString(meta['twitter:image']) ||
    meta.favicon ||
    ''
  const favicon = meta.favicon || ''
  const social =
    pickMetaString(meta['og:image']) ||
    pickMetaString(meta['twitter:image']) ||
    ''

  const h1 = raw.h1 || raw.allH1s?.[0] || title
  const h2Primary = raw.allH2s?.[0] || ''
  const h2Secondary = raw.allH2s?.[1] || ''

  const heroTitle = h1 || title
  const heroSubtitle =
    h2Primary || h2Secondary || 'Join our team and make an impact'
  const heroDescription =
    description || 'Explore opportunities to grow your career with us.'

  return ensureCompleteProfile({
    company_name: cleanText(title),
    tagline: cleanText((description ?? fallbackDescription).slice(0, 80)),
    description: cleanText(description ?? fallbackDescription),
    favicon_url: favicon,
    logo_url: logo || bestImageUrl || '',
    social_preview_url: social || bestImageUrl || '',
    primary_color: colors.primary,
    secondary_color: colors.secondary,
    hero_title: cleanText(heroTitle),
    hero_subtitle: cleanText(heroSubtitle),
    hero_description: cleanText(heroDescription),
    hero_background_url: social || bestImageUrl || '',
    cta_label: 'View roles',
  })
}

export function ensureCompleteProfile(
  input: Partial<CompanyInfo>
): CompanyInfo {
  const fallback: CompanyInfo = {
    company_name: 'Your Company',
    tagline: 'Build what matters',
    description:
      'We create thoughtful products with a focus on impact and people.',
    favicon_url: '',
    logo_url: '',
    social_preview_url: '',
    primary_color: '#5038EE',
    secondary_color: '#F5F5F5',
    hero_title: 'Careers at Your Company',
    hero_subtitle: 'Join a team that values craft, collaboration, and impact.',
    hero_description:
      'We are hiring builders and problem-solvers who want to make a difference together.',
    hero_background_url: 'Abstract gradient inspired by brand colors',
    cta_label: 'View roles',
  }

  const merged: CompanyInfo = {
    ...fallback,
    ...input,
    primary_color: normalizeHex(input.primary_color) ?? fallback.primary_color,
    secondary_color:
      normalizeHex(input.secondary_color) ?? fallback.secondary_color,
  }

  merged.company_name = cleanText(merged.company_name)
  merged.tagline = cleanText(merged.tagline)
  merged.description = cleanText(merged.description)
  merged.hero_title = cleanText(merged.hero_title)
  merged.hero_subtitle = cleanText(merged.hero_subtitle)
  merged.hero_description = cleanText(merged.hero_description)
  merged.cta_label = cleanText(merged.cta_label)
  merged.hero_background_url = cleanText(merged.hero_background_url)

  return merged
}
