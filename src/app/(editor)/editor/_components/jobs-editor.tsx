/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Upload, UploadCloud } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useJobsImport } from '@/hooks/use-jobs-import'
import {
  createJobInline,
  deleteJobInline,
  saveJobInline,
} from '@/lib/actions/jobsInline'
import type { Job } from '@/types/database'
import { JobFilters } from './job-filters'
import { ApplyLinkDialog } from './jobs/apply-link-dialog'
import {
  CreateJobDialog,
  type CreateJobFormState,
} from './jobs/create-job-dialog'
import { JobCard } from './jobs/job-card'
import { SectionHeading } from './section-heading'

type EditorProps = {
  initial: Job[]
}

export function JobsEditor({ initial }: EditorProps) {
  const [jobs, setJobs] = useState(initial)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [applyUrl, setApplyUrl] = useState('')
  const [applyJobId, setApplyJobId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [workTypeFilter, setWorkTypeFilter] = useState('all')
  const [employmentFilter, setEmploymentFilter] = useState('all')
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  const {
    parsedRows,
    importError,
    importing,
    isDragging,
    inputRef: csvInputRef,
    importCsv,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileChange,
  } = useJobsImport({
    onImported: (newJobs) => setJobs((prev) => [...prev, ...newJobs]),
  })

  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((j) => j.department).filter(Boolean))).map(
        (value) => ({
          value,
          label: value,
        })
      ),
    [jobs]
  )

  const locationOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))).map(
        (value) => ({
          value,
          label: value,
        })
      ),
    [jobs]
  )

  const workTypeOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((j) => j.work_type).filter(Boolean))).map(
        (value) => ({
          value,
          label: value.replace('-', ' '),
        })
      ),
    [jobs]
  )

  const employmentOptions = useMemo(
    () =>
      Array.from(
        new Set(jobs.map((j) => j.employment_type).filter(Boolean))
      ).map((value) => ({ value, label: value.replace('-', ' ') })),
    [jobs]
  )

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase()
    return jobs.filter((job) => {
      if (
        departmentFilter !== 'all' &&
        job.department.toLowerCase() !== departmentFilter.toLowerCase()
      )
        return false
      if (
        locationFilter !== 'all' &&
        job.location.toLowerCase() !== locationFilter.toLowerCase()
      )
        return false
      if (
        workTypeFilter !== 'all' &&
        job.work_type.toLowerCase() !== workTypeFilter.toLowerCase()
      )
        return false
      if (
        employmentFilter !== 'all' &&
        job.employment_type.toLowerCase() !== employmentFilter.toLowerCase()
      )
        return false
      if (!q) return true
      const haystack = (
        job.title +
        ' ' +
        job.department +
        ' ' +
        job.location +
        ' ' +
        job.description
      ).toLowerCase()
      return haystack.includes(q)
    })
  }, [
    jobs,
    search,
    departmentFilter,
    locationFilter,
    workTypeFilter,
    employmentFilter,
  ])

  function updateJobLocal(id: string, patch: Partial<Job>) {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...patch } : job))
    )
  }

  async function saveJob(id: string, patch: Partial<Job>) {
    const current = jobs.find((j) => j.id === id)
    if (!current) return
    const payload = {
      id,
      title: patch.title ?? current.title,
      department: patch.department ?? current.department,
      location: patch.location ?? current.location,
      workType: patch.work_type ?? current.work_type,
      employmentType: patch.employment_type ?? current.employment_type,
      description: patch.description ?? current.description,
      applyUrl:
        patch.apply_url !== null && patch.apply_url !== undefined
          ? patch.apply_url
          : current.apply_url ?? undefined,
    }
    updateJobLocal(id, patch)
    const result = await saveJobInline(payload)
    if (!result.success) console.error('Save failed:', result.error)
  }

  async function handleDeleteJob(id: string) {
    try {
      const result = await deleteJobInline(id)
      if (result.success) {
        setJobs((prev) => prev.filter((j) => j.id !== id))
      }
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  function openApplyUrlDialog(jobId: string, currentUrl: string) {
    setApplyJobId(jobId)
    setApplyUrl(currentUrl || '')
    setApplyDialogOpen(true)
  }

  async function confirmApplyUrl() {
    if (!applyJobId) return
    const trimmedUrl = applyUrl.trim()
    if (!trimmedUrl) return

    try {
      const urlObj = new URL(trimmedUrl)
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') return
    } catch {
      return
    }

    updateJobLocal(applyJobId, { apply_url: trimmedUrl })
    await saveJob(applyJobId, { apply_url: trimmedUrl })
    setApplyDialogOpen(false)
  }

  async function handleCreateJob(form: CreateJobFormState) {
    try {
      const result = await createJobInline({
        title: form.title.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        workType: form.workType as any,
        employmentType: form.employmentType as any,
        description: form.description.trim(),
        applyUrl: form.applyUrl.trim(),
      })
      if (result.success && result.data) {
        setJobs((prev) => [...prev, result.data])
        return true
      }
      if (!result.success && result.error) {
        console.error('Create failed:', result.error)
      }
      return false
    } catch (error) {
      console.error('Create failed', error)
      return false
    }
  }

  return (
    <section className='w-full bg-background py-16'>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-10 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Open roles'
            title='Join the team'
            description='Search by role, team or location and fine-tune the listing below.'
          />

          <div className='hidden items-center gap-2 md:flex'>
            <Button
              onClick={() => setImportDialogOpen(true)}
              variant='outline'
              size='sm'
              className='shrink-0 items-center gap-2'>
              <Upload className='h-4 w-4' />
              Upload CSV
            </Button>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              variant='outline'
              size='sm'
              className='shrink-0 items-center gap-2'>
              <Plus className='h-4 w-4' />
              Add role
            </Button>
          </div>
        </div>

        <JobFilters
          search={search}
          onSearchChange={setSearch}
          departments={departmentOptions}
          locations={locationOptions}
          workTypes={workTypeOptions}
          employmentTypes={employmentOptions}
          departmentValue={departmentFilter}
          locationValue={locationFilter}
          workTypeValue={workTypeFilter}
          employmentTypeValue={employmentFilter}
          onDepartmentChange={setDepartmentFilter}
          onLocationChange={setLocationFilter}
          onWorkTypeChange={setWorkTypeFilter}
          onEmploymentTypeChange={setEmploymentFilter}
          className='mb-8'
        />

        <div className='space-y-3'>
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onUpdateLocal={updateJobLocal}
              onSaveField={saveJob}
              onDelete={() => handleDeleteJob(job.id)}
              onApplyClick={() =>
                openApplyUrlDialog(job.id, job.apply_url || '')
              }
            />
          ))}
        </div>

        <div className='mt-8 flex gap-3 md:hidden'>
          <Button
            variant='outline'
            size='sm'
            className='flex-1'
            onClick={() => setImportDialogOpen(true)}>
            <Upload className='h-4 w-4' />
            Upload CSV
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex-1'
            onClick={() => setCreateDialogOpen(true)}>
            <Plus className='h-4 w-4' />
            Add role
          </Button>
        </div>
      </div>

      <ApplyLinkDialog
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
        value={applyUrl}
        onChange={setApplyUrl}
        onConfirm={confirmApplyUrl}
      />

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Upload CSV of roles</DialogTitle>
            <DialogDescription>
              Use the headers below. We will create a role for each row.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-5'>
            <div
              className={`rounded-2xl border bg-card text-foreground p-6 transition-colors ${
                isDragging ? 'border-primary/70 bg-primary/5' : 'border-border'
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}>
              <div className='flex flex-col items-center gap-4 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-primary/70 bg-primary/10'>
                  <UploadCloud className='h-7 w-7 text-primary' />
                </div>
                <div>
                  <p className='text-lg font-semibold'>Drag and drop or</p>
                  <p className='text-sm text-muted-foreground'>
                    CSV file up to 5 MB
                  </p>
                </div>
                <Button
                  type='button'
                  className='px-6 text-sm font-semibold'
                  onClick={() => csvInputRef.current?.click()}>
                  Upload CSV
                </Button>
                <p className='text-xs text-muted-foreground'>
                  or drag and drop your file here
                </p>
              </div>
              <input
                ref={csvInputRef}
                type='file'
                accept='.csv,text/csv'
                className='hidden'
                onChange={(e) => onFileChange(e.target.files?.[0])}
              />
            </div>

            <div className='rounded-md bg-muted/50 p-3 text-xs font-mono text-muted-foreground'>
              title,department,location,work_type,employment_type,description,apply_url
            </div>
            <p className='text-xs text-muted-foreground'>
              Examples: work_type = remote | hybrid | onsite. employment_type =
              full-time | part-time | contract | internship.
            </p>
            {parsedRows.length > 0 && (
              <p className='text-sm text-foreground'>
                {parsedRows.length} rows ready to import.
              </p>
            )}
            {importError && (
              <p className='text-sm text-destructive'>{importError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setImportDialogOpen(false)}
              disabled={importing}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const success = await importCsv()
                if (success) setImportDialogOpen(false)
              }}
              disabled={importing}>
              {importing ? 'Importing...' : 'Import roles'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateJobDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateJob}
      />
    </section>
  )
}
