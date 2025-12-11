'use client'

import type { DeviceType } from '@/components/ui/device-switcher'
import type { Job } from '@/types/database'
import { ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { JobFilters } from './job-filters'
import { SectionHeading } from './section-heading'

type JobsPreviewProps = {
  data: Job[]
  device: DeviceType
}

export function JobsPreview({ data, device }: JobsPreviewProps) {
  const sizes = {
    mobile: {
      section: 'py-12',
      title: 'text-base',
      meta: 'text-[0.7rem]',
      description: 'text-xs',
    },
    tablet: {
      section: 'py-14',
      title: 'text-base',
      meta: 'text-xs',
      description: 'text-sm',
    },
    desktop: {
      section: 'py-16',
      title: 'text-base',
      meta: 'text-xs',
      description: 'text-sm',
    },
  }[device]

  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [workTypeFilter, setWorkTypeFilter] = useState('all')
  const [employmentFilter, setEmploymentFilter] = useState('all')

  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(data.map((j) => j.department).filter(Boolean))).map(
        (value) => ({ value, label: value })
      ),
    [data]
  )

  const locationOptions = useMemo(
    () =>
      Array.from(new Set(data.map((j) => j.location).filter(Boolean))).map(
        (value) => ({ value, label: value })
      ),
    [data]
  )

  const workTypeOptions = useMemo(
    () =>
      Array.from(new Set(data.map((j) => j.work_type).filter(Boolean))).map(
        (value) => ({ value, label: value.replace('-', ' ') })
      ),
    [data]
  )

  const employmentOptions = useMemo(
    () =>
      Array.from(
        new Set(data.map((j) => j.employment_type).filter(Boolean))
      ).map((value) => ({ value, label: value.replace('-', ' ') })),
    [data]
  )

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.filter((job) => {
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
    data,
    search,
    departmentFilter,
    locationFilter,
    workTypeFilter,
    employmentFilter,
  ])

  return (
    <section className={`w-full bg-background ${sizes.section}`}>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-10 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Open roles'
            title='Join the team'
            description='Browse open positions and refine by team, location or work style.'
          />
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

        <div className='divide-y divide-border/60'>
          {filteredJobs.map((job) => (
            <article key={job.id} className='py-5 md:py-6'>
              <div className='grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,1.75fr)]'>
                <div className='space-y-3'>
                  <h3
                    className={`${sizes.title} font-semibold tracking-tight text-foreground`}>
                    {job.title}
                  </h3>

                  <div
                    className={`flex flex-wrap gap-3 ${sizes.meta} text-muted-foreground`}>
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className='capitalize'>{job.work_type}</span>
                    <span>•</span>
                    <span className='capitalize'>
                      {job.employment_type.replace('-', ' ')}
                    </span>
                  </div>

                  <p
                    className={`${sizes.description} text-muted-foreground leading-relaxed`}>
                    {job.description}
                  </p>
                </div>

                <div className='flex flex-col justify-center gap-3 text-xs md:text-[0.8rem]'>
                  {job.apply_url ? (
                    <a
                      href={job.apply_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center justify-center gap-2 self-end rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
                      Apply now
                      <ExternalLink className='h-3.5 w-3.5' />
                    </a>
                  ) : (
                    <div className='inline-flex rounded-full bg-muted px-4 py-2 self-end text-center text-muted-foreground cursor-not-allowed'>
                      Apply link coming soon
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
