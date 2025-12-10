// app-sidebar.tsx
import { redirect } from 'next/navigation'
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
  let userData

  try {
    userData = await getCurrentUserWithCompany()
  } catch (error) {
    console.error('Failed to fetch user data:', error)

    redirect('/login')
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
            avatar: `https://api.dicebear.com/9.x/glass/svg?backgroundColor=5038ee&scale=150`,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
