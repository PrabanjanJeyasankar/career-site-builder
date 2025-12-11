import type React from 'react'
import { useRef, useState } from 'react'

import { importJobsFromCsv } from '@/lib/actions/jobsInline'
import type { Job } from '@/types/database'

type ParsedCsvJob = {
  title: string
  department: string
  location: string
  work_type: string
  employment_type: string
  description: string
  apply_url: string
}

type UseJobsImportArgs = {
  onImported: (jobs: Job[]) => void
}

export function useJobsImport({ onImported }: UseJobsImportArgs) {
  const [parsedRows, setParsedRows] = useState<ParsedCsvJob[]>([])
  const [importError, setImportError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function validateAndParse(file?: File | null) {
    if (!file) return
    const MAX_BYTES = 5 * 1024 * 1024
    if (file.size > MAX_BYTES) {
      setImportError('File is too large. Max size is 5 MB.')
      setParsedRows([])
      return
    }

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/csv',
      'text/plain',
    ]
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!allowedTypes.includes(file.type) && extension !== 'csv') {
      setImportError('Only CSV files are supported.')
      setParsedRows([])
      return
    }

    setImportError(null)
    setParsedRows([])

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = String(event.target?.result || '')
      const result = parseJobsCsv(text)
      if (result.error) {
        setImportError(result.error)
        setParsedRows([])
      } else {
        setParsedRows(result.rows)
      }
    }
    reader.readAsText(file)
  }

  async function importCsv() {
    if (!parsedRows.length) {
      setImportError('No rows found. Please upload a CSV with data.')
      return false
    }

    setImporting(true)
    setImportError(null)

    const normalizeWorkType = (
      value: string
    ): 'remote' | 'hybrid' | 'onsite' => {
      const normalized = value.toLowerCase().replace(/\s+/g, '-')
      if (normalized === 'on-site') return 'onsite'
      if (
        normalized === 'remote' ||
        normalized === 'hybrid' ||
        normalized === 'onsite'
      ) {
        return normalized as 'remote' | 'hybrid' | 'onsite'
      }
      throw new Error(
        `Invalid work_type "${value}". Use remote, hybrid, or onsite.`
      )
    }

    const normalizeEmploymentType = (
      value: string
    ): 'full-time' | 'part-time' | 'contract' | 'internship' => {
      const normalized = value.toLowerCase().replace(/\s+/g, '-')
      if (
        normalized === 'full-time' ||
        normalized === 'part-time' ||
        normalized === 'contract' ||
        normalized === 'internship'
      ) {
        return normalized as
          | 'full-time'
          | 'part-time'
          | 'contract'
          | 'internship'
      }
      throw new Error(
        `Invalid employment_type "${value}". Use full-time, part-time, contract, or internship.`
      )
    }

    let normalizedRows
    try {
      normalizedRows = parsedRows.map((row) => ({
        ...row,
        work_type: normalizeWorkType(row.work_type),
        employment_type: normalizeEmploymentType(row.employment_type),
      }))
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : 'Invalid CSV data'
      )
      setImporting(false)
      return false
    }

    const result = await importJobsFromCsv(normalizedRows)
    if (!result.success || !result.data) {
      setImportError(result.error || 'Import failed')
      setImporting(false)
      return false
    }

    onImported(result.data)
    setParsedRows([])
    setImporting(false)
    return true
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    validateAndParse(file)
  }

  function onFileChange(file?: File | null) {
    validateAndParse(file)
  }

  return {
    parsedRows,
    importError,
    importing,
    isDragging,
    inputRef,
    importCsv,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileChange,
  }
}

export function parseJobsCsv(text: string): {
  rows: ParsedCsvJob[]
  error?: string
} {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
  if (!lines.length) return { rows: [], error: 'File is empty' }

  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  const requiredHeaders = [
    'title',
    'department',
    'location',
    'work_type',
    'employment_type',
    'description',
    'apply_url',
  ]
  const missing = requiredHeaders.filter((h) => !headers.includes(h))
  if (missing.length) {
    return {
      rows: [],
      error: `Missing required headers: ${missing.join(', ')}`,
    }
  }

  const headerIndex: Record<string, number> = {}
  headers.forEach((header, index) => {
    headerIndex[header] = index
  })

  const rows: ParsedCsvJob[] = []

  lines.slice(1).forEach((line) => {
    if (!line.trim()) return
    const columns = splitCsvLine(line)
    if (columns.every((c) => !c.trim())) return

    const valueFor = (key: string) =>
      unquote(columns[headerIndex[key]] ?? '').trim()

    rows.push({
      title: valueFor('title'),
      department: valueFor('department'),
      location: valueFor('location'),
      work_type: valueFor('work_type'),
      employment_type: valueFor('employment_type'),
      description: valueFor('description'),
      apply_url: valueFor('apply_url'),
    })
  })

  return { rows }
}

function splitCsvLine(line: string) {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"' && inQuotes && next === '"') {
      current += '"'
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values
}

function unquote(value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/""/g, '"')
  }
  return trimmed
}
