// MapLinkDialog.tsx
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

type MapLinkDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mapUrl: string
  onMapUrlChange: (url: string) => void
  onSave: () => void
  isValidUrl: boolean
}

export function MapLinkDialog({
  open,
  onOpenChange,
  mapUrl,
  onMapUrlChange,
  onSave,
  isValidUrl,
}: MapLinkDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Map Link</AlertDialogTitle>
          <AlertDialogDescription>
            Paste a Google Maps or other map link.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <input
          value={mapUrl}
          onChange={(e) => onMapUrlChange(e.target.value)}
          className='mt-4 w-full rounded border p-2 outline-none'
          placeholder='https://maps.google.com/...'
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSave} disabled={!isValidUrl}>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
