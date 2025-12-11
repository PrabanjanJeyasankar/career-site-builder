'use client'

import { cn } from '@/lib/utils'
import { Replace } from 'lucide-react'
import { ReactNode } from 'react'
import { InlineDeleteButton } from './inline-delete-button'

type ValuePerkEditorItemProps = {
  icon?: string | null
  fallbackIcon?: string
  onDelete: () => void
  onIconClick: () => void
  title: ReactNode
  description: ReactNode
  tileBgClass: string
  iconBgClass: string
  iconTextClass: string
  className?: string
}

export function ValuePerkEditorItem({
  icon,
  fallbackIcon = '✨',
  onDelete,
  onIconClick,
  title,
  description,
  tileBgClass,
  iconBgClass,
  iconTextClass,
  className,
}: ValuePerkEditorItemProps) {
  return (
    <div
      className={cn(
        'group relative flex h-full flex-col items-center pt-8 text-center',
        className
      )}>
      <div className='absolute right-0 top-0 flex translate-y-[-1.25rem] gap-2'>
        <InlineDeleteButton onClick={onDelete} />
      </div>

      <div
        className={cn(
          'group/icon relative inline-flex min-w-[9rem] cursor-pointer items-center justify-center rounded-[1.75rem] px-6 pb-6 pt-7',
          tileBgClass
        )}
        onClick={onIconClick}>
        <div className='flex w-full flex-col items-center gap-3'>
          <div
            className={cn(
              'relative flex h-16 w-16 items-center justify-center rounded-2xl text-xl',
              iconBgClass,
              iconTextClass
            )}>
            {icon || fallbackIcon}
            <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-black/25 opacity-0 transition-opacity group-hover/icon:opacity-100'>
              <Replace className='h-4 w-4 text-white' />
            </div>
          </div>

          <div className='w-full text-center'>{title}</div>
        </div>
      </div>

      {description}
    </div>
  )
}

