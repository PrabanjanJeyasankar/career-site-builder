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
import DOMPurify from 'isomorphic-dompurify'
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
  validateUrl?: boolean
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
  validateUrl = false,
}: ValidatedPromptDialogProps) {
  const [error, setError] = useState<string | null>(null)

  function isValidUrl(url: string): boolean {
    if (!url.trim()) return false
    try {
      const urlObj = new URL(url.trim())
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setError(null)
    }
    onOpenChange(isOpen)
  }

  async function handleConfirm() {
    const sanitized = DOMPurify.sanitize(value.trim())
    const nextValue = sanitized
    if (!nextValue) {
      setError('Please add a value before saving.')
      return
    }

    if (validateUrl && !isValidUrl(nextValue)) {
      setError('Please enter a valid URL (must start with http:// or https://)')
      return
    }

    await onConfirm(nextValue)
    onOpenChange(false)
  }

  const isFormValid = value.trim() && (!validateUrl || isValidUrl(value.trim()))

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
                onValueChange(DOMPurify.sanitize(e.target.value))
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
          <AlertDialogAction onClick={handleConfirm} disabled={!isFormValid}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
