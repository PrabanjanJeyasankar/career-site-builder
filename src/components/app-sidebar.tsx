// src/components/app-sidebar.tsx
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getCurrentUserWithCompany } from '@/lib/auth/getUser'

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  let userData = null

  try {
    userData = await getCurrentUserWithCompany()
  } catch (error) {
    console.error('Failed to fetch user data:', error)

    userData = {
      id: 'fallback-user',
      name: 'Developer',
      email: 'dev@example.com',
      avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=developer',
      company: {
        id: 'fallback-company',
        name: 'Development Company',
      },
      role: 'owner' as const,
    }
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher
          company={{ name: userData.company.name, plan: 'Enterprise' }}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userData.name || 'User',
            email: userData.email,
            // avatar: `https://api.dicebear.com/9.x/glass/svg?seed=Sophia`,
            avatar: `https://api.dicebear.com/9.x/glass/svg?backgroundColor=5038ee&scale=150`,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
