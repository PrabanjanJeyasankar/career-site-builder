// LocationCard.tsx
import { Button } from '@/components/ui/button'
import type { Location } from '@/types/database'
import { MapPin, Replace } from 'lucide-react'
import Image from 'next/image'
import type { RefObject } from 'react'
import { InlineDeleteButton } from '../inline-delete-button'

type LocationCardProps = {
  location: Location
  isEditingCity: boolean
  isEditingCountry: boolean
  isEditingAddress: boolean
  cityRef: RefObject<HTMLInputElement | null>
  countryRef: RefObject<HTMLInputElement | null>
  addressRef: RefObject<HTMLTextAreaElement | null>
  onCityDoubleClick: () => void
  onCountryDoubleClick: () => void
  onAddressDoubleClick: () => void
  onCityChange: (value: string) => void
  onCountryChange: (value: string) => void
  onAddressChange: (value: string) => void
  onCityBlur: () => void
  onCountryBlur: () => void
  onAddressBlur: () => void
  onCityKeyDown: (key: string) => void
  onCountryKeyDown: (key: string) => void
  onAddressKeyDown: (key: string, ctrlKey: boolean) => void
  onDelete: () => void
  onOpenImageDialog: () => void
  onOpenMapDialog: () => void
}

export function LocationCard({
  location,
  isEditingCity,
  isEditingCountry,
  isEditingAddress,
  cityRef,
  countryRef,
  addressRef,
  onCityDoubleClick,
  onCountryDoubleClick,
  onAddressDoubleClick,
  onCityChange,
  onCountryChange,
  onAddressChange,
  onCityBlur,
  onCountryBlur,
  onAddressBlur,
  onCityKeyDown,
  onCountryKeyDown,
  onAddressKeyDown,
  onDelete,
  onOpenImageDialog,
  onOpenMapDialog,
}: LocationCardProps) {
  return (
    <div className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card'>
      <div className='absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity'>
        <InlineDeleteButton onClick={onDelete} />
      </div>

      <div className='group/image relative h-40 w-full bg-chart-3/10'>
        {location.image_url ? (
          <Image
            src={location.image_url}
            alt={`${location.city}, ${location.country}`}
            fill
            sizes='100vw'
            className='object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-chart-3'>
            <MapPin className='h-10 w-10' />
          </div>
        )}

        <div className='absolute bottom-2 right-2 opacity-0 transition-opacity group-hover/image:opacity-100'>
          <Button
            size='sm'
            variant='secondary'
            onClick={onOpenImageDialog}
            className='h-8 px-2 text-xs flex items-center gap-1 text-white'>
            <Replace className='h-3 w-3 text' />
            Image
          </Button>
        </div>
      </div>

      <div className='flex flex-1 flex-col gap-2.5 p-5'>
        <div
          onClick={(e) => e.detail === 2 && onCityDoubleClick()}
          className='mb-0.5'>
          {isEditingCity ? (
            <input
              ref={cityRef}
              value={location.city}
              onChange={(e) => onCityChange(e.target.value)}
              onBlur={onCityBlur}
              onKeyDown={(e) => onCityKeyDown(e.key)}
              className='w-full bg-transparent text-sm font-semibold text-foreground outline-none md:text-base'
              placeholder='City'
            />
          ) : (
            <h3 className='cursor-text text-sm font-semibold text-foreground md:text-base'>
              {location.city}
            </h3>
          )}
        </div>

        <div
          onClick={(e) => e.detail === 2 && onCountryDoubleClick()}
          className='mb-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
          {isEditingCountry ? (
            <input
              ref={countryRef}
              value={location.country}
              onChange={(e) => onCountryChange(e.target.value)}
              onBlur={onCountryBlur}
              onKeyDown={(e) => onCountryKeyDown(e.key)}
              className='w-full bg-transparent text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground outline-none'
              placeholder='Country'
            />
          ) : (
            <p className='cursor-text text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
              {location.country}
            </p>
          )}
        </div>

        <div
          onClick={(e) => e.detail === 2 && onAddressDoubleClick()}
          className='mb-3'>
          {isEditingAddress ? (
            <textarea
              ref={addressRef}
              value={location.address || ''}
              onChange={(e) => onAddressChange(e.target.value)}
              onBlur={onAddressBlur}
              onKeyDown={(e) => onAddressKeyDown(e.key, e.ctrlKey)}
              rows={2}
              className='w-full resize-none bg-transparent text-xs text-muted-foreground outline-none md:text-sm'
              placeholder='Add address...'
            />
          ) : (
            <p className='cursor-text text-xs text-muted-foreground md:text-sm'>
              {location.address || 'Add address...'}
            </p>
          )}
        </div>

        <div className='mt-auto flex justify-end'>
          <Button
            size='sm'
            variant='outline'
            onClick={onOpenMapDialog}
            className='inline-flex items-center justify-center gap-2 rounded-full px-3 text-[0.7rem]'>
            <MapPin className='h-3 w-3' />
            {location.map_url ? 'Update map link' : 'Add map link'}
          </Button>
        </div>
      </div>
    </div>
  )
}
