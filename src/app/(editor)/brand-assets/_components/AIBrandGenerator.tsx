// AIBrandGenerator.tsx

import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type AIBrandGeneratorProps = {
  url: string
  error: string | null
  isPending: boolean
  onUrlChange: (url: string) => void
  onGenerate: () => void
}

export function AIBrandGenerator({
  url,
  error,
  isPending,
  onUrlChange,
  onGenerate,
}: AIBrandGeneratorProps) {
  return (
    <div className='rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-4 shadow-sm'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2 text-sm font-semibold text-primary'>
            <Sparkles className='size-4' />
            <span>Draft your brand in seconds</span>
          </div>
          <p className='text-xs text-muted-foreground'>
            Drop in your homepage URL and let AI pull logos, palette, and copy
            to start your brand kit.
          </p>
        </div>
      </div>

      <div className='mt-3 flex flex-col gap-3 md:mt-4 md:flex-row md:items-center'>
        <Input
          type='url'
          placeholder='https://yourcompany.com'
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className='w-full border-primary/40 bg-background/60'
        />

        {error && <p className='mt-1 text-xs text-destructive'>{error}</p>}

        <Button
          type='button'
          className='group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5'
          onClick={onGenerate}
          disabled={isPending}>
          <span className='flex items-center gap-2'>
            <Sparkles className='size-4' />
            {isPending ? 'Summoning AI...' : 'Fill it with AI'}
          </span>
        </Button>
      </div>
    </div>
  )
}
