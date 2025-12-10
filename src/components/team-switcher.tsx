// src/components/team-switcher.tsx
'use client'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import Logo from './common/Logo'

interface CompanyHeaderProps {
  company: {
    name: string
    plan?: string
  }
}

export function TeamSwitcher({ company }: CompanyHeaderProps) {
  const { state } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {state === 'collapsed' ? (
          <div className='relative flex items-center justify-center w-full group'>
            {/* Logo visible by default, fades out on hover */}
            <div className='transition-opacity duration-200 group-hover:opacity-0'>
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Logo />
              </div>
            </div>

            {/* Toggle appears on hover, centered over the logo with smooth animation */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='opacity-0 scale-75 transform transition-all duration-200 group-hover:opacity-100 group-hover:scale-100'>
                <SidebarTrigger />
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <SidebarMenuButton
              size='lg'
              className='flex-1 bg-sidebar data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Logo />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{company.name}</span>
                {company.plan && (
                  <span className='truncate text-xs'>{company.plan}</span>
                )}
              </div>
            </SidebarMenuButton>
            <SidebarTrigger className='ml-auto' />
          </div>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
