// ImageUploadDialog.tsx
'use client'

import { Check, Copy, Link, UploadCloud, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type ImageUploadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (url: string) => void
  existingUrl?: string
  title?: string
  description?: string
  maxSizeInMB?: number
  allowedFormats?: string[]
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  onUpload,
  existingUrl,
  title = 'Upload image',
  description = 'Select an image file from your computer',
  maxSizeInMB = 5,
  allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}: ImageUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }, [])

  const validateFile = useCallback(
    async (file: File): Promise<string | null> => {
      const maxBytes = maxSizeInMB * 1024 * 1024

      if (file.size > maxBytes) {
        return `File size must be less than ${maxSizeInMB}MB (current: ${formatFileSize(
          file.size
        )})`
      }

      if (!allowedFormats.includes(file.type)) {
        return `Invalid format. Allowed: ${allowedFormats
          .map((f) => f.replace('image/', ''))
          .join(', ')}`
      }

      if (minWidth || minHeight || maxWidth || maxHeight) {
        try {
          const bitmap = await createImageBitmap(file)
          const { width, height } = bitmap

          if (minWidth && width < minWidth) {
            return `Image width must be at least ${minWidth}px (current: ${width}px)`
          }
          if (minHeight && height < minHeight) {
            return `Image height must be at least ${minHeight}px (current: ${height}px)`
          }
          if (maxWidth && width > maxWidth) {
            return `Image width must not exceed ${maxWidth}px (current: ${width}px)`
          }
          if (maxHeight && height > maxHeight) {
            return `Image height must not exceed ${maxHeight}px (current: ${height}px)`
          }
        } catch {
          return 'Failed to validate image dimensions'
        }
      }

      return null
    },
    [
      allowedFormats,
      formatFileSize,
      maxHeight,
      maxSizeInMB,
      maxWidth,
      minHeight,
      minWidth,
    ]
  )

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)

      const validationError = await validateFile(file)
      if (validationError) {
        setError(validationError)
        setIsUploading(false)
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('maxSizeMB', maxSizeInMB.toString())
        formData.append('allowedFormats', allowedFormats.join(','))
        if (minWidth) formData.append('minWidth', minWidth.toString())
        if (minHeight) formData.append('minHeight', minHeight.toString())
        if (maxWidth) formData.append('maxWidth', maxWidth.toString())
        if (maxHeight) formData.append('maxHeight', maxHeight.toString())

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed')
        }

        onUpload(data.url)
        onOpenChange(false)
        setPreviewUrl(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setIsUploading(false)
        URL.revokeObjectURL(objectUrl)
      }
    },
    [
      allowedFormats,
      maxHeight,
      maxSizeInMB,
      maxWidth,
      minHeight,
      minWidth,
      onOpenChange,
      onUpload,
      validateFile,
    ]
  )

  const handleFileChange = useCallback(
    (file: File | null | undefined) => {
      if (!file) return
      uploadFile(file)
    },
    [uploadFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileChange(files[0])
      }
    },
    [handleFileChange]
  )

  const handleClose = useCallback(() => {
    if (!isUploading) {
      setError(null)
      setPreviewUrl(null)
      setUrlInput('')
      onOpenChange(false)
    }
  }, [isUploading, onOpenChange])

  const handlePasteUrl = useCallback(() => {
    const trimmedUrl = urlInput.trim()

    if (!trimmedUrl) {
      setError('Please enter a valid URL')
      return
    }

    try {
      const url = new URL(trimmedUrl)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        setError('URL must start with http:// or https://')
        return
      }

      setError(null)
      onUpload(trimmedUrl)
      setUrlInput('')
      onOpenChange(false)
    } catch {
      setError('Please enter a valid URL')
    }
  }, [urlInput, onUpload, onOpenChange])

  const isValidImageUrl = useCallback((url: string): boolean => {
    if (!url.trim()) return false
    try {
      const urlObj = new URL(url.trim())
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }, [])

  const handleCopyExistingUrl = useCallback(async () => {
    if (existingUrl) {
      try {
        await navigator.clipboard.writeText(existingUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        setError('Failed to copy URL to clipboard')
      }
    }
  }, [existingUrl])

  const formatConstraints = useCallback(() => {
    const constraints: string[] = []
    if (minWidth && minHeight) {
      constraints.push(`min ${minWidth}x${minHeight}px`)
    }
    if (maxWidth && maxHeight) {
      constraints.push(`max ${maxWidth}x${maxHeight}px`)
    }
    constraints.push(`max ${maxSizeInMB}MB`)
    const formats = allowedFormats
      .map((f) => f.replace('image/', '').toUpperCase())
      .join(', ')
    constraints.push(formats)
    return constraints.join(' • ')
  }, [allowedFormats, maxHeight, maxSizeInMB, maxWidth, minHeight, minWidth])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-xl w-full'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-5'>
          {existingUrl && (
            <div className='rounded-2xl border bg-card p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2 min-w-0'>
                  <Link className='h-4 w-4 shrink-0 text-muted-foreground' />
                  <p
                    className='truncate text-sm text-muted-foreground max-w-[220px]'
                    title={existingUrl}>
                    {existingUrl}
                  </p>
                </div>

                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleCopyExistingUrl}
                  disabled={copied}
                  className='shrink-0'>
                  {copied ? (
                    <>
                      <Check className='mr-1 h-3 w-3' />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className='mr-1 h-3 w-3' />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {previewUrl ? (
            <div className='relative rounded-2xl border bg-card p-6'>
              <button
                type='button'
                onClick={() => setPreviewUrl(null)}
                className='absolute right-4 top-4 rounded-full bg-background/80 p-2 text-foreground shadow-sm transition-colors hover:bg-background'
                disabled={isUploading}>
                <X className='h-4 w-4' />
              </button>
              <div className='flex flex-col items-center gap-4'>
                <div className='relative h-48 w-full overflow-hidden rounded-lg'>
                  <Image
                    src={previewUrl}
                    alt='Preview'
                    fill
                    className='object-contain'
                    unoptimized
                  />
                </div>
                {isUploading && (
                  <p className='text-sm text-muted-foreground'>Uploading...</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div
                className={`rounded-2xl border bg-card p-6 transition-colors ${
                  isDragging
                    ? 'border-primary/70 bg-primary/5'
                    : 'border-border'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}>
                <div className='flex flex-col items-center gap-4 text-center'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-primary/70 bg-primary/10'>
                    <UploadCloud className='h-7 w-7 text-primary' />
                  </div>
                  <div>
                    <p className='text-lg font-semibold'>
                      Upload from computer
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {formatConstraints()}
                    </p>
                  </div>
                  <Button
                    type='button'
                    className='px-6 text-sm font-semibold'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}>
                    Choose file
                  </Button>
                  <p className='text-xs text-muted-foreground'>
                    or drag and drop your file here
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={allowedFormats.join(',')}
                  className='hidden'
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  disabled={isUploading}
                />
              </div>

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background px-2 text-muted-foreground'>
                    Or paste image URL
                  </span>
                </div>
              </div>

              <div className='flex gap-2'>
                <Input
                  type='url'
                  placeholder='https://example.com/image.jpg'
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value)
                    if (error) setError(null)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasteUrl()}
                  disabled={isUploading}
                  className='flex-1 truncate max-w-full'
                />

                <Button
                  type='button'
                  onClick={handlePasteUrl}
                  disabled={isUploading || !isValidImageUrl(urlInput)}>
                  Use URL
                </Button>
              </div>
            </>
          )}

          {error && (
            <div className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleClose}
            disabled={isUploading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
