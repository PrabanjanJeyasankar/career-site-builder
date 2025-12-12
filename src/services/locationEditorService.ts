// locationEditorService.ts
import {
  createLocationInline,
  deleteLocationInline,
  saveLocationInline,
} from '@/lib/actions/locationsInline'
import type { Location } from '@/types/database'

export class LocationEditorService {
  async saveLocation(
    id: string,
    patch: Partial<Location>,
    currentLocation: Location
  ): Promise<{ success: boolean; error?: string }> {
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
        return { success: false, error: result.error }
      }
      return { success: true }
    } catch (error) {
      console.error('Save failed', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async createLocation(): Promise<Location | null> {
    try {
      const result = await createLocationInline()
      if (result.success && result.data) {
        return result.data
      }
      return null
    } catch (error) {
      console.error('Create failed', error)
      return null
    }
  }

  async deleteLocation(id: string): Promise<boolean> {
    try {
      const result = await deleteLocationInline(id)
      return result.success
    } catch (error) {
      console.error('Delete failed', error)
      return false
    }
  }
}

export const locationEditorService = new LocationEditorService()
