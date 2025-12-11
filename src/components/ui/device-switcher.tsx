// device-switcher.tsx

import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { Button } from './button'

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface DeviceSwitcherProps {
  value?: DeviceType
  onChange?: (device: DeviceType) => void
}

export function DeviceSwitcher({
  value = 'desktop',
  onChange,
}: DeviceSwitcherProps) {
  return (
    <div className='flex gap-2 rounded-xl p-2 bg-white shadow-md border border-slate-200 dark:bg-slate-900 dark:border-slate-800'>
      <Button
        variant={value === 'desktop' ? 'default' : 'ghost'}
        size='icon'
        aria-label='Desktop view'
        onClick={() => onChange?.('desktop')}>
        <Monitor className='w-5 h-5' />
      </Button>
      <Button
        variant={value === 'tablet' ? 'default' : 'ghost'}
        size='icon'
        aria-label='Tablet view'
        onClick={() => onChange?.('tablet')}>
        <Tablet className='w-5 h-5' />
      </Button>
      <Button
        variant={value === 'mobile' ? 'default' : 'ghost'}
        size='icon'
        aria-label='Mobile view'
        onClick={() => onChange?.('mobile')}>
        <Smartphone className='w-5 h-5' />
      </Button>
    </div>
  )
}
