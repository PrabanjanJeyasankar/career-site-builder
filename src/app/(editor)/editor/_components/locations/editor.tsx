// editor.tsx
import type { Location } from '@/types/database'

import { LocationsEditorClient } from './LocationsEditorClient'

type EditorProps = {
  initial: Location[]
}

export function LocationsEditor({ initial }: EditorProps) {
  return (
    <section className='w-full bg-background py-16'>
      <div className='mx-auto max-w-5xl px-4'>
        <LocationsEditorClient initialLocations={initial} />
      </div>
    </section>
  )
}
