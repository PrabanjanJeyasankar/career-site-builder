'use client'

import { useMemo, useState } from 'react'
import {
  LifeBuoy,
  Link2,
  MonitorSmartphone,
  MousePointerClick,
  MoveVertical,
  Palette,
  UploadCloud,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function HelpDialog() {
  const [open, setOpen] = useState(false)
  const sections = useMemo(
    () => [
      {
        icon: MoveVertical,
        title: 'Reorder sections',
        body: 'Drag in the editor or sidebar. Hero stays first, Jobs last. Drops save automatically.',
      },
      {
        icon: MousePointerClick,
        title: 'Edit inline',
        body: 'Double-click text to edit. Click icons/images to update media.',
      },
      {
        icon: Palette,
        title: 'Brand colors & assets',
        body: 'Use Brand Assets for logo, favicon, and primary/secondary colors.',
      },
      {
        icon: UploadCloud,
        title: 'Add your own images',
        body: 'Use the image upload buttons or dialogs to pick files from your computer or paste a URL—previews appear instantly.',
      },
      {
        icon: MonitorSmartphone,
        title: 'Preview devices',
        body: 'Use the Preview button to switch desktop, tablet, mobile views.',
      },
      {
        icon: Link2,
        title: 'Apply links',
        body: 'Add apply URLs per role; updates sync to previews instantly.',
      },
    ],
    []
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size='sm'
              tooltip='Help & tips'
              className='justify-start text-left text-sm'>
              <LifeBuoy className='h-4 w-4 text-primary' />
              <span className='truncate'>Help & tips</span>
            </SidebarMenuButton>
          </DialogTrigger>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to use the editor</DialogTitle>
          <DialogDescription>
            Quick pointers to build and preview your career site.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-6 text-sm text-foreground'>
          <div className='grid gap-4 md:grid-cols-2'>
            {sections.map((section) => (
              <div
                key={section.title}
                className='flex gap-3 rounded-lg border border-border bg-muted/40 p-3'>
                <div className='mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary p-2'>
                  <section.icon className='h-4 w-4' />
                </div>
                <div className='space-y-1'>
                  <p className='font-semibold leading-none'>{section.title}</p>
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {section.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className='rounded-lg bg-primary/5 p-4 text-sm text-primary-foreground/80'>
            <p className='font-semibold text-primary'>Pro tip</p>
            <p className='text-primary/90'>
              Use the sidebar handles to reorder while you skim the outline; the
              preview updates immediately.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
