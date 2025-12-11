// textUtils.ts

export function cleanText(value?: string | null): string {
  if (!value) return ''
  return value.replace(/\s+/g, ' ').trim()
}

export function pickMetaString(
  value?: string | string[] | null
): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      const trimmed = entry.trim()
      if (trimmed) return trimmed
    }
  }
  return null
}
