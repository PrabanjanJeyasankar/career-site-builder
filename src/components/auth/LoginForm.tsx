'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ErrorBanner } from '@/components/common/ErrorBanner'
import { ValidatedInput } from '@/components/common/ValidateInput'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'

import { loginAction } from '@/lib/auth/loginAction'
import { cn } from '@/lib/utils'
import { loginSchema, type LoginSchema } from '@/lib/validation/authSchema'

export default function LoginForm({ className }: { className?: string }) {
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginSchema, event?: React.BaseSyntheticEvent) {
    event?.preventDefault()

    setServerError('')
    const result = await loginAction(data.email, data.password)

    if (result?.error) {
      setServerError(result.error)
      return
    }

    window.location.assign('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex flex-col gap-6', className)}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ErrorBanner message={serverError} />

        <FieldGroup>
          <ValidatedInput
            id='email'
            label='Email'
            type='email'
            placeholder='prabanjan@example.com'
            error={errors.email?.message}
            {...register('email')}
          />

          <ValidatedInput
            id='password'
            label='Password'
            type='password'
            placeholder='••••••'
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type='submit' disabled={isSubmitting} className='mt-2 w-full'>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </FieldGroup>
      </form>

      <div className='text-center text-sm text-muted-foreground'>
        <a
          href='/debug-auth'
          className='text-primary underline underline-offset-4 hover:opacity-80'>
          Debug Auth State
        </a>
      </div>
    </motion.div>
  )
}
