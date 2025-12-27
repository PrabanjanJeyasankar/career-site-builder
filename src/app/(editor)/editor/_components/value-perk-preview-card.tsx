'use client'

import { cn, withAlpha } from '@/lib/utils'

type ValuePerkPreviewCardProps = {
  icon?: string | null
  title: string
  description?: string | null
  variant: 'value' | 'perk'
  titleClassName: string
  descriptionClassName: string
  className?: string
  tileBgColor?: string
  iconBgColor?: string
  tileBgOpacity?: number
  iconBgOpacity?: number
}

export function ValuePerkPreviewCard({
  icon,
  title,
  description,
  variant,
  titleClassName,
  descriptionClassName,
  className,
  tileBgColor,
  iconBgColor,
  tileBgOpacity,
  iconBgOpacity,
}: ValuePerkPreviewCardProps) {
  const isPerk = variant === 'perk'

  const tileBgClass = isPerk ? 'bg-chart-2/10' : 'bg-chart-1/10'
  const iconBgClass = isPerk ? 'bg-chart-2/15' : 'bg-chart-1/15'
  const iconTextClass = isPerk ? 'text-chart-2' : 'text-chart-1'
  const fallbackIcon = isPerk ? '🎉' : '✨'
  const descriptionPlaceholder = isPerk
    ? 'Describe this benefit...'
    : 'Describe this value...'

  const descriptionWidthClass = isPerk ? 'max-w-xs' : 'max-w-md'

  const tileStyle = tileBgColor
    ? { backgroundColor: withAlpha(tileBgColor, tileBgOpacity) }
    : undefined

  const iconStyle = iconBgColor
    ? { backgroundColor: withAlpha(iconBgColor, iconBgOpacity) }
    : undefined

  return (
    <article
      className={cn(
        'flex h-full flex-col items-center text-center',
        className
      )}>
      <div
        className={cn(
          'relative inline-flex min-w-[9rem] items-center justify-center rounded-[1.75rem] px-6 pb-6 pt-7',
          tileBgClass
        )}
        style={tileStyle}>
        <div className='flex w-full flex-col items-center gap-3'>
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl text-xl',
              iconBgClass,
              iconTextClass
            )}
            style={iconStyle}>
            {icon ? icon : isPerk ? 'Icon' : fallbackIcon}
          </div>

          <div className='w-full text-center'>
            <h3
              className={cn(
                titleClassName,
                'w-full font-semibold text-foreground'
              )}>
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className='mt-5 flex w-full flex-1 items-center justify-center '>
        <p
          className={cn(
            descriptionClassName,
            descriptionWidthClass,
            'w-full text-center leading-relaxed text-muted-foreground'
          )}>
          {description || descriptionPlaceholder}
        </p>
      </div>
    </article>
  )
}
