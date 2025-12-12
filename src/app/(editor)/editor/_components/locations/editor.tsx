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
import { Button } from '@/components/ui/button'
import {
  createLocationInline,
  deleteLocationInline,
  saveLocationInline,
} from '@/lib/actions/locationsInline'
import { ImageUploadDialog } from '@/components/common/ImageUploadDialog'
import type { Location } from '@/types/database'
import { MapPin, Plus, Replace } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { InlineDeleteButton } from '../inline-delete-button'
import { SectionHeading } from '../section-heading'

type EditorProps = {
  initial: Location[]
}

export function LocationsEditor({ initial }: EditorProps) {
  const [locations, setLocations] = useState(initial)

  const [editingCity, setEditingCity] = useState<string | null>(null)
  const [editingCountry, setEditingCountry] = useState<string | null>(null)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)

  const cityRef = useRef<HTMLInputElement | null>(null)
  const countryRef = useRef<HTMLInputElement | null>(null)
  const addressRef = useRef<HTMLTextAreaElement | null>(null)

  const [mapDialogOpen, setMapDialogOpen] = useState(false)
  const [mapDialogUrl, setMapDialogUrl] = useState('')
  const [mapDialogLocationId, setMapDialogLocationId] = useState<string | null>(
    null
  )
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageDialogLocationId, setImageDialogLocationId] = useState<
    string | null
  >(null)

  async function save(id: string, patch: Partial<Location>) {
    // Find the current location to get required fields
    const currentLocation = locations.find((l) => l.id === id)
    if (!currentLocation) return

    const payload = {
      id,
      city: patch.city ?? currentLocation.city,
      country: patch.country ?? currentLocation.country,
      address:
        patch.address !== undefined
          ? patch.address === null
            ? undefined
            : patch.address
          : currentLocation.address === null
          ? undefined
          : currentLocation.address,
      mapUrl:
        patch.map_url !== undefined
          ? patch.map_url === null
            ? undefined
            : patch.map_url
          : currentLocation.map_url === null
          ? undefined
          : currentLocation.map_url,
      imageUrl:
        patch.image_url !== undefined
          ? patch.image_url === null
            ? undefined
            : patch.image_url
          : currentLocation.image_url === null
          ? undefined
          : currentLocation.image_url,
      orderIndex: patch.order_index ?? currentLocation.order_index,
    }

    try {
      const result = await saveLocationInline(payload)
      if (!result.success) {
        console.error('Save failed:', result.error)
      }
    } catch (error) {
      console.error('Save failed', error)
    }
  }

  async function addLocation() {
    try {
      const result = await createLocationInline()
      if (result.success && result.data) {
        setLocations([...locations, result.data])
      }
    } catch (error) {
      console.error('Create failed', error)
    }
  }

  async function deleteLocation(id: string) {
    try {
      const result = await deleteLocationInline(id)
      if (result.success) {
        setLocations(locations.filter((l) => l.id !== id))
      }
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  async function saveMapUrl() {
    if (!mapDialogLocationId) return

    const nextLocations = locations.map((l) =>
      l.id === mapDialogLocationId ? { ...l, map_url: mapDialogUrl } : l
    )
    setLocations(nextLocations)

    await save(mapDialogLocationId, { map_url: mapDialogUrl })
    setMapDialogOpen(false)
  }

  function openMapDialog(locationId: string, currentUrl: string) {
    setMapDialogLocationId(locationId)
    setMapDialogUrl(currentUrl || '')
    setMapDialogOpen(true)
  }

  function openImageDialog(locationId: string) {
    setImageDialogLocationId(locationId)
    setImageDialogOpen(true)
  }

  async function handleImageUpload(url: string) {
    if (!imageDialogLocationId) return

    const nextLocations = locations.map((l) =>
      l.id === imageDialogLocationId ? { ...l, image_url: url } : l
    )
    setLocations(nextLocations)
    await save(imageDialogLocationId, { image_url: url })
    setImageDialogOpen(false)
    setImageDialogLocationId(null)
  }

  useEffect(() => {
    if (editingCity && cityRef.current) {
      cityRef.current.focus()
      cityRef.current.select()
    }
  }, [editingCity])

  useEffect(() => {
    if (editingCountry && countryRef.current) {
      countryRef.current.focus()
      countryRef.current.select()
    }
  }, [editingCountry])

  useEffect(() => {
    if (editingAddress && addressRef.current) {
      const el = addressRef.current
      el.focus()
      const len = el.value.length
      el.setSelectionRange(len, len)
    }
  }, [editingAddress])

  return (
    <section className='w-full bg-background py-16'>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Locations'
            title='Where we work from'
            description='Show the hubs and spaces where your teams collaborate.'
          />

          <Button
            onClick={addLocation}
            variant='outline'
            size='sm'
            className='hidden shrink-0 items-center gap-2 md:inline-flex'>
            <Plus className='h-4 w-4' />
            Add location
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {locations.map((location) => (
            <div
              key={location.id}
              className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card'>
              {/* Delete Button */}
              <div className='absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity'>
                <InlineDeleteButton
                  onClick={() => deleteLocation(location.id)}
                />
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
                    onClick={() => openImageDialog(location.id)}
                    className='h-8 px-2 text-xs flex items-center gap-1'>
                    <Replace className='h-3 w-3 text' />
                    Image
                  </Button>
                </div>
              </div>

              <div className='flex flex-1 flex-col gap-2.5 p-5'>
                {/* City */}
                <div
                  onClick={(e) => e.detail === 2 && setEditingCity(location.id)}
                  className='mb-0.5'>
                  {editingCity === location.id ? (
                    <input
                      ref={cityRef}
                      value={location.city}
                      onChange={(e) =>
                        setLocations(
                          locations.map((l) =>
                            l.id === location.id
                              ? { ...l, city: e.target.value }
                              : l
                          )
                        )
                      }
                      onBlur={() => {
                        save(location.id, { city: location.city })
                        setEditingCity(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          save(location.id, { city: location.city })
                          setEditingCity(null)
                        }
                      }}
                      className='w-full bg-transparent text-sm font-semibold text-foreground outline-none md:text-base'
                      placeholder='City'
                    />
                  ) : (
                    <h3 className='cursor-text text-sm font-semibold text-foreground md:text-base'>
                      {location.city}
                    </h3>
                  )}
                </div>

                {/* Country */}
                <div
                  onClick={(e) =>
                    e.detail === 2 && setEditingCountry(location.id)
                  }
                  className='mb-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                  {editingCountry === location.id ? (
                    <input
                      ref={countryRef}
                      value={location.country}
                      onChange={(e) =>
                        setLocations(
                          locations.map((l) =>
                            l.id === location.id
                              ? { ...l, country: e.target.value }
                              : l
                          )
                        )
                      }
                      onBlur={() => {
                        save(location.id, { country: location.country })
                        setEditingCountry(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          save(location.id, { country: location.country })
                          setEditingCountry(null)
                        }
                      }}
                      className='w-full bg-transparent text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground outline-none'
                      placeholder='Country'
                    />
                  ) : (
                    <p className='cursor-text text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                      {location.country}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div
                  onClick={(e) =>
                    e.detail === 2 && setEditingAddress(location.id)
                  }
                  className='mb-3'>
                  {editingAddress === location.id ? (
                    <textarea
                      ref={addressRef}
                      value={location.address || ''}
                      onChange={(e) =>
                        setLocations(
                          locations.map((l) =>
                            l.id === location.id
                              ? { ...l, address: e.target.value }
                              : l
                          )
                        )
                      }
                      onBlur={() => {
                        save(location.id, { address: location.address })
                        setEditingAddress(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          save(location.id, { address: location.address })
                          setEditingAddress(null)
                        }
                      }}
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

                {/* Map Button */}
                <div className='mt-auto flex justify-end'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() =>
                      openMapDialog(location.id, location.map_url || '')
                    }
                    className='inline-flex items-center justify-center gap-2 rounded-full px-3 text-[0.7rem]'>
                    <MapPin className='h-3 w-3' />
                    {location.map_url ? 'Update map link' : 'Add map link'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button (mobile) */}
        <div className='mt-10 text-center md:hidden'>
          <Button
            onClick={addLocation}
            variant='outline'
            size='sm'
            className='inline-flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Add location
          </Button>
        </div>
      </div>

      <AlertDialog
        open={mapDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setMapDialogLocationId(null)
            setMapDialogUrl('')
          }
          setMapDialogOpen(open)
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Add Map Link
            </AlertDialogTitle>
            <AlertDialogDescription>
              Paste a Google Maps or other map link.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <input
            value={mapDialogUrl}
            onChange={(e) => setMapDialogUrl(e.target.value)}
            className='mt-4 w-full rounded border p-2 outline-none'
            placeholder='https://maps.google.com/...'
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveMapUrl}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImageUploadDialog
        open={imageDialogOpen}
        onOpenChange={(open) => {
          if (!open) setImageDialogLocationId(null)
          setImageDialogOpen(open)
        }}
        onUpload={handleImageUpload}
        existingUrl={
          imageDialogLocationId
            ? locations.find((l) => l.id === imageDialogLocationId)?.image_url ??
              undefined
            : undefined
        }
        title='Upload location image'
        description='Choose a photo from your computer or paste a URL.'
      />
    </section>
  )
}
