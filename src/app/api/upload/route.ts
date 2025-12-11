// route.ts
import { uploadImageToR2 } from '@/lib/services/imageUploadService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.error('Upload API: no file in request')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const maxSizeEntry = formData.get('maxSizeMB') ?? formData.get('maxSizeInMB')
    const parsedMaxSize =
      typeof maxSizeEntry === 'string' && maxSizeEntry.trim() !== ''
        ? Number(maxSizeEntry)
        : undefined

    const allowedFormatsEntry = formData.get('allowedFormats')
    let parsedAllowedFormats: string[] | undefined

    if (typeof allowedFormatsEntry === 'string') {
      try {
        const possibleJson = JSON.parse(allowedFormatsEntry)
        if (Array.isArray(possibleJson)) {
          parsedAllowedFormats = possibleJson.filter(
            (item): item is string => typeof item === 'string'
          )
        }
      } catch {
        // Not JSON - fall back to comma-separated parsing below
      }

      if (!parsedAllowedFormats) {
        parsedAllowedFormats = allowedFormatsEntry
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
      }

      if (parsedAllowedFormats.length === 0) {
        parsedAllowedFormats = undefined
      }
    }

    console.log('Upload API: request received', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      config: {
        maxSizeInMB: parsedMaxSize,
        allowedFormats: parsedAllowedFormats,
      },
    })

    const config = {
      maxSizeInMB: parsedMaxSize,
      allowedFormats: parsedAllowedFormats,
    }

    const result = await uploadImageToR2(file, config)

    if (!result.success) {
      console.warn('Upload API: upload failed', {
        error: result.error,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        config,
      })
    } else {
      console.log('Upload API: upload succeeded', { url: result.url })
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
