'use client'

import { Button } from '@/components/ui/button'
import { PROFESSIONAL_EMOJIS } from '@/config/emoji-presets'
import {
  createPerkInline,
  deletePerkInline,
  savePerkInline,
} from '@/lib/actions/perksInline'
import type { Perk } from '@/types/database'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { InlineEmojiPicker } from '../inline-emoji-picker'
import { SectionHeading } from '../section-heading'
import { ValidatedPromptDialog } from '../validated-prompt-dialog'
import { ValuePerkEditorItem } from '../value-perk-editor-item'

type EditorProps = {
  initial: Perk[]
  primaryColor?: string
  secondaryColor?: string
}

export function PerksEditor({
  initial,
  primaryColor,
  secondaryColor,
}: EditorProps) {
  const [perks, setPerks] = useState(initial)

  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [editingDescription, setEditingDescription] = useState<string | null>(
    null
  )

  const labelRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogIcon, setDialogIcon] = useState('')
  const [dialogPerkId, setDialogPerkId] = useState<string | null>(null)

  async function save(id: string, patch: Partial<Perk>) {
    // Find the current perk to get required fields
    const currentPerk = perks.find((p) => p.id === id)
    if (!currentPerk) return

    const payload = {
      id,
      label: patch.label ?? currentPerk.label,
      description:
        patch.description !== null && patch.description !== undefined
          ? patch.description
          : currentPerk.description ?? undefined,
      icon:
        patch.icon !== null && patch.icon !== undefined
          ? patch.icon
          : currentPerk.icon ?? undefined,
    }

    try {
      const result = await savePerkInline(payload)
      if (!result.success) {
        console.error('Save failed:', result.error)
      }
    } catch (error) {
      console.error('Save failed', error)
    }
  }

  async function addPerk() {
    try {
      const result = await createPerkInline()
      if (result.success && result.data) {
        const random =
          PROFESSIONAL_EMOJIS[
            Math.floor(Math.random() * PROFESSIONAL_EMOJIS.length)
          ]
        const withIcon = { ...result.data, icon: random?.char ?? '🎉' }
        setPerks([...perks, withIcon])
        await save(withIcon.id, { icon: withIcon.icon })
      }
    } catch (error) {
      console.error('Create failed', error)
    }
  }

  async function deletePerk(id: string) {
    try {
      const result = await deletePerkInline(id)
      if (result.success) {
        setPerks(perks.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  async function saveIcon() {
    if (!dialogPerkId) return

    const nextPerks = perks.map((p) =>
      p.id === dialogPerkId ? { ...p, icon: dialogIcon } : p
    )
    setPerks(nextPerks)

    await save(dialogPerkId, { icon: dialogIcon })
    setDialogOpen(false)
  }

  function openIconDialog(perkId: string, currentIcon: string) {
    setDialogPerkId(perkId)
    setDialogIcon(currentIcon || '')
    setDialogOpen(true)
  }

  useEffect(() => {
    if (editingLabel && labelRef.current) {
      labelRef.current.focus()
      labelRef.current.select()
    }
  }, [editingLabel])

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
            eyebrow='Benefits & perks'
            title='What makes working here special'
            description='Highlight the advantages of working with your team.'
          />

          <Button
            onClick={addPerk}
            variant='outline'
            size='sm'
            className='hidden shrink-0 items-center gap-2 md:inline-flex'>
            <Plus className='h-4 w-4' />
            Add perk
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {perks.map((perk) => {
            const titleNode = (
              <div onClick={(e) => e.detail === 2 && setEditingLabel(perk.id)}>
                {editingLabel === perk.id ? (
                  <input
                    ref={labelRef}
                    value={perk.label}
                    onChange={(e) =>
                      setPerks(
                        perks.map((p) =>
                          p.id === perk.id ? { ...p, label: e.target.value } : p
                        )
                      )
                    }
                    onBlur={() => {
                      save(perk.id, { label: perk.label })
                      setEditingLabel(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        save(perk.id, { label: perk.label })
                        setEditingLabel(null)
                      }
                    }}
                    className='w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground'
                    placeholder='Perk name'
                  />
                ) : (
                  <h3 className='cursor-text text-sm font-semibold text-foreground'>
                    {perk.label}
                  </h3>
                )}
              </div>
            )

            const descriptionNode = (
              <div
                className='mt-4 w-full max-w-xs'
                onClick={(e) =>
                  e.detail === 2 && setEditingDescription(perk.id)
                }>
                {editingDescription === perk.id ? (
                  <div className='relative w-full max-w-xs'>
                    <textarea
                      ref={descriptionRef}
                      value={perk.description || ''}
                      onChange={(e) =>
                        setPerks(
                          perks.map((p) =>
                            p.id === perk.id
                              ? { ...p, description: e.target.value }
                              : p
                          )
                        )
                      }
                      onBlur={() => {
                        save(perk.id, { description: perk.description })
                        setEditingDescription(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          save(perk.id, { description: perk.description })
                          setEditingDescription(null)
                        }
                      }}
                      rows={3}
                      className='w-full max-w-xs break-words resize-none bg-transparent pr-6 text-sm leading-relaxed text-muted-foreground outline-none placeholder:text-muted-foreground'
                      placeholder='Describe this benefit...'
                    />
                    <div className='pointer-events-none absolute bottom-1.5 right-1.5 text-[0.7rem] text-muted-foreground/60'>
                      ↕︎
                    </div>
                  </div>
                ) : (
                  <p className='w-full max-w-xs cursor-text break-words text-sm leading-relaxed text-muted-foreground'>
                    {perk.description || 'Describe this benefit...'}
                  </p>
                )}
              </div>
            )

            return (
              <ValuePerkEditorItem
                key={perk.id}
                icon={perk.icon}
                fallbackIcon='🎉'
                onDelete={() => deletePerk(perk.id)}
                onIconClick={() => openIconDialog(perk.id, perk.icon || '')}
                title={titleNode}
                description={descriptionNode}
                tileBgClass='bg-chart-2/5'
                iconBgClass='bg-chart-2/15'
                iconTextClass='text-chart-2'
                className='pt-4'
                tileBgColor={secondaryColor || primaryColor}
                tileBgOpacity={0.1}
                iconBgColor={primaryColor || secondaryColor}
                iconBgOpacity={0.2}
              />
            )
          })}
        </div>

        {/* Add Button (mobile) */}
        <div className='mt-10 text-center md:hidden'>
          <Button
            onClick={addPerk}
            variant='outline'
            size='sm'
            className='inline-flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Add perk
          </Button>
        </div>
      </div>

      <ValidatedPromptDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title='Change icon'
        description='Enter an emoji or icon character for this perk.'
        label='Emoji'
        placeholder='🎉'
        value={dialogIcon}
        onValueChange={setDialogIcon}
        onConfirm={saveIcon}>
        <InlineEmojiPicker onSelect={(emoji) => setDialogIcon(emoji)} />
      </ValidatedPromptDialog>
    </section>
  )
}
