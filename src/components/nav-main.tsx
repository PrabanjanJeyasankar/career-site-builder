// src/components/nav-main.tsx
'use client'

import { ChevronRight, PencilRuler } from 'lucide-react'

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

const navMainItems = [
  {
    title: 'Editor',
    url: '/editor',
    icon: PencilRuler,
    isActive: true,
    items: [
      {
        title: 'Hero',
        url: '/editor#hero',
      },
      {
        title: 'Life',
        url: '/editor#life',
      },
      {
        title: 'Values',
        url: '/editor#values',
      },
      {
        title: 'Perks',
        url: '/editor#perks',
      },
      {
        title: 'Testimonials',
        url: '/editor#testimonials',
      },
      {
        title: 'Location',
        url: '/editor#location',
      },
    ],
  },
]

export function NavMain() {
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
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
