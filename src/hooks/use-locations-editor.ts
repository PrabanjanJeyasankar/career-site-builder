// use-locations-editor.ts
import type { Location } from '@/types/database'
import { useEffect, useRef, useState } from 'react'

type UseLocationsEditorOptions = {
  initialLocations: Location[]
  onSave: (id: string, patch: Partial<Location>) => Promise<void>
  onCreate: () => Promise<Location | null>
  onDelete: (id: string) => Promise<void>
}

export function useLocationsEditor({
  initialLocations,
  onSave,
  onCreate,
  onDelete,
}: UseLocationsEditorOptions) {
  const [locations, setLocations] = useState(initialLocations)

  const [editingCity, setEditingCity] = useState<string | null>(null)
  const [editingCountry, setEditingCountry] = useState<string | null>(null)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)

  const cityRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLTextAreaElement>(null)

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

  const updateLocationField = (
    id: string,
    field: keyof Location,
    value: string
  ) => {
    setLocations((prev) =>
      prev.map((location) =>
        location.id === id ? { ...location, [field]: value } : location
      )
    )
  }

  const saveLocationField = async (id: string, patch: Partial<Location>) => {
    await onSave(id, patch)
  }

  const addLocation = async () => {
    const newLocation = await onCreate()
    if (newLocation) {
      setLocations((prev) => [...prev, newLocation])
    }
  }

  const removeLocation = async (id: string) => {
    await onDelete(id)
    setLocations((prev) => prev.filter((location) => location.id !== id))
  }

  const updateLocationImage = (id: string, url: string) => {
    setLocations((prev) =>
      prev.map((location) =>
        location.id === id ? { ...location, image_url: url } : location
      )
    )
  }

  const updateLocationMapUrl = (id: string, url: string) => {
    setLocations((prev) =>
      prev.map((location) =>
        location.id === id ? { ...location, map_url: url } : location
      )
    )
  }

  return {
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
  }
}
