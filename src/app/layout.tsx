// app/layout.tsx

import '@fontsource-variable/inter'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareerBlocks',
  description: 'Career site builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='font-primary antialiased'>{children}</body>
    </html>
  )
}
