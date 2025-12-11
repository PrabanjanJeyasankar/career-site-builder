// use-color-picker.ts

import { useCallback, useEffect, useRef, useState } from 'react'

type UseColorPickerOptions = {
  onChange?: (color: string) => void
}

export function useColorPicker({ onChange }: UseColorPickerOptions = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement | null>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  const handleColorChange = useCallback(
    (color: string) => {
      onChange?.(color)
    },
    [onChange]
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  return {
    isOpen,
    pickerRef,
    open,
    close,
    toggle,
    handleColorChange,
  }
}
