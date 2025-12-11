// imageUploadService.ts
'use server'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createHash } from 'crypto'

type UploadImageResult = {
  success: boolean
  url?: string
  error?: string
}

type ImageUploadConfig = {
  maxSizeInMB: number
  allowedFormats: string[]
}

const DEFAULT_CONFIG: ImageUploadConfig = {
  maxSizeInMB: 5,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

  const missing = []
  if (!accountId) missing.push('CLOUDFLARE_ACCOUNT_ID')
  if (!accessKeyId) missing.push('CLOUDFLARE_R2_ACCESS_KEY_ID')
  if (!secretAccessKey) missing.push('CLOUDFLARE_R2_SECRET_ACCESS_KEY')

  if (missing.length) {
    throw new Error(
      `Missing Cloudflare R2 credentials: ${missing.join(', ')}`
    )
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId as string,
      secretAccessKey: secretAccessKey as string,
    },
  })
}

function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const hash = createHash('md5')
    .update(`${timestamp}-${random}-${originalName}`)
    .digest('hex')
    .substring(0, 8)

  const extension = originalName.split('.').pop()
  return `${timestamp}-${hash}.${extension}`
}

export async function uploadImageToR2(
  file: File,
  config: Partial<ImageUploadConfig> = {}
): Promise<UploadImageResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  try {
    const envPresence = {
      CLOUDFLARE_ACCOUNT_ID: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID),
      CLOUDFLARE_R2_ACCESS_KEY_ID: Boolean(process.env.CLOUDFLARE_R2_ACCESS_KEY_ID),
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: Boolean(
        process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
      ),
      CLOUDFLARE_R2_BUCKET_NAME: Boolean(process.env.CLOUDFLARE_R2_BUCKET_NAME),
      CLOUDFLARE_R2_PUBLIC_DOMAIN: Boolean(process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN),
    }

    console.log('Image upload: start', {
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
      },
      constraints: finalConfig,
      envPresence,
    })

    const maxSizeInBytes = finalConfig.maxSizeInMB * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      console.warn('Image upload: file too large', {
        fileSize: file.size,
        limitBytes: maxSizeInBytes,
      })
      return {
        success: false,
        error: `File size exceeds ${finalConfig.maxSizeInMB}MB limit`,
      }
    }

    if (!finalConfig.allowedFormats.includes(file.type)) {
      console.warn('Image upload: invalid format', {
        fileType: file.type,
        allowedFormats: finalConfig.allowedFormats,
      })
      return {
        success: false,
        error: `Invalid format. Allowed: ${finalConfig.allowedFormats.join(
          ', '
        )}`,
      }
    }

    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME
    if (!bucketName) {
      console.error('Missing R2 bucket env', envPresence)
      return {
        success: false,
        error:
          'R2 bucket not configured. Ensure CLOUDFLARE_R2_BUCKET_NAME is set (restart dev server).',
      }
    }

    const r2Client = getR2Client()
    const fileName = generateUniqueFileName(file.name)
    const buffer = Buffer.from(await file.arrayBuffer())

    console.log('Image upload: uploading to R2', {
      bucketName,
      fileName,
      contentType: file.type,
    })

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable',
    })

    await r2Client.send(uploadCommand)

    const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN
    if (!publicDomain) {
      console.error('Missing R2 public domain env', envPresence)
      return {
        success: false,
        error:
          'R2 public domain not configured. Ensure CLOUDFLARE_R2_PUBLIC_DOMAIN is set (restart dev server).',
      }
    }

    const url = `${publicDomain}/${fileName}`

    console.log('Image upload: success', { url })

    return {
      success: true,
      url,
    }
  } catch (error) {
    console.error('Image upload failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}

export async function validateImageDimensions(
  file: File,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<{
  valid: boolean
  error?: string
  dimensions?: { width: number; height: number }
}> {
  try {
    const bitmap = await createImageBitmap(file)
    const width = bitmap.width
    const height = bitmap.height

    if (minWidth && width < minWidth) {
      return {
        valid: false,
        error: `Image width must be at least ${minWidth}px (got ${width}px)`,
      }
    }

    if (minHeight && height < minHeight) {
      return {
        valid: false,
        error: `Image height must be at least ${minHeight}px (got ${height}px)`,
      }
    }

    if (maxWidth && width > maxWidth) {
      return {
        valid: false,
        error: `Image width must not exceed ${maxWidth}px (got ${width}px)`,
      }
    }

    if (maxHeight && height > maxHeight) {
      return {
        valid: false,
        error: `Image height must not exceed ${maxHeight}px (got ${height}px)`,
      }
    }

    return {
      valid: true,
      dimensions: { width, height },
    }
  } catch {
    return {
      valid: false,
      error: 'Failed to read image dimensions',
    }
  }
}
