import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withAlpha(color?: string | null, opacity?: number) {
  if (!color) return undefined
  if (opacity === undefined) return color

  const hex = color.replace('#', '')
  if (hex.length !== 3 && hex.length !== 6) return color

  const normalized =
    hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  const int = Number.parseInt(normalized, 16)

  if (Number.isNaN(int)) return color

  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255

  const clampedOpacity = Math.min(Math.max(opacity, 0), 1)
  return `rgba(${r}, ${g}, ${b}, ${clampedOpacity})`
}
