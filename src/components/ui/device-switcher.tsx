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
    <div
      className='flex gap-2 rounded-xl p-2 shadow-lg backdrop-blur-md bg-white/20 border border-white/30 dark:bg-slate-800/30 dark:border-slate-300/10'
      style={{
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
      }}>
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
