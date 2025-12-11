// src/components/nav-main.tsx
'use client'

import { ChevronRight, GripVertical, PencilRuler } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  reorder,
  SectionKey,
  useSectionOrderStore,
} from '@/hooks/use-section-order'
import { saveSectionOrder } from '@/lib/actions/sectionOrder'

export function NavMain() {
  const order = useSectionOrderStore((state) => state.order)
  const setOrder = useSectionOrderStore((state) => state.setOrder)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const navMainItems = useMemo(() => {
    const orderedSections = order.map((key) => {
      const labelMap: Record<string, string> = {
        life: 'Life',
        values: 'Values',
        testimonials: 'Testimonials',
        locations: 'Locations',
        perks: 'Perks',
      }
      return {
        title: labelMap[key] ?? key,
        url: `/editor#${key}`,
      }
    })

    return [
      {
        title: 'Editor',
        url: '/editor',
        icon: PencilRuler,
        isActive: true,
        items: [
          { title: 'Hero', url: '/editor#hero' },
          ...orderedSections,
          { title: 'Jobs', url: '/editor#jobs' },
        ],
      },
    ]
  }, [order])

  async function commitOrder(next: SectionKey[]) {
    setOrder(next)
    setSaving(true)
    const result = await saveSectionOrder(next as never) // validated via store
    if (!result.success)
      console.error('Failed to save section order', result.error)
    setSaving(false)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Playground</SidebarGroupLabel>
      <SidebarMenu>
        {navMainItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className='group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && (
                    <span className='flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <item.icon className='h-4 w-4' />
                    </span>
                  )}
                  <span>{item.title}</span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {/* Hero (fixed) */}
                  <SidebarMenuSubItem key='hero'>
                    <SidebarMenuSubButton asChild>
                      <a href='/editor#hero'>
                        <span>Hero</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  {/* Draggable middle sections */}
                  {order.map((key) => (
                    <SidebarMenuSubItem
                      key={key}
                      draggable
                      onDragStart={(e) => {
                        setDragging(key)
                        e.dataTransfer.effectAllowed = 'move'
                        e.dataTransfer.setData('text/plain', key)
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        if (dragOver !== key) setDragOver(key)
                      }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => {
                        e.preventDefault()
                        const fromKey = e.dataTransfer.getData('text/plain')
                        setDragOver(null)
                        setDragging(null)
                        if (!fromKey || fromKey === key) return
                        const fromIndex = order.indexOf(
                          fromKey as (typeof order)[number]
                        )
                        const toIndex = order.indexOf(
                          key as (typeof order)[number]
                        )
                        if (fromIndex === -1 || toIndex === -1) return
                        const next = reorder(order, fromIndex, toIndex)
                        commitOrder(next)
                      }}>
                      <SidebarMenuSubButton
                        asChild
                        className={`flex items-center gap-2 rounded-md border transition-colors ${
                          dragOver === key
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent'
                        }`}>
                        <a
                          href={`/editor#${key}`}
                          className='flex flex-1 items-center gap-2'>
                          <span className='text-muted-foreground transition-opacity group-hover:opacity-100 opacity-60'>
                            <GripVertical className='h-4 w-4' />
                          </span>
                          <span className='capitalize'>{key}</span>
                          {saving && dragging === null && (
                            <span className='text-[11px] text-muted-foreground ml-auto'>
                              Saving…
                            </span>
                          )}
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}

                  {/* Jobs (fixed) */}
                  <SidebarMenuSubItem key='jobs'>
                    <SidebarMenuSubButton asChild>
                      <a href='/editor#jobs'>
                        <span>Jobs</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
