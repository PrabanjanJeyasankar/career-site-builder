'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Trash } from 'lucide-react'

type InlineDeleteButtonProps = {
  onClick: () => void
  className?: string
  'aria-label'?: string
}

export function InlineDeleteButton({
  onClick,
  className,
  'aria-label': ariaLabel,
}: InlineDeleteButtonProps) {
  return (
    <Button
      type='button'
      size='icon-sm'
      variant='ghost'
      onClick={onClick}
      aria-label={ariaLabel ?? 'Delete item'}
      className={cn(
        'h-7 w-7 p-0 text-muted-foreground hover:text-destructive',
        className
      )}>
      <Trash className='h-4 w-4 text-red-400' />
    </Button>
  )
}
