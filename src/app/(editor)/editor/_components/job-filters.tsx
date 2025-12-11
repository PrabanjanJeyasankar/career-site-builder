'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Option = {
  label: string
  value: string
}

type JobFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  departments: Option[]
  locations: Option[]
  workTypes: Option[]
  employmentTypes: Option[]
  departmentValue: string
  locationValue: string
  workTypeValue: string
  employmentTypeValue: string
  onDepartmentChange: (value: string) => void
  onLocationChange: (value: string) => void
  onWorkTypeChange: (value: string) => void
  onEmploymentTypeChange: (value: string) => void
  className?: string
}

export function JobFilters({
  search,
  onSearchChange,
  departments,
  locations,
  workTypes,
  employmentTypes,
  departmentValue,
  locationValue,
  workTypeValue,
  employmentTypeValue,
  onDepartmentChange,
  onLocationChange,
  onWorkTypeChange,
  onEmploymentTypeChange,
  className,
}: JobFiltersProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className='w-full md:max-w-sm'>
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search roles, teams, locations...'
          className='h-9 bg-background text-sm'
        />
      </div>

      <div className='flex flex-wrap gap-2 text-[0.68rem]'>
        <FilterSelect
          label='Team'
          value={departmentValue}
          onChange={onDepartmentChange}
          options={departments}
        />
        <FilterSelect
          label='Location'
          value={locationValue}
          onChange={onLocationChange}
          options={locations}
        />
        <FilterSelect
          label='Work type'
          value={workTypeValue}
          onChange={onWorkTypeChange}
          options={workTypes}
        />
        <FilterSelect
          label='Employment'
          value={employmentTypeValue}
          onChange={onEmploymentTypeChange}
          options={employmentTypes}
        />
      </div>
    </div>
  )
}

type FilterSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  if (options.length === 0) return null

  return (
    <label className='inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-1'>
      <span className='text-muted-foreground hidden md:inline'>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='bg-transparent text-xs outline-none'>
        <option value='all'>All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
