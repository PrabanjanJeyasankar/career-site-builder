// LocationsEditorClient.tsx
'use client'

import { ImageUploadDialog } from '@/components/common/ImageUploadDialog'
import { useLocationsEditor } from '@/hooks/use-locations-editor'
import { locationEditorService } from '@/services/locationEditorService'
import type { Location } from '@/types/database'
import { useState } from 'react'

import { LocationsGrid } from './LocationsGrid'
import { LocationsHeader } from './LocationsHeader'
import { MapLinkDialog } from './MapLinkDialog'

type LocationsEditorClientProps = {
  initialLocations: Location[]
}

export function LocationsEditorClient({
  initialLocations,
}: LocationsEditorClientProps) {
  const [mapDialogOpen, setMapDialogOpen] = useState(false)
  const [mapDialogUrl, setMapDialogUrl] = useState('')
  const [mapDialogLocationId, setMapDialogLocationId] = useState<string | null>(
    null
  )
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageDialogLocationId, setImageDialogLocationId] = useState<
    string | null
  >(null)

  const handleSave = async (id: string, patch: Partial<Location>) => {
    const currentLocation = locations.find((l) => l.id === id)
    if (!currentLocation) return

    await locationEditorService.saveLocation(id, patch, currentLocation)
  }

  const handleCreate = async () => {
    return await locationEditorService.createLocation()
  }

  const handleDelete = async (id: string) => {
    await locationEditorService.deleteLocation(id)
  }

  const {
    locations,
    editingCity,
    editingCountry,
    editingAddress,
    cityRef,
    countryRef,
    addressRef,
    setEditingCity,
    setEditingCountry,
    setEditingAddress,
    updateLocationField,
    saveLocationField,
    addLocation,
    removeLocation,
    updateLocationImage,
    updateLocationMapUrl,
  } = useLocationsEditor({
    initialLocations,
    onSave: handleSave,
    onCreate: handleCreate,
    onDelete: handleDelete,
  })

  const openMapDialog = (locationId: string, currentUrl: string) => {
    setMapDialogLocationId(locationId)
    setMapDialogUrl(currentUrl || '')
    setMapDialogOpen(true)
  }

  const isValidMapUrl = (url: string) => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return false

    try {
      const urlObj = new URL(trimmedUrl)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const saveMapUrl = async () => {
    if (!mapDialogLocationId) return

    const trimmedUrl = mapDialogUrl.trim()
    if (!trimmedUrl || !isValidMapUrl(trimmedUrl)) return

    updateLocationMapUrl(mapDialogLocationId, trimmedUrl)
    await handleSave(mapDialogLocationId, { map_url: trimmedUrl })
    setMapDialogOpen(false)
    setMapDialogUrl('')
    setMapDialogLocationId(null)
  }

  const openImageDialog = (locationId: string) => {
    setImageDialogLocationId(locationId)
    setImageDialogOpen(true)
  }

  const handleImageUpload = async (url: string) => {
    if (!imageDialogLocationId) return

    updateLocationImage(imageDialogLocationId, url)
    await handleSave(imageDialogLocationId, { image_url: url })
    setImageDialogOpen(false)
    setImageDialogLocationId(null)
  }

  return (
    <>
      <LocationsHeader onAddLocation={addLocation} />

      <LocationsGrid
        locations={locations}
        editingCity={editingCity}
        editingCountry={editingCountry}
        editingAddress={editingAddress}
        cityRef={cityRef}
        countryRef={countryRef}
        addressRef={addressRef}
        onSetEditingCity={setEditingCity}
        onSetEditingCountry={setEditingCountry}
        onSetEditingAddress={setEditingAddress}
        onUpdateField={updateLocationField}
        onSaveField={saveLocationField}
        onDelete={removeLocation}
        onOpenImageDialog={openImageDialog}
        onOpenMapDialog={openMapDialog}
        onAddLocation={addLocation}
      />

      <MapLinkDialog
        open={mapDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setMapDialogLocationId(null)
            setMapDialogUrl('')
          }
          setMapDialogOpen(open)
        }}
        mapUrl={mapDialogUrl}
        onMapUrlChange={setMapDialogUrl}
        onSave={saveMapUrl}
        isValidUrl={isValidMapUrl(mapDialogUrl)}
      />

      <ImageUploadDialog
        open={imageDialogOpen}
        onOpenChange={(open) => {
          if (!open) setImageDialogLocationId(null)
          setImageDialogOpen(open)
        }}
        onUpload={handleImageUpload}
        existingUrl={
          imageDialogLocationId
            ? locations.find((l) => l.id === imageDialogLocationId)
                ?.image_url ?? undefined
            : undefined
        }
        title='Upload location image'
        description='Choose a photo from your computer or paste a URL.'
      />
    </>
  )
}
