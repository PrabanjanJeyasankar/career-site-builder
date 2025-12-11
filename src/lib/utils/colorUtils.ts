// colorUtils.ts

export function normalizeHex(value?: string | null): string | null {
  if (!value) return null
  const hex = value.trim()
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(hex)
    ? hex.toUpperCase()
    : null
}

export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function calculateBrightness(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

export function sortColorsByBrightness(
  color1: string,
  color2: string
): { darker: string; lighter: string } {
  const brightness1 = calculateBrightness(color1)
  const brightness2 = calculateBrightness(color2)

  if (brightness1 < brightness2) {
    return { darker: color1, lighter: color2 }
  } else {
    return { darker: color2, lighter: color1 }
  }
}
