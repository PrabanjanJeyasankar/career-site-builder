// AIBrandGenerator.tsx

import { Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { GenerationStep } from '@/hooks/use-ai-brand-generator'

type AIBrandGeneratorProps = {
  url: string
  error: string | null
  isPending: boolean
  currentStep: GenerationStep
  onUrlChange: (url: string) => void
  onGenerate: () => void
}

const STEP_MESSAGES: Record<GenerationStep, string> = {
  idle: '',
  scraping: 'Scraping website data...',
  'extracting-colors': 'Extracting colors and images...',
  'generating-content': 'AI is generating your brand content...',
  saving: 'Saving to database...',
  complete: 'Complete! Your brand is ready.',
}

export function AIBrandGenerator({
  url,
  error,
  isPending,
  currentStep,
  onUrlChange,
  onGenerate,
}: AIBrandGeneratorProps) {
  return (
    <div
      className={`rounded-xl border border-primary/30 p-4 shadow-sm transition-all duration-500 ${
        isPending
          ? 'animate-gradient border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5'
          : 'bg-gradient-to-r from-primary/8 via-primary/4 to-background'
      }`}>
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
          disabled={isPending}
        />

        <Button
          type='button'
          className='group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5'
          onClick={onGenerate}
          disabled={isPending}>
          <span className='flex items-center gap-2'>
            {isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Sparkles className='size-4' />
            )}
            {isPending ? 'Generating...' : 'Fill it with AI'}
          </span>
        </Button>
      </div>

      {error && <p className='mt-3 text-xs text-destructive'>{error}</p>}

      {isPending && currentStep !== 'idle' && currentStep !== 'complete' && (
        <div className='mt-3 flex items-center gap-2 rounded-md bg-primary/5 px-3 py-2 text-sm font-medium text-primary'>
          <Loader2 className='size-4 animate-spin' />
          <span>{STEP_MESSAGES[currentStep]}</span>
        </div>
      )}

      {!isPending && currentStep === 'complete' && (
        <div className='mt-3 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400'>
          {STEP_MESSAGES[currentStep]}
        </div>
      )}
    </div>
  )
}
