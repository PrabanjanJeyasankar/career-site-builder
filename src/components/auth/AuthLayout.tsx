'use client'

import type { ReactNode } from 'react'
import Logo from '../common/Logo'

interface AuthLayoutProps {
  description: string
  children: ReactNode
}

export default function AuthLayout({ description, children }: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <div className='w-full max-w-sm space-y-6 py-10 text-center'>
        <div className='flex flex-col items-center gap-2'>
          <Logo className='size-10' />

          <h1 className='text-2xl font-semibold'>CareerBlocks</h1>

          <p className='text-sm text-muted-foreground max-w-xs'>
            {description}
          </p>
        </div>

        <div className='mt-4'>{children}</div>
      </div>
    </div>
  )
}
