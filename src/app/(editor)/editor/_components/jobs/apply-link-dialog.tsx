'use client'

import { ValidatedPromptDialog } from '@/app/(editor)/editor/_components/validated-prompt-dialog'

type ApplyLinkDialogProps = {
  open: boolean
  value: string
  onOpenChange: (open: boolean) => void
  onChange: (value: string) => void
  onConfirm: () => void
}

export function ApplyLinkDialog({
  open,
  value,
  onOpenChange,
  onChange,
  onConfirm,
}: ApplyLinkDialogProps) {
  return (
    <ValidatedPromptDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Add apply link'
      description='Paste the URL where candidates can apply for this position.'
      label='Apply URL'
      placeholder='https://example.com/apply'
      value={value}
      onValueChange={onChange}
      onConfirm={onConfirm}
    />
  )
}
