// ImageUpload.tsx
'use client'

import { ImageIcon, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type ImageUploadConstraints = {
  maxSizeInMB?: number
  allowedFormats?: string[]
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  aspectRatio?: string
}

type ImageUploadProps = {
  value?: string
  onChange: (url: string) => void
  constraints?: ImageUploadConstraints
  label?: string
  description?: string
  placeholder?: string
}

const DEFAULT_CONSTRAINTS: ImageUploadConstraints = {
  maxSizeInMB: 5,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}

export function ImageUpload({
  value,
  onChange,
  constraints = DEFAULT_CONSTRAINTS,
  label = 'Image',
  description,
  placeholder = 'Upload an image or paste URL',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const finalConstraints = useMemo(
    () => ({ ...DEFAULT_CONSTRAINTS, ...constraints }),
    [constraints]
  )

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }, [])

  const validateFile = useCallback(
    async (file: File): Promise<string | null> => {
      const maxBytes = (finalConstraints.maxSizeInMB || 5) * 1024 * 1024

      if (file.size > maxBytes) {
        return `File size must be less than ${
          finalConstraints.maxSizeInMB
        }MB (current: ${formatFileSize(file.size)})`
      }

      if (
        finalConstraints.allowedFormats &&
        !finalConstraints.allowedFormats.includes(file.type)
      ) {
        return `Invalid format. Allowed: ${finalConstraints.allowedFormats
          .map((f) => f.replace('image/', ''))
          .join(', ')}`
      }

      if (
        finalConstraints.minWidth ||
        finalConstraints.minHeight ||
        finalConstraints.maxWidth ||
        finalConstraints.maxHeight
      ) {
        try {
          const bitmap = await createImageBitmap(file)
          const { width, height } = bitmap

          if (finalConstraints.minWidth && width < finalConstraints.minWidth) {
            return `Image width must be at least ${finalConstraints.minWidth}px (current: ${width}px)`
          }
          if (
            finalConstraints.minHeight &&
            height < finalConstraints.minHeight
          ) {
            return `Image height must be at least ${finalConstraints.minHeight}px (current: ${height}px)`
          }
          if (finalConstraints.maxWidth && width > finalConstraints.maxWidth) {
            return `Image width must not exceed ${finalConstraints.maxWidth}px (current: ${width}px)`
          }
          if (
            finalConstraints.maxHeight &&
            height > finalConstraints.maxHeight
          ) {
            return `Image height must not exceed ${finalConstraints.maxHeight}px (current: ${height}px)`
          }
        } catch {
          return 'Failed to validate image dimensions'
        }
      }

      return null
    },
    [finalConstraints, formatFileSize]
  )

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setError(null)

      const validationError = await validateFile(file)
      if (validationError) {
        setError(validationError)
        setIsUploading(false)
        return
      }

      try {
        const formData = new FormData()
        formData.append('file', file)

        if (finalConstraints.maxSizeInMB) {
          formData.append('maxSizeMB', String(finalConstraints.maxSizeInMB))
        }
        if (finalConstraints.allowedFormats) {
          formData.append(
            'allowedFormats',
            finalConstraints.allowedFormats.join(',')
          )
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!result.success) {
          setError(result.error || 'Upload failed')
          return
        }

        onChange(result.url)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setIsUploading(false)
      }
    },
    [validateFile, finalConstraints, onChange]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        uploadFile(file)
      }
    },
    [uploadFile]
  )

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setShowUrlDialog(false)
      setError(null)
    }
  }

  const handleRemove = () => {
    onChange('')
    setError(null)
  }

  const constraintText = []
  if (finalConstraints.maxSizeInMB) {
    constraintText.push(`Max ${finalConstraints.maxSizeInMB}MB`)
  }
  if (finalConstraints.allowedFormats) {
    const formats = finalConstraints.allowedFormats
      .map((f) => f.replace('image/', '').toUpperCase())
      .join(', ')
    constraintText.push(formats)
  }
  if (finalConstraints.minWidth || finalConstraints.minHeight) {
    constraintText.push(
      `Min ${finalConstraints.minWidth || ''}x${
        finalConstraints.minHeight || ''
      }px`
    )
  }
  if (finalConstraints.aspectRatio) {
    constraintText.push(`Ratio ${finalConstraints.aspectRatio}`)
  }

  return (
    <div className='space-y-2'>
      {label && <Label>{label}</Label>}
      {description && (
        <p className='text-xs text-muted-foreground'>{description}</p>
      )}
      {value ? (
        <div className='relative w-full max-w-full overflow-hidden rounded-lg border'>
          <div className='relative w-full aspect-video overflow-hidden rounded-lg bg-muted'>
            <Image
              src={value}
              alt='Uploaded image'
              fill
              className='object-cover'
              unoptimized
            />
          </div>

          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute right-2 top-2 z-20'
            onClick={handleRemove}>
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div
          className={`relative rounded-lg border-2 border-dashed transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
          <div className='flex flex-col items-center justify-center gap-4 p-8'>
            {isUploading ? (
              <>
                <Loader2 className='h-10 w-10 animate-spin text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className='h-10 w-10 text-muted-foreground' />
                <div className='text-center'>
                  <p className='text-sm font-medium'>{placeholder}</p>
                  <p className='text-xs text-muted-foreground'>
                    {constraintText.join(' • ')}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      document.getElementById('file-input')?.click()
                    }>
                    <Upload className='mr-2 h-4 w-4' />
                    Upload File
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setShowUrlDialog(true)}>
                    Paste URL
                  </Button>
                </div>
              </>
            )}
          </div>
          <input
            id='file-input'
            type='file'
            className='hidden'
            accept={finalConstraints.allowedFormats?.join(',')}
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
      )}

      {error && <p className='text-xs text-destructive'>{error}</p>}

      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Paste Image URL</DialogTitle>
            <DialogDescription>
              Enter the URL of the image you want to use
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder='https://example.com/image.jpg'
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUrlSubmit()
                }
              }}
            />
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setShowUrlDialog(false)
                  setUrlInput('')
                }}>
                Cancel
              </Button>
              <Button type='button' onClick={handleUrlSubmit}>
                Add URL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
