'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type TestimonialLayoutProps = {
  avatarTile: ReactNode
  name: ReactNode
  role: ReactNode
  quote: ReactNode
  stackDirectionClass?: string
  gapClass?: string
  avatarWrapperClass?: string
  className?: string
}

export function TestimonialLayout({
  avatarTile,
  name,
  role,
  quote,
  stackDirectionClass = 'flex-col md:flex-row',
  gapClass = 'gap-8 md:gap-12',
  avatarWrapperClass = '',
  className,
}: TestimonialLayoutProps) {
  return (
    <article className={cn('pt-0', className)}>
      <div className={cn('flex items-center', stackDirectionClass, gapClass)}>
        <div className='flex-shrink-0'>
          <div
            className={cn(
              'relative inline-flex min-w-[10.5rem] items-center justify-center rounded-[1.75rem] bg-primary/10 px-8 py-9 text-primary',
              avatarWrapperClass
            )}>
            <span className='pointer-events-none absolute -top-8 left-4 text-4xl font-semibold leading-none text-primary/80'>
              &ldquo;
            </span>
            <span className='pointer-events-none absolute -bottom-10 right-6 text-4xl font-semibold leading-none text-primary/80'>
              &rdquo;
            </span>

            <div className='flex flex-col items-center gap-3'>
              {avatarTile}
              <div className='text-center'>
                {name}
                {role}
              </div>
            </div>
          </div>
        </div>

        <div className='flex-1'>{quote}</div>
      </div>
    </article>
  )
}
