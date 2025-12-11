'use client'

import { ShakeContainer } from '@/components/common/ValidateInput'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState, type ReactNode } from 'react'

type ValidatedPromptDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  label?: string
  placeholder?: string
  value: string
  onValueChange: (value: string) => void
  onConfirm: (value: string) => Promise<void> | void
  confirmLabel?: string
  cancelLabel?: string
  className?: string
  children?: ReactNode
}

export function ValidatedPromptDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  placeholder,
  value,
  onValueChange,
  onConfirm,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  className,
  children,
}: ValidatedPromptDialogProps) {
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setError(null)
    }
    onOpenChange(isOpen)
  }

  async function handleConfirm() {
    const nextValue = value.trim()
    if (!nextValue) {
      setError('Please add a value before saving.')
      return
    }

    await onConfirm(nextValue)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className={cn('max-w-md', className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <div className='mt-3 space-y-2'>
          {label && (
            <label className='text-xs font-medium text-muted-foreground'>
              {label}
            </label>
          )}
          <ShakeContainer active={!!error}>
            <Input
              value={value}
              onChange={(e) => {
                if (error) setError(null)
                onValueChange(e.target.value)
              }}
              placeholder={placeholder}
              className={cn(
                'h-9 text-sm',
                error &&
                  'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
              )}
            />
          </ShakeContainer>
          {error && <p className='text-xs text-destructive'>{error}</p>}
        </div>

        {children && <div className='mt-3'>{children}</div>}

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
