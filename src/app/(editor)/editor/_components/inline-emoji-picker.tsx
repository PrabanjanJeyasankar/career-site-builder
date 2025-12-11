'use client'

import { useMemo, useState } from 'react'
import { PROFESSIONAL_EMOJIS } from '@/config/emoji-presets'

type InlineEmojiPickerProps = {
  onSelect: (emoji: string) => void
}

export function InlineEmojiPicker({ onSelect }: InlineEmojiPickerProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return PROFESSIONAL_EMOJIS
    return PROFESSIONAL_EMOJIS.filter((e) =>
      e.keywords.some((k) => k.toLowerCase().includes(q))
    )
  }, [query])

  return (
    <div className='mt-3 space-y-2 rounded-md border border-input bg-muted/40 p-2 text-xs text-muted-foreground'>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search: growth, learning, remote...'
        className='w-full rounded-md border border-input bg-background px-2 py-1 text-xs outline-none'
      />
      <div className='max-h-32 overflow-y-auto'>
        <div className='inline-flex max-w-full flex-wrap items-center justify-center gap-1.5'>
          {filtered.map((emoji) => (
            <button
              key={emoji.char + emoji.keywords[0]}
              type='button'
              onClick={() => onSelect(emoji.char)}
              className='flex h-7 w-7 items-center justify-center rounded-md text-base hover:bg-background'
              aria-label={`Use emoji ${emoji.char}`}>
              {emoji.char}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

