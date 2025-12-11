// FormStatusBanner.tsx

import { cn } from '@/lib/utils'

type FormStatus = 'idle' | 'success' | 'error'

type FormStatusBannerProps = {
  status: FormStatus
  message: string
}

export function FormStatusBanner({ status, message }: FormStatusBannerProps) {
  if (!message || status === 'idle') return null

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        status === 'error'
          ? 'border-destructive/50 bg-destructive/10 text-destructive'
          : 'border-emerald-500/40 bg-emerald-50 text-emerald-700'
      )}>
      {message}
    </div>
  )
}
