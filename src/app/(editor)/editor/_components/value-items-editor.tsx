'use client'

import { Button } from '@/components/ui/button'
import {
  createValueItemInline,
  deleteValueItemInline,
  saveValueItemInline,
} from '@/lib/actions/valueItemsInline'
import type { ValueItem } from '@/types/database'
import { PROFESSIONAL_EMOJIS } from '@/config/emoji-presets'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { InlineDeleteButton } from './inline-delete-button'
import { InlineEmojiPicker } from './inline-emoji-picker'
import { ValuePerkEditorItem } from './value-perk-editor-item'
import { SectionHeading } from './section-heading'
import { ValidatedPromptDialog } from './validated-prompt-dialog'

type EditorProps = {
  initial: ValueItem[]
}

export function ValueItemsEditor({ initial }: EditorProps) {
  const [valueItems, setValueItems] = useState(initial)

  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [editingDescription, setEditingDescription] = useState<string | null>(
    null
  )

  const titleRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogIcon, setDialogIcon] = useState('')
  const [dialogValueItemId, setDialogValueItemId] = useState<string | null>(
    null
  )

  async function save(id: string, patch: Partial<ValueItem>) {
    // Find the current value item to get required fields
    const currentValueItem = valueItems.find((v) => v.id === id)
    if (!currentValueItem) return

    const payload = {
      id,
      title: patch.title ?? currentValueItem.title,
      description:
        patch.description !== null && patch.description !== undefined
          ? patch.description
          : currentValueItem.description !== null
          ? currentValueItem.description
          : undefined,
      icon:
        patch.icon !== null && patch.icon !== undefined
          ? patch.icon
          : currentValueItem.icon !== null
          ? currentValueItem.icon
          : undefined,
      orderIndex: patch.order_index ?? currentValueItem.order_index,
    }

    try {
      const result = await saveValueItemInline(payload)
      if (!result.success) {
        console.error('Save failed:', result.error)
      }
    } catch (error) {
      console.error('Save failed', error)
    }
  }

  async function addValueItem() {
    try {
      const result = await createValueItemInline()
      if (result.success && result.data) {
        const random =
          PROFESSIONAL_EMOJIS[
            Math.floor(Math.random() * PROFESSIONAL_EMOJIS.length)
          ]
        const withIcon = { ...result.data, icon: random?.char ?? '✨' }
        setValueItems([...valueItems, withIcon])
        // Persist the chosen emoji
        await save(withIcon.id, { icon: withIcon.icon })
      }
    } catch (error) {
      console.error('Create failed', error)
    }
  }

  async function deleteValueItem(id: string) {
    try {
      const result = await deleteValueItemInline(id)
      if (result.success) {
        setValueItems(valueItems.filter((v) => v.id !== id))
      }
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  async function saveIcon() {
    if (!dialogValueItemId) return

    const nextValueItems = valueItems.map((v) =>
      v.id === dialogValueItemId ? { ...v, icon: dialogIcon } : v
    )
    setValueItems(nextValueItems)

    await save(dialogValueItemId, { icon: dialogIcon })
    setDialogOpen(false)
  }

  function openIconDialog(valueItemId: string, currentIcon: string) {
    setDialogValueItemId(valueItemId)
    setDialogIcon(currentIcon || '')
    setDialogOpen(true)
  }

  useEffect(() => {
    if (editingTitle && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
    }
  }, [editingTitle])

  useEffect(() => {
    if (editingDescription && descriptionRef.current) {
      const el = descriptionRef.current
      el.focus()
      const len = el.value.length
      el.setSelectionRange(len, len)
    }
  }, [editingDescription])

  return (
    <section className='w-full bg-background py-16'>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='mb-16 flex items-baseline justify-between gap-4'>
          <SectionHeading
            eyebrow='Values'
            title='Our Values'
            description='The principles that guide everything we do.'
          />

          <Button
            onClick={addValueItem}
            variant='outline'
            size='sm'
            className='hidden shrink-0 items-center gap-2 md:inline-flex'>
            <Plus className='h-4 w-4' />
            Add value
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-y-12 gap-x-16 md:grid-cols-2'>
          {valueItems.map((valueItem) => {
            const titleNode = (
              <div
                onClick={(e) =>
                  e.detail === 2 && setEditingTitle(valueItem.id)
                }>
                {editingTitle === valueItem.id ? (
                  <input
                    ref={titleRef}
                    value={valueItem.title}
                    onChange={(e) =>
                      setValueItems(
                        valueItems.map((v) =>
                          v.id === valueItem.id
                            ? { ...v, title: e.target.value }
                            : v
                        )
                      )
                    }
                    onBlur={() => {
                      save(valueItem.id, { title: valueItem.title })
                      setEditingTitle(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        save(valueItem.id, {
                          title: valueItem.title,
                        })
                        setEditingTitle(null)
                      }
                    }}
                    className='w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground'
                    placeholder='Value title'
                  />
                ) : (
                  <h3 className='w-full cursor-text text-sm font-semibold text-foreground'>
                    {valueItem.title}
                  </h3>
                )}
              </div>
            )

            const descriptionNode = (
              <div
                className='mt-5 flex w-full flex-1 items-center justify-center'
                onClick={(e) =>
                  e.detail === 2 && setEditingDescription(valueItem.id)
                }>
                {editingDescription === valueItem.id ? (
                  <div className='relative w-full max-w-md'>
                    <textarea
                      ref={descriptionRef}
                      value={valueItem.description || ''}
                      onChange={(e) =>
                        setValueItems(
                          valueItems.map((v) =>
                            v.id === valueItem.id
                              ? { ...v, description: e.target.value }
                              : v
                          )
                        )
                      }
                      onBlur={() => {
                        save(valueItem.id, {
                          description: valueItem.description,
                        })
                        setEditingDescription(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          save(valueItem.id, {
                            description: valueItem.description,
                          })
                          setEditingDescription(null)
                        }
                      }}
                      rows={3}
                      className='w-full max-w-md wrap-break-word resize-none bg-transparent pr-6 text-sm leading-relaxed text-muted-foreground outline-none placeholder:text-muted-foreground md:text-base'
                      placeholder='Describe this value...'
                    />
                    <div className='pointer-events-none absolute bottom-1.5 right-1.5 text-[0.7rem] text-muted-foreground/60'>
                      ↕︎
                    </div>
                  </div>
                ) : (
                  <p className='w-full max-w-md cursor-text wrap-break-word text-sm leading-relaxed text-muted-foreground md:text-base'>
                    {valueItem.description || 'Describe this value...'}
                  </p>
                )}
              </div>
            )

            return (
              <ValuePerkEditorItem
                key={valueItem.id}
                icon={valueItem.icon}
                fallbackIcon='✨'
                onDelete={() => deleteValueItem(valueItem.id)}
                onIconClick={() =>
                  openIconDialog(valueItem.id, valueItem.icon || '')
                }
                title={titleNode}
                description={descriptionNode}
                tileBgClass='bg-chart-1/10'
                iconBgClass='bg-chart-1/15'
                iconTextClass='text-chart-1'
              />
            )
          })}
        </div>
        {/* Add Button */}
        <div className='mt-10 text-center md:hidden'>
          <Button
            onClick={addValueItem}
            variant='outline'
            size='sm'
            className='inline-flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Add value
          </Button>
        </div>
      </div>
      <ValidatedPromptDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title='Change icon'
        description='Enter an emoji or icon character for this value.'
        label='Emoji'
        placeholder='🚀'
        value={dialogIcon}
        onValueChange={setDialogIcon}
        onConfirm={saveIcon}
      >
        <InlineEmojiPicker onSelect={(emoji) => setDialogIcon(emoji)} />
      </ValidatedPromptDialog>
    </section>
  )
}
