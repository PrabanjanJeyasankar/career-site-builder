import { create } from 'zustand'

export type SectionKey = 'life' | 'values' | 'testimonials' | 'locations' | 'perks'

type SectionOrderState = {
  order: SectionKey[]
  setOrder: (next: SectionKey[]) => void
}

export const useSectionOrderStore = create<SectionOrderState>((set) => ({
  order: ['life', 'values', 'testimonials', 'locations', 'perks'],
  setOrder: (next) => set({ order: next }),
}))

export function reorder<T extends SectionKey>(list: T[], from: number, to: number): T[] {
  const next = [...list]
  const [removed] = next.splice(from, 1)
  next.splice(to, 0, removed)
  return next
}

const DEFAULT_ORDER: SectionKey[] = ['life', 'values', 'testimonials', 'locations', 'perks']

export function normalizeSectionOrder(initial?: string[] | null): SectionKey[] {
  if (!initial || !initial.length) return DEFAULT_ORDER
  const valid = initial.filter((key): key is SectionKey =>
    DEFAULT_ORDER.includes(key as SectionKey)
  )

  const remaining = DEFAULT_ORDER.filter((key) => !valid.includes(key))
  const deduped = Array.from(new Set([...valid, ...remaining]))
  return deduped
}

export function defaultSectionOrder(): SectionKey[] {
  return DEFAULT_ORDER
}
