import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

type ShakeContainerProps = {
  children: React.ReactNode
  active: boolean
}

export function ShakeContainer({ children, active }: ShakeContainerProps) {
  return (
    <motion.div
      animate={active ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}>
      {children}
    </motion.div>
  )
}

type ValidatedInputProps = {
  id: string
  label: string
  type?: string
  placeholder?: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function ValidatedInput({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  ...rest
}: ValidatedInputProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <div className='relative'>
        <ShakeContainer active={!!error}>
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            {...rest} // <-- RHF register props (value, onChange, name, ref)
            className={cn(
              error &&
                'border-destructive bg-destructive/10 focus:border-destructive/60 focus:ring-destructive/40',
              rest.className
            )}
          />
        </ShakeContainer>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className='absolute left-0 top-full mt-1 text-sm text-destructive'>
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Field>
  )
}
