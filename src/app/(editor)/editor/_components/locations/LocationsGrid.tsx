// LocationsGrid.tsx
import { Button } from '@/components/ui/button'
import type { Location } from '@/types/database'
import { Plus } from 'lucide-react'
import type { RefObject } from 'react'

import { LocationCard } from './LocationCard'

type LocationsGridProps = {
  locations: Location[]
  editingCity: string | null
  editingCountry: string | null
  editingAddress: string | null
  cityRef: RefObject<HTMLInputElement | null>
  countryRef: RefObject<HTMLInputElement | null>
  addressRef: RefObject<HTMLTextAreaElement | null>
  onSetEditingCity: (id: string | null) => void
  onSetEditingCountry: (id: string | null) => void
  onSetEditingAddress: (id: string | null) => void
  onUpdateField: (id: string, field: keyof Location, value: string) => void
  onSaveField: (id: string, patch: Partial<Location>) => void
  onDelete: (id: string) => void
  onOpenImageDialog: (id: string) => void
  onOpenMapDialog: (id: string, currentUrl: string) => void
  onAddLocation: () => void
}

export function LocationsGrid({
  locations,
  editingCity,
  editingCountry,
  editingAddress,
  cityRef,
  countryRef,
  addressRef,
  onSetEditingCity,
  onSetEditingCountry,
  onSetEditingAddress,
  onUpdateField,
  onSaveField,
  onDelete,
  onOpenImageDialog,
  onOpenMapDialog,
  onAddLocation,
}: LocationsGridProps) {
  return (
    <>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            isEditingCity={editingCity === location.id}
            isEditingCountry={editingCountry === location.id}
            isEditingAddress={editingAddress === location.id}
            cityRef={cityRef}
            countryRef={countryRef}
            addressRef={addressRef}
            onCityDoubleClick={() => onSetEditingCity(location.id)}
            onCountryDoubleClick={() => onSetEditingCountry(location.id)}
            onAddressDoubleClick={() => onSetEditingAddress(location.id)}
            onCityChange={(value) => onUpdateField(location.id, 'city', value)}
            onCountryChange={(value) =>
              onUpdateField(location.id, 'country', value)
            }
            onAddressChange={(value) =>
              onUpdateField(location.id, 'address', value)
            }
            onCityBlur={() => {
              onSaveField(location.id, { city: location.city })
              onSetEditingCity(null)
            }}
            onCountryBlur={() => {
              onSaveField(location.id, { country: location.country })
              onSetEditingCountry(null)
            }}
            onAddressBlur={() => {
              onSaveField(location.id, { address: location.address })
              onSetEditingAddress(null)
            }}
            onCityKeyDown={(key) => {
              if (key === 'Enter') {
                onSaveField(location.id, { city: location.city })
                onSetEditingCity(null)
              }
            }}
            onCountryKeyDown={(key) => {
              if (key === 'Enter') {
                onSaveField(location.id, { country: location.country })
                onSetEditingCountry(null)
              }
            }}
            onAddressKeyDown={(key, ctrlKey) => {
              if (key === 'Enter' && ctrlKey) {
                onSaveField(location.id, { address: location.address })
                onSetEditingAddress(null)
              }
            }}
            onDelete={() => onDelete(location.id)}
            onOpenImageDialog={() => onOpenImageDialog(location.id)}
            onOpenMapDialog={() =>
              onOpenMapDialog(location.id, location.map_url || '')
            }
          />
        ))}
      </div>

      <div className='mt-10 text-center md:hidden'>
        <Button
          onClick={onAddLocation}
          variant='outline'
          size='sm'
          className='inline-flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          Add location
        </Button>
      </div>
    </>
  )
}
