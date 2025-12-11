'use client'

import { useState } from 'react'

import { ShakeContainer } from '@/components/common/ValidateInput'
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

type CreateJobDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (values: CreateJobFormState) => Promise<boolean>
}

export type CreateJobFormState = {
  title: string
  department: string
  location: string
  workType: string
  employmentType: string
  description: string
  applyUrl: string
}

export function CreateJobDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateJobDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof CreateJobFormState, string>>>(
    {}
  )
  const [form, setForm] = useState<CreateJobFormState>({
    title: '',
    department: '',
    location: '',
    workType: '',
    employmentType: '',
    description: '',
    applyUrl: '',
  })

  function validate(values: CreateJobFormState) {
    const nextErrors: typeof errors = {}
    if (!values.title.trim()) nextErrors.title = 'Title is required'
    if (!values.department.trim()) nextErrors.department = 'Department is required'
    if (!values.location.trim()) nextErrors.location = 'Location is required'
    if (!values.workType) nextErrors.workType = 'Work type is required'
    if (!values.employmentType) nextErrors.employmentType = 'Employment type is required'
    if (!values.description.trim()) nextErrors.description = 'Description is required'
    if (!values.applyUrl.trim()) nextErrors.applyUrl = 'Apply URL is required'
    return nextErrors
  }

  async function handleCreate() {
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setSubmitting(true)
    const success = await onCreate(form)
    setSubmitting(false)
    if (success) {
      setForm({
        title: '',
        department: '',
        location: '',
        workType: '',
        employmentType: '',
        description: '',
        applyUrl: '',
      })
      setErrors({})
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <ShakeContainer active={!!errors.title}>
              <Input
                value={form.title}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
                }}
                placeholder='Senior Product Designer'
                className={
                  errors.title
                    ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                    : undefined
                }
              />
            </ShakeContainer>
            {errors.title && (
              <p className='mt-1 text-xs text-destructive'>{errors.title}</p>
            )}
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Department
              </label>
              <ShakeContainer active={!!errors.department}>
                <Input
                  value={form.department}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, department: e.target.value }))
                    if (errors.department)
                      setErrors((prev) => ({ ...prev, department: undefined }))
                  }}
                  placeholder='Design'
                  className={
                    errors.department
                      ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                      : undefined
                  }
                />
              </ShakeContainer>
              {errors.department && (
                <p className='mt-1 text-xs text-destructive'>{errors.department}</p>
              )}
            </div>

            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Location
              </label>
              <ShakeContainer active={!!errors.location}>
                <Input
                  value={form.location}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                    if (errors.location)
                      setErrors((prev) => ({ ...prev, location: undefined }))
                  }}
                  placeholder='San Francisco, CA'
                  className={
                    errors.location
                      ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                      : undefined
                  }
                />
              </ShakeContainer>
              {errors.location && (
                <p className='mt-1 text-xs text-destructive'>{errors.location}</p>
              )}
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Work type
              </label>
              <ShakeContainer active={!!errors.workType}>
                <select
                  value={form.workType}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, workType: e.target.value }))
                    if (errors.workType)
                      setErrors((prev) => ({ ...prev, workType: undefined }))
                  }}
                  className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs md:text-sm ${
                    errors.workType
                      ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                      : ''
                  }`}>
                  <option value=''>Select work type</option>
                  <option value='remote'>Remote</option>
                  <option value='hybrid'>Hybrid</option>
                  <option value='onsite'>On-site</option>
                </select>
              </ShakeContainer>
              {errors.workType && (
                <p className='mt-1 text-xs text-destructive'>{errors.workType}</p>
              )}
            </div>

            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Employment type
              </label>
              <ShakeContainer active={!!errors.employmentType}>
                <select
                  value={form.employmentType}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, employmentType: e.target.value }))
                    if (errors.employmentType)
                      setErrors((prev) => ({ ...prev, employmentType: undefined }))
                  }}
                  className={`mt-1 w-full rounded-md border bg-background px-3 py-2 text-xs md:text-sm ${
                    errors.employmentType
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
              {errors.employmentType && (
                <p className='mt-1 text-xs text-destructive'>
                  {errors.employmentType}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className='text-xs font-medium text-muted-foreground'>
              Description
            </label>
            <ShakeContainer active={!!errors.description}>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                  if (errors.description)
                    setErrors((prev) => ({ ...prev, description: undefined }))
                }}
                placeholder='Describe the role, responsibilities, and what success looks like.'
                className={`mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs ${
                  errors.description
                    ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                    : 'border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
                }`}
              />
            </ShakeContainer>
            {errors.description && (
              <p className='mt-1 text-xs text-destructive'>{errors.description}</p>
            )}
          </div>

          <div>
            <label className='text-xs font-medium text-muted-foreground'>
              Apply URL
            </label>
            <ShakeContainer active={!!errors.applyUrl}>
              <Input
                value={form.applyUrl}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, applyUrl: e.target.value }))
                  if (errors.applyUrl)
                    setErrors((prev) => ({ ...prev, applyUrl: undefined }))
                }}
                placeholder='https://example.com/apply'
                className={
                  errors.applyUrl
                    ? 'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40'
                    : undefined
                }
              />
            </ShakeContainer>
            {errors.applyUrl && (
              <p className='mt-1 text-xs text-destructive'>{errors.applyUrl}</p>
            )}
          </div>
        </div>

        <DialogFooter className='mt-6'>
          <Button
            variant='outline'
            disabled={submitting}
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={submitting} onClick={handleCreate}>
            {submitting ? 'Creating...' : 'Create role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
