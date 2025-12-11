// ColorPickerField.tsx

import { HexColorPicker } from 'react-colorful'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

type ColorPickerFieldProps = {
  id: string
  label: string
  tooltipContent: string
  color: string
  isPickerOpen: boolean
  pickerRef: React.RefObject<HTMLDivElement | null>
  error?: { message?: string }
  onTogglePicker: () => void
  onColorChange: (color: string) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputProps: Record<string, unknown>
}

export function ColorPickerField({
  id,
  label,
  tooltipContent,
  color,
  isPickerOpen,
  pickerRef,
  error,
  onTogglePicker,
  onColorChange,
  onInputChange,
  inputProps,
}: ColorPickerFieldProps) {
  return (
    <Field>
      <div className='flex items-center gap-2'>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type='button'
              aria-label={`${label} info`}
              className='text-primary/80 hover:text-primary p-1 transition-colors'>
              <Info className='size-4' aria-hidden='true' />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side='top'
            align='start'
            className='max-w-xs border border-primary/50 text-primary-foreground text-xs font-medium shadow-lg'>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className='flex items-center gap-3 relative'>
        <button
          type='button'
          className='size-10 rounded-md border shadow-inner'
          style={{ backgroundColor: color }}
          onClick={onTogglePicker}
          aria-label={`Pick ${label.toLowerCase()}`}
        />

        {isPickerOpen && (
          <div
            ref={pickerRef}
            className='absolute left-0 top-12 z-20 rounded-md border bg-card p-3 shadow-lg'>
            <HexColorPicker color={color} onChange={onColorChange} />
          </div>
        )}

        <Input
          id={id}
          placeholder={id === 'primary_color' ? '#5038EE' : '#F5F5F5'}
          {...inputProps}
          onChange={onInputChange}
        />
      </div>

      <FieldError errors={error ? [error] : []} />
    </Field>
  )
}
