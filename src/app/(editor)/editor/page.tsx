// editor/page.tsx
'use client'

import { Card } from '@/components/ui/card'
import { animate, motion } from 'framer-motion'
import { useEffect } from 'react'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (!element) return
  const top = element.offsetTop
  animate(window.scrollY, top, {
    duration: 0.5,
    onUpdate: (value) => window.scrollTo(0, value),
  })
}

export default function EditorPage() {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) scrollToSection(hash)
  })

  return (
    <div className='space-y-20 p-6'>
      <motion.div id='hero'>
        <Card className='p-8 h-40 text-xl'>Hero Section</Card>
      </motion.div>

      <motion.div id='life'>
        <Card className='p-8 h-40 text-xl'>Life Section</Card>
      </motion.div>

      <motion.div id='values'>
        <Card className='p-8 h-40 text-xl'>Values Section</Card>
      </motion.div>

      <motion.div id='perks'>
        <Card className='p-8 h-40 text-xl'>Perks Section</Card>
      </motion.div>

      <motion.div id='testimonials'>
        <Card className='p-8 h-40 text-xl'>Testimonials Section</Card>
      </motion.div>

      <motion.div id='location'>
        <Card className='p-8 h-40 text-xl'>Location Section</Card>
      </motion.div>
    </div>
  )
}
