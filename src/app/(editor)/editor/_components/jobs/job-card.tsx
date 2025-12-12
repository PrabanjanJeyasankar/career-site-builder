import { InlineDeleteButton } from '@/app/(editor)/editor/_components/inline-delete-button'
import { cn } from '@/lib/utils'
import type { Job } from '@/types/database'
import { ArrowBigUpDash, ExternalLink, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type JobCardProps = {
  job: Job
  onUpdateLocal: (id: string, patch: Partial<Job>) => void
  onSaveField: (id: string, patch: Partial<Job>) => void
  onDelete: () => void
  onApplyClick: () => void
}

export function JobCard({
  job,
  onUpdateLocal,
  onSaveField,
  onDelete,
  onApplyClick,
}: JobCardProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(false)
  const [editingLocation, setEditingLocation] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)

  const titleRef = useRef<HTMLInputElement | null>(null)
  const departmentRef = useRef<HTMLInputElement | null>(null)
  const locationRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

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

  return (
    <div className='group relative rounded-xl border border-border/70 bg-card/60 px-4 py-4 md:px-5 md:py-5'>
      <div className='absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100'>
        <InlineDeleteButton onClick={onDelete} />
      </div>

      <div className='grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,1.75fr)]'>
        <div className='space-y-3'>
          <div onClick={(e) => e.detail === 2 && setEditingTitle(true)}>
            {editingTitle ? (
              <input
                ref={titleRef}
                value={job.title}
                onChange={(e) =>
                  onUpdateLocal(job.id, { title: e.target.value })
                }
                onBlur={() => {
                  onSaveField(job.id, { title: job.title })
                  setEditingTitle(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSaveField(job.id, { title: job.title })
                    setEditingTitle(false)
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

          <div className='flex flex-wrap gap-3 text-xs text-muted-foreground md:text-[0.8rem]'>
            <div onClick={(e) => e.detail === 2 && setEditingDepartment(true)}>
              {editingDepartment ? (
                <input
                  ref={departmentRef}
                  value={job.department}
                  onChange={(e) =>
                    onUpdateLocal(job.id, { department: e.target.value })
                  }
                  onBlur={() => {
                    onSaveField(job.id, { department: job.department })
                    setEditingDepartment(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSaveField(job.id, { department: job.department })
                      setEditingDepartment(false)
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

            <div onClick={(e) => e.detail === 2 && setEditingLocation(true)}>
              {editingLocation ? (
                <input
                  ref={locationRef}
                  value={job.location}
                  onChange={(e) =>
                    onUpdateLocal(job.id, { location: e.target.value })
                  }
                  onBlur={() => {
                    onSaveField(job.id, { location: job.location })
                    setEditingLocation(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSaveField(job.id, { location: job.location })
                      setEditingLocation(false)
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

            <select
              value={job.work_type}
              onChange={(e) => {
                const workType = e.target.value as Job['work_type']
                onUpdateLocal(job.id, { work_type: workType })
                onSaveField(job.id, { work_type: workType })
              }}
              className='bg-transparent text-xs outline-none md:text-[0.8rem]'>
              <option value='remote'>Remote</option>
              <option value='hybrid'>Hybrid</option>
              <option value='onsite'>On-site</option>
            </select>
            <span>•</span>

            <select
              value={job.employment_type}
              onChange={(e) => {
                const employmentType = e.target.value as Job['employment_type']
                onUpdateLocal(job.id, { employment_type: employmentType })
                onSaveField(job.id, { employment_type: employmentType })
              }}
              className='bg-transparent text-xs outline-none md:text-[0.8rem]'>
              <option value='full-time'>Full-time</option>
              <option value='part-time'>Part-time</option>
              <option value='contract'>Contract</option>
              <option value='internship'>Internship</option>
            </select>
          </div>

          <div onClick={(e) => e.detail === 2 && setEditingDescription(true)}>
            {editingDescription ? (
              <div className='relative w-full'>
                <textarea
                  ref={descriptionRef}
                  value={job.description}
                  onChange={(e) =>
                    onUpdateLocal(job.id, { description: e.target.value })
                  }
                  onBlur={() => {
                    onSaveField(job.id, { description: job.description })
                    setEditingDescription(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      onSaveField(job.id, { description: job.description })
                      setEditingDescription(false)
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

        <div className='flex flex-col justify-between gap-3 text-xs md:text-[0.8rem]'>
          {job.apply_url ? (
            <a
              href={job.apply_url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center gap-2 self-end rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
              Apply Now
              <ExternalLink className='h-4 w-4' />
            </a>
          ) : (
            <div className='rounded-full bg-muted px-4 py-2 text-center text-muted-foreground'>
              No apply link
            </div>
          )}

          <button
            type='button'
            onClick={onApplyClick}
            className={cn(
              'inline-flex h-8 w-fit items-center justify-center gap-1.5 self-end rounded-full border border-border px-3 text-[0.7rem] transition-colors',
              'hover:border-primary hover:text-primary'
            )}>
            {job.apply_url ? (
              <>
                <ArrowBigUpDash className='h-3.5 w-3.5' />
                <span>Update Link</span>
              </>
            ) : (
              <>
                <Plus className='h-3.5 w-3.5' />
                <span>Add Apply Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
