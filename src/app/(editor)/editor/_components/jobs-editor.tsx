/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShakeContainer } from '@/components/common/ValidateInput'
import { Input } from '@/components/ui/input'
import {
  createJobInline,
  deleteJobInline,
  saveJobInline,
} from '@/lib/actions/jobsInline'
import type { Job } from '@/types/database'
import { ExternalLink, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { InlineDeleteButton } from './inline-delete-button'
import { SectionHeading } from './section-heading'
import { JobFilters } from './job-filters'
import { ValidatedPromptDialog } from './validated-prompt-dialog'

type EditorProps = {
  initial: Job[]
}

export function JobsEditor({ initial }: EditorProps) {
  const [jobs, setJobs] = useState(initial)

  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [editingDepartment, setEditingDepartment] = useState<string | null>(
    null
  )
  const [editingLocation, setEditingLocation] = useState<string | null>(null)
  const [editingDescription, setEditingDescription] = useState<string | null>(
    null
  )

  const titleRef = useRef<HTMLInputElement | null>(null)
  const departmentRef = useRef<HTMLInputElement | null>(null)
  const locationRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogUrl, setDialogUrl] = useState('')
  const [dialogJobId, setDialogJobId] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: '',
    department: '',
    location: '',
    workType: '',
    employmentType: '',
    description: '',
    applyUrl: '',
  })
  const [createErrors, setCreateErrors] = useState<{
    title?: string
    department?: string
    location?: string
    workType?: string
    employmentType?: string
    description?: string
    applyUrl?: string
  }>({})

  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [workTypeFilter, setWorkTypeFilter] = useState('all')
  const [employmentFilter, setEmploymentFilter] = useState('all')

  async function save(id: string, patch: Partial<Job>) {
    // Find the current job to get required fields
    const currentJob = jobs.find((j) => j.id === id)
    if (!currentJob) return

    const payload = {
      id,
      title: patch.title ?? currentJob.title,
      department: patch.department ?? currentJob.department,
      location: patch.location ?? currentJob.location,
      workType: patch.work_type ?? currentJob.work_type,
      employmentType: patch.employment_type ?? currentJob.employment_type,
      description: patch.description ?? currentJob.description,
      applyUrl:
        patch.apply_url !== null && patch.apply_url !== undefined
          ? patch.apply_url
          : currentJob.apply_url !== null && currentJob.apply_url !== undefined
          ? currentJob.apply_url
          : undefined,
    }

    try {
      const result = await saveJobInline(payload)
      if (!result.success) {
        console.error('Save failed:', result.error)
      }
    } catch (error) {
      console.error('Save failed', error)
    }
  }

  async function addJob() {
    setCreateForm({
      title: '',
      department: '',
      location: '',
      workType: '',
      employmentType: '',
      description: '',
      applyUrl: '',
    })
    setCreateErrors({})
    setCreateDialogOpen(true)
  }

  async function deleteJob(id: string) {
    try {
      const result = await deleteJobInline(id)
      if (result.success) {
        setJobs(jobs.filter((j) => j.id !== id))
      }
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  async function saveApplyUrl() {
    if (!dialogJobId) return

    const trimmedUrl = dialogUrl.trim()
    if (!trimmedUrl) return

    const nextJobs = jobs.map((j) =>
      j.id === dialogJobId ? { ...j, apply_url: trimmedUrl } : j
    )
    setJobs(nextJobs)

    await save(dialogJobId, { apply_url: trimmedUrl })
    setDialogOpen(false)
  }

  function openApplyUrlDialog(jobId: string, currentUrl: string) {
    setDialogJobId(jobId)
    setDialogUrl(currentUrl || '')
    setDialogOpen(true)
  }

  useEffect(() => {
    if (editingTitle && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
    }
  }, [editingTitle])

  useEffect(() => {
    if (editingDepartment && departmentRef.current) {
      departmentRef.current.focus()
      departmentRef.current.select()
    }
  }, [editingDepartment])

  useEffect(() => {
    if (editingLocation && locationRef.current) {
      locationRef.current.focus()
      locationRef.current.select()
    }
  }, [editingLocation])

  useEffect(() => {
    if (editingDescription && descriptionRef.current) {
      const el = descriptionRef.current
      el.focus()
      const len = el.value.length
      el.setSelectionRange(len, len)
    }
  }, [editingDescription])

  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((j) => j.department).filter(Boolean))).map(
        (value) => ({ value, label: value })
      ),
    [jobs]
  )

  const locationOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))).map(
        (value) => ({ value, label: value })
      ),
    [jobs]
  )

  const workTypeOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((j) => j.work_type).filter(Boolean))).map(
        (value) => ({ value, label: value.replace('-', ' ') })
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

  return (
    <section className='w-full bg-background py-16'>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-10 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Open roles'
            title='Join the team'
            description='Search by role, team or location and fine-tune the listing below.'
          />

          <Button
            onClick={addJob}
            variant='outline'
            size='sm'
            className='hidden shrink-0 items-center gap-2 md:inline-flex'>
            <Plus className='h-4 w-4' />
            Add role
          </Button>
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
            <div
              key={job.id}
              className='group relative rounded-xl border border-border/70 bg-card/60 px-4 py-4 md:px-5 md:py-5'>
              <div className='absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100'>
                <InlineDeleteButton onClick={() => deleteJob(job.id)} />
              </div>

              <div className='grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,1.75fr)]'>
                {/* Left: Job Info */}
                <div className='space-y-3'>
                  {/* Title */}
                  <div
                    onClick={(e) => e.detail === 2 && setEditingTitle(job.id)}>
                    {editingTitle === job.id ? (
                      <input
                        ref={titleRef}
                        value={job.title}
                        onChange={(e) =>
                          setJobs(
                            jobs.map((j) =>
                              j.id === job.id
                                ? { ...j, title: e.target.value }
                                : j
                            )
                          )
                        }
                        onBlur={() => {
                          save(job.id, { title: job.title })
                          setEditingTitle(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            save(job.id, { title: job.title })
                            setEditingTitle(null)
                          }
                        }}
                        className='w-full bg-transparent text-base font-semibold text-foreground outline-none md:text-lg'
                        placeholder='Job Title'
                      />
                    ) : (
                      <h3 className='cursor-text text-base font-semibold text-foreground md:text-lg'>
                        {job.title}
                      </h3>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className='flex flex-wrap gap-3 text-xs text-muted-foreground md:text-[0.8rem]'>
                    {/* Department */}
                    <div
                      onClick={(e) =>
                        e.detail === 2 && setEditingDepartment(job.id)
                      }>
                      {editingDepartment === job.id ? (
                        <input
                          ref={departmentRef}
                          value={job.department}
                          onChange={(e) =>
                            setJobs(
                              jobs.map((j) =>
                                j.id === job.id
                                  ? { ...j, department: e.target.value }
                                  : j
                              )
                            )
                          }
                          onBlur={() => {
                            save(job.id, { department: job.department })
                            setEditingDepartment(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              save(job.id, { department: job.department })
                              setEditingDepartment(null)
                            }
                          }}
                          className='min-w-24 bg-transparent text-xs outline-none md:text-[0.8rem]'
                          placeholder='Department'
                        />
                      ) : (
                        <span className='cursor-text'>{job.department}</span>
                      )}
                    </div>
                    <span>•</span>

                    {/* Location */}
                    <div
                      onClick={(e) =>
                        e.detail === 2 && setEditingLocation(job.id)
                      }>
                      {editingLocation === job.id ? (
                        <input
                          ref={locationRef}
                          value={job.location}
                          onChange={(e) =>
                            setJobs(
                              jobs.map((j) =>
                                j.id === job.id
                                  ? { ...j, location: e.target.value }
                                  : j
                              )
                            )
                          }
                          onBlur={() => {
                            save(job.id, { location: job.location })
                            setEditingLocation(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              save(job.id, { location: job.location })
                              setEditingLocation(null)
                            }
                          }}
                          className='bg-transparent outline-none min-w-24'
                          placeholder='Location'
                        />
                      ) : (
                        <span className='cursor-text'>{job.location}</span>
                      )}
                    </div>
                    <span>•</span>

                    {/* Work Type */}
                    <select
                      value={job.work_type}
                      onChange={(e) => {
                        const nextJobs = jobs.map((j) =>
                          j.id === job.id
                            ? { ...j, work_type: e.target.value as any }
                            : j
                        )
                        setJobs(nextJobs)
                        save(job.id, { work_type: e.target.value as any })
                      }}
                      className='bg-transparent text-xs outline-none md:text-[0.8rem]'>
                      <option value='remote'>Remote</option>
                      <option value='hybrid'>Hybrid</option>
                      <option value='onsite'>On-site</option>
                    </select>
                    <span>•</span>

                    {/* Employment Type */}
                    <select
                      value={job.employment_type}
                      onChange={(e) => {
                        const nextJobs = jobs.map((j) =>
                          j.id === job.id
                            ? { ...j, employment_type: e.target.value as any }
                            : j
                        )
                        setJobs(nextJobs)
                        save(job.id, { employment_type: e.target.value as any })
                      }}
                      className='bg-transparent text-xs outline-none md:text-[0.8rem]'>
                      <option value='full-time'>Full-time</option>
                      <option value='part-time'>Part-time</option>
                      <option value='contract'>Contract</option>
                      <option value='internship'>Internship</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div
                    onClick={(e) =>
                      e.detail === 2 && setEditingDescription(job.id)
                    }>
                    {editingDescription === job.id ? (
                      <div className='relative w-full'>
                        <textarea
                          ref={descriptionRef}
                          value={job.description}
                          onChange={(e) =>
                            setJobs(
                              jobs.map((j) =>
                                j.id === job.id
                                  ? { ...j, description: e.target.value }
                                  : j
                              )
                            )
                          }
                          onBlur={() => {
                            save(job.id, { description: job.description })
                            setEditingDescription(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              save(job.id, { description: job.description })
                              setEditingDescription(null)
                            }
                          }}
                          rows={3}
                          className='w-full resize-none bg-transparent pr-6 text-sm leading-relaxed text-muted-foreground outline-none md:text-base'
                          placeholder='Add job description...'
                        />
                        <div className='pointer-events-none absolute bottom-1.5 right-1.5 text-[0.7rem] text-muted-foreground/60'>
                          ↕︎
                        </div>
                      </div>
                    ) : (
                      <p className='cursor-text text-sm leading-relaxed text-muted-foreground md:text-base'>
                        {job.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Apply / Meta */}
                <div className='flex flex-col justify-between gap-3 text-xs md:text-[0.8rem]'>
                  {job.apply_url ? (
                    <a
                      href={job.apply_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90'>
                      Apply Now
                      <ExternalLink className='h-4 w-4' />
                    </a>
                  ) : (
                    <div className='rounded-full bg-muted px-4 py-2 text-center text-muted-foreground'>
                      No apply link
                    </div>
                  )}

                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() =>
                      openApplyUrlDialog(job.id, job.apply_url || '')
                    }
                    className='h-8 justify-center rounded-full px-3 text-[0.7rem]'>
                    {job.apply_url ? 'Update Link' : 'Add Apply Link'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <ValidatedPromptDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title='Add apply link'
        description='Paste the URL where candidates can apply for this position.'
        label='Apply URL'
        placeholder='https://example.com/apply'
        value={dialogUrl}
        onValueChange={setDialogUrl}
        onConfirm={saveApplyUrl}
      />

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Add new role</DialogTitle>
            <DialogDescription>
              Fill in all fields to create a new job posting.
            </DialogDescription>
          </DialogHeader>

          <div className='mt-4 space-y-4'>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Title
              </label>
              <ShakeContainer active={!!createErrors.title}>
                <Input
                  value={createForm.title}
                  onChange={(e) => {
                    setCreateForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                    if (createErrors.title) {
                      setCreateErrors((prev) => ({ ...prev, title: undefined }))
                    }
                  }}
                  placeholder='Senior Product Designer'
                  className={
                    createErrors.title
                      ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                      : undefined
                  }
                />
              </ShakeContainer>
              {createErrors.title && (
                <p className='mt-1 text-xs text-destructive'>
                  {createErrors.title}
                </p>
              )}
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <label className='text-xs font-medium text-muted-foreground'>
                  Department
                </label>
                <ShakeContainer active={!!createErrors.department}>
                  <Input
                    value={createForm.department}
                    onChange={(e) => {
                      setCreateForm((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                      if (createErrors.department) {
                        setCreateErrors((prev) => ({
                          ...prev,
                          department: undefined,
                        }))
                      }
                    }}
                    placeholder='Design'
                    className={
                      createErrors.department
                        ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                        : undefined
                    }
                  />
                </ShakeContainer>
                {createErrors.department && (
                  <p className='mt-1 text-xs text-destructive'>
                    {createErrors.department}
                  </p>
                )}
              </div>

              <div>
                <label className='text-xs font-medium text-muted-foreground'>
                  Location
                </label>
                <ShakeContainer active={!!createErrors.location}>
                  <Input
                    value={createForm.location}
                    onChange={(e) => {
                      setCreateForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                      if (createErrors.location) {
                        setCreateErrors((prev) => ({
                          ...prev,
                          location: undefined,
                        }))
                      }
                    }}
                    placeholder='San Francisco, CA'
                    className={
                      createErrors.location
                        ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                        : undefined
                    }
                  />
                </ShakeContainer>
                {createErrors.location && (
                  <p className='mt-1 text-xs text-destructive'>
                    {createErrors.location}
                  </p>
                )}
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <label className='text-xs font-medium text-muted-foreground'>
                  Work type
                </label>
                <ShakeContainer active={!!createErrors.workType}>
                  <select
                    value={createForm.workType}
                    onChange={(e) => {
                      setCreateForm((prev) => ({
                        ...prev,
                        workType: e.target.value,
                      }))
                      if (createErrors.workType) {
                        setCreateErrors((prev) => ({
                          ...prev,
                          workType: undefined,
                        }))
                      }
                    }}
                    className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs md:text-sm ${
                      createErrors.workType
                        ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                        : ''
                    }`}>
                    <option value=''>Select work type</option>
                    <option value='remote'>Remote</option>
                    <option value='hybrid'>Hybrid</option>
                    <option value='onsite'>On-site</option>
                  </select>
                </ShakeContainer>
                {createErrors.workType && (
                  <p className='mt-1 text-xs text-destructive'>
                    {createErrors.workType}
                  </p>
                )}
              </div>

              <div>
                <label className='text-xs font-medium text-muted-foreground'>
                  Employment type
                </label>
                <ShakeContainer active={!!createErrors.employmentType}>
                  <select
                    value={createForm.employmentType}
                    onChange={(e) => {
                      setCreateForm((prev) => ({
                        ...prev,
                        employmentType: e.target.value,
                      }))
                      if (createErrors.employmentType) {
                        setCreateErrors((prev) => ({
                          ...prev,
                          employmentType: undefined,
                        }))
                      }
                    }}
                    className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs md:text-sm ${
                      createErrors.employmentType
                        ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                        : ''
                    }`}>
                    <option value=''>Select employment type</option>
                    <option value='full-time'>Full-time</option>
                    <option value='part-time'>Part-time</option>
                    <option value='contract'>Contract</option>
                    <option value='internship'>Internship</option>
                  </select>
                </ShakeContainer>
                {createErrors.employmentType && (
                  <p className='mt-1 text-xs text-destructive'>
                    {createErrors.employmentType}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Description
              </label>
              <ShakeContainer active={!!createErrors.description}>
                <textarea
                  rows={4}
                  value={createForm.description}
                  onChange={(e) => {
                    setCreateForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                    if (createErrors.description) {
                      setCreateErrors((prev) => ({
                        ...prev,
                        description: undefined,
                      }))
                    }
                  }}
                  placeholder='Describe the role, responsibilities, and what success looks like.'
                  className={`mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs ${
                    createErrors.description
                      ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                      : 'border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
                  }`}
                />
              </ShakeContainer>
              {createErrors.description && (
                <p className='mt-1 text-xs text-destructive'>
                  {createErrors.description}
                </p>
              )}
            </div>

            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Apply URL
              </label>
              <ShakeContainer active={!!createErrors.applyUrl}>
                <Input
                  value={createForm.applyUrl}
                  onChange={(e) => {
                    setCreateForm((prev) => ({
                      ...prev,
                      applyUrl: e.target.value,
                    }))
                    if (createErrors.applyUrl) {
                      setCreateErrors((prev) => ({
                        ...prev,
                        applyUrl: undefined,
                      }))
                    }
                  }}
                  placeholder='https://example.com/apply'
                  className={
                    createErrors.applyUrl
                      ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                      : undefined
                  }
                />
              </ShakeContainer>
              {createErrors.applyUrl && (
                <p className='mt-1 text-xs text-destructive'>
                  {createErrors.applyUrl}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className='mt-6'>
            <Button
              variant='outline'
              disabled={createSubmitting}
              onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createSubmitting}
              onClick={async () => {
                const errors: typeof createErrors = {}
                if (!createForm.title.trim()) {
                  errors.title = 'Title is required'
                }
                if (!createForm.department.trim()) {
                  errors.department = 'Department is required'
                }
                if (!createForm.location.trim()) {
                  errors.location = 'Location is required'
                }
                if (!createForm.workType) {
                  errors.workType = 'Work type is required'
                }
                if (!createForm.employmentType) {
                  errors.employmentType = 'Employment type is required'
                }
                if (!createForm.description.trim()) {
                  errors.description = 'Description is required'
                }
                if (!createForm.applyUrl.trim()) {
                  errors.applyUrl = 'Apply URL is required'
                }

                if (Object.keys(errors).length > 0) {
                  setCreateErrors(errors)
                  return
                }

                setCreateSubmitting(true)
                try {
                  const result = await createJobInline({
                    title: createForm.title.trim(),
                    department: createForm.department.trim(),
                    location: createForm.location.trim(),
                    workType: createForm.workType as any,
                    employmentType: createForm.employmentType as any,
                    description: createForm.description.trim(),
                    applyUrl: createForm.applyUrl.trim(),
                  })

                  if (result.success && result.data) {
                    setJobs([...jobs, result.data])
                    setCreateDialogOpen(false)
                  } else if (!result.success && result.error) {
                    console.error('Create failed:', result.error)
                  }
                } catch (error) {
                  console.error('Create failed', error)
                } finally {
                  setCreateSubmitting(false)
                }
              }}>
              {createSubmitting ? 'Creating...' : 'Create role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
