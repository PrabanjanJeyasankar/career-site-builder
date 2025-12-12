// LocationsHeader.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import { SectionHeading } from '../section-heading'

type LocationsHeaderProps = {
  onAddLocation: () => void
}

export function LocationsHeader({ onAddLocation }: LocationsHeaderProps) {
  return (
    <div className='mb-16 flex items-baseline justify-between gap-4'>
      <SectionHeading
        eyebrow='Locations'
        title='Where we work from'
        description='Show the hubs and spaces where your teams collaborate.'
      />

      <Button
        onClick={onAddLocation}
        variant='outline'
        size='sm'
        className='hidden shrink-0 items-center gap-2 md:inline-flex'>
        <Plus className='h-4 w-4' />
        Add location
      </Button>
    </div>
  )
}
