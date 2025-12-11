'use client'

import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('space-y-3 md:space-y-4', className)}>
      <span className='text-[0.7rem] font-medium uppercase tracking-[0.2em] text-primary'>
        {eyebrow}
      </span>
      <h2 className='text-2xl font-semibold tracking-tight text-foreground md:text-3xl'>
        {title}
      </h2>
      {description && (
        <p className='text-xs text-muted-foreground md:text-sm'>
          {description}
        </p>
      )}
    </div>
  )
}

