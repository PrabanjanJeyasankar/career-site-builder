// src/components/nav-projects.tsx
'use client'

import { MoreHorizontal, Palette } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const projectItems = [
  {
    name: 'Brand Assets',
    url: '/brand-assets',
    icon: Palette,
  },
]

export function NavProjects() {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Brand</SidebarGroupLabel>
      <SidebarMenu>
        {projectItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <span className='flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary'>
                  <item.icon className='h-4 w-4' />
                </span>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className='sr-only'>More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
