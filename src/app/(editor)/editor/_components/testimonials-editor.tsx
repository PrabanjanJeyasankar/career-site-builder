'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  createTestimonialInline,
  deleteTestimonialInline,
  saveTestimonialInline,
} from '@/lib/actions/testimonialsInline'
import type { Testimonial } from '@/types/database'
import { Plus, Replace } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { InlineDeleteButton } from './inline-delete-button'
import { SectionHeading } from './section-heading'
import { TestimonialLayout } from './testimonial-layout'

type EditorProps = {
  initial: Testimonial[]
}

export function TestimonialsEditor({ initial }: EditorProps) {
  const [testimonials, setTestimonials] = useState(initial)

  const [editingName, setEditingName] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [editingQuote, setEditingQuote] = useState<string | null>(null)

  const nameRef = useRef<HTMLInputElement | null>(null)
  const roleRef = useRef<HTMLInputElement | null>(null)
  const quoteRef = useRef<HTMLTextAreaElement | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogUrl, setDialogUrl] = useState('')
  const [dialogTestimonialId, setDialogTestimonialId] = useState<string | null>(
    null
  )

  async function save(id: string, patch: Partial<Testimonial>) {
    // Find the current testimonial to get required fields
    const currentTestimonial = testimonials.find((t) => t.id === id)
    if (!currentTestimonial) return

    const payload = {
      id,
      employeeName: patch.employee_name ?? currentTestimonial.employee_name,
      role: patch.role ?? currentTestimonial.role,
      quote: patch.quote ?? currentTestimonial.quote,
      avatarUrl:
        patch.avatar_url !== null && patch.avatar_url !== undefined
          ? patch.avatar_url
          : currentTestimonial.avatar_url !== null &&
            currentTestimonial.avatar_url !== undefined
          ? currentTestimonial.avatar_url
          : undefined,
      orderIndex: patch.order_index ?? currentTestimonial.order_index,
    }

    try {
      const result = await saveTestimonialInline(payload)
      if (!result.success) {
        console.error('Save failed:', result.error)
      }
    } catch (error) {
      console.error('Save failed', error)
    }
  }

  async function addTestimonial() {
    try {
      const result = await createTestimonialInline()
      if (result.success && result.data) {
        setTestimonials([...testimonials, result.data])
      }
    } catch (error) {
      console.error('Create failed', error)
    }
  }

  async function deleteTestimonial(id: string) {
    try {
      const result = await deleteTestimonialInline(id)
      if (result.success) {
        setTestimonials(testimonials.filter((t) => t.id !== id))
      }
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  async function saveAvatar() {
    if (!dialogTestimonialId) return

    const nextTestimonials = testimonials.map((t) =>
      t.id === dialogTestimonialId ? { ...t, avatar_url: dialogUrl } : t
    )
    setTestimonials(nextTestimonials)

    await save(dialogTestimonialId, { avatar_url: dialogUrl })
    setDialogOpen(false)
  }

  function openAvatarDialog(testimonialId: string, currentUrl: string) {
    setDialogTestimonialId(testimonialId)
    setDialogUrl(currentUrl || '')
    setDialogOpen(true)
  }

  useEffect(() => {
    if (editingName && nameRef.current) {
      nameRef.current.focus()
      nameRef.current.select()
    }
  }, [editingName])

  useEffect(() => {
    if (editingRole && roleRef.current) {
      roleRef.current.focus()
      roleRef.current.select()
    }
  }, [editingRole])

  useEffect(() => {
    if (editingQuote && quoteRef.current) {
      const el = quoteRef.current
      el.focus()
      const len = el.value.length
      el.setSelectionRange(len, len)
    }
  }, [editingQuote])

  return (
    <section className='w-full bg-background py-16'>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Testimonials'
            title='What our team says'
            description='Edit the people and stories that appear on your careers site.'
          />

          <Button
            onClick={addTestimonial}
            variant='outline'
            size='sm'
            className='hidden shrink-0 items-center gap-2 md:inline-flex'>
            <Plus className='h-4 w-4' />
            Add testimonial
          </Button>
        </div>

        <div className='space-y-[5rem]'>
          {testimonials.map((testimonial) => {
            const avatarTile = (
              <div
                className='group/avatar relative h-20 w-20 cursor-pointer overflow-hidden rounded-3xl bg-chart-1/15'
                onClick={() =>
                  openAvatarDialog(testimonial.id, testimonial.avatar_url || '')
                }>
                {testimonial.avatar_url ? (
                  <Image
                    src={testimonial.avatar_url}
                    alt={testimonial.employee_name}
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-base font-semibold text-chart-1'>
                    {testimonial.employee_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className='absolute inset-0 flex items-center justify-center rounded-3xl bg-black/35 opacity-0 transition-opacity group-hover/avatar:opacity-100'>
                  <Replace className='h-4 w-4 text-white' />
                </div>
              </div>
            )

            const nameNode = (
              <div
                onClick={(e) =>
                  e.detail === 2 && setEditingName(testimonial.id)
                }>
                {editingName === testimonial.id ? (
                  <input
                    ref={nameRef}
                    value={testimonial.employee_name}
                    onChange={(e) =>
                      setTestimonials(
                        testimonials.map((t) =>
                          t.id === testimonial.id
                            ? {
                                ...t,
                                employee_name: e.target.value,
                              }
                            : t
                        )
                      )
                    }
                    onBlur={() => {
                      save(testimonial.id, {
                        employee_name: testimonial.employee_name,
                      })
                      setEditingName(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        save(testimonial.id, {
                          employee_name: testimonial.employee_name,
                        })
                        setEditingName(null)
                      }
                    }}
                    className='w-full bg-transparent text-sm font-semibold text-foreground outline-none'
                    placeholder='Employee name'
                  />
                ) : (
                  <h4 className='cursor-text text-sm font-semibold text-foreground'>
                    {testimonial.employee_name}
                  </h4>
                )}
              </div>
            )

            const roleNode = (
              <div
                onClick={(e) =>
                  e.detail === 2 && setEditingRole(testimonial.id)
                }>
                {editingRole === testimonial.id ? (
                  <input
                    ref={roleRef}
                    value={testimonial.role}
                    onChange={(e) =>
                      setTestimonials(
                        testimonials.map((t) =>
                          t.id === testimonial.id
                            ? { ...t, role: e.target.value }
                            : t
                        )
                      )
                    }
                    onBlur={() => {
                      save(testimonial.id, { role: testimonial.role })
                      setEditingRole(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        save(testimonial.id, {
                          role: testimonial.role,
                        })
                        setEditingRole(null)
                      }
                    }}
                    className='w-full bg-transparent text-[0.7rem] text-muted-foreground outline-none'
                    placeholder='Role or title'
                  />
                ) : (
                  <p className='cursor-text text-[0.7rem] text-muted-foreground'>
                    {testimonial.role}
                  </p>
                )}
              </div>
            )

            const quoteNode = (
              <div
                className='flex-1'
                onClick={(e) =>
                  e.detail === 2 && setEditingQuote(testimonial.id)
                }>
                {editingQuote === testimonial.id ? (
                  <div className='relative w-full'>
                    <textarea
                      ref={quoteRef}
                      value={testimonial.quote}
                      onChange={(e) =>
                        setTestimonials(
                          testimonials.map((t) =>
                            t.id === testimonial.id
                              ? { ...t, quote: e.target.value }
                              : t
                          )
                        )
                      }
                      onBlur={() => {
                        save(testimonial.id, { quote: testimonial.quote })
                        setEditingQuote(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          save(testimonial.id, { quote: testimonial.quote })
                          setEditingQuote(null)
                        }
                      }}
                      rows={4}
                      className='w-full resize-none bg-transparent pr-6 text-sm leading-relaxed text-muted-foreground outline-none md:text-base'
                      placeholder='Add the testimonial text here…'
                    />
                    <div className='pointer-events-none absolute bottom-1.5 right-1.5 text-[0.7rem] text-muted-foreground/60'>
                      ↕︎
                    </div>
                  </div>
                ) : (
                  <p className='cursor-text text-sm leading-relaxed text-muted-foreground italic md:text-base'>
                    {testimonial.quote}
                  </p>
                )}
              </div>
            )

            return (
              <div key={testimonial.id} className='group relative pt-2'>
                <div className='absolute right-0 top-0 flex translate-y-[-1.5rem] gap-2'>
                  <InlineDeleteButton
                    onClick={() => deleteTestimonial(testimonial.id)}
                  />
                </div>

                <TestimonialLayout
                  avatarTile={avatarTile}
                  name={nameNode}
                  role={roleNode}
                  quote={quoteNode}
                />
              </div>
            )
          })}
        </div>

        <div className='mt-10 text-center md:hidden'>
          <Button
            onClick={addTestimonial}
            variant='outline'
            size='sm'
            className='inline-flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Add testimonial
          </Button>
        </div>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace Avatar</AlertDialogTitle>
            <AlertDialogDescription>
              Paste a public image URL for the employee avatar.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <input
            value={dialogUrl}
            onChange={(e) => setDialogUrl(e.target.value)}
            className='mt-4 w-full rounded border p-2 outline-none'
            placeholder='https://example.com/avatar.jpg'
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveAvatar}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
