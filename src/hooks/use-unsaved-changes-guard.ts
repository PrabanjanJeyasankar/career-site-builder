// use-unsaved-changes-guard.ts

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

type UseUnsavedChangesGuardOptions = {
  isDirty: boolean
  onNavigationBlocked?: () => void
}

export function useUnsavedChangesGuard({
  isDirty,
  onNavigationBlocked,
}: UseUnsavedChangesGuardOptions) {
  const [showPrompt, setShowPrompt] = useState(false)
  const pendingNavigation = useRef<(() => void) | undefined>(undefined)
  const skipBlockRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const currentPathRef = useRef(pathname)

  useEffect(() => {
    currentPathRef.current = pathname
  }, [pathname])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  useEffect(() => {
    function handleLinkClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement)?.closest('a[href]')
      if (!anchor) return

      if (
        (anchor as HTMLAnchorElement).target &&
        (anchor as HTMLAnchorElement).target !== '_self'
      ) {
        return
      }

      const href = anchor.getAttribute('href')
      if (!href) return

      const url = new URL(href, window.location.href)
      const samePath = url.pathname === pathname

      if (samePath) return
      if (!isDirty || skipBlockRef.current) return

      event.preventDefault()
      pendingNavigation.current = () =>
        router.push(url.pathname + url.search + url.hash)
      setShowPrompt(true)
      onNavigationBlocked?.()
    }

    function handlePopState() {
      if (!isDirty || skipBlockRef.current) return

      const target =
        window.location.pathname + window.location.search + window.location.hash

      if (target === pathname) return

      router.replace(currentPathRef.current)
      pendingNavigation.current = () => router.push(target)
      setShowPrompt(true)
      onNavigationBlocked?.()
    }

    document.addEventListener('click', handleLinkClick, true)
    window.addEventListener('popstate', handlePopState)

    return () => {
      document.removeEventListener('click', handleLinkClick, true)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isDirty, pathname, router, onNavigationBlocked])

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false)
    if (pendingNavigation.current) {
      skipBlockRef.current = true
      pendingNavigation.current()
      pendingNavigation.current = undefined
    }
  }, [])

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false)
    pendingNavigation.current = undefined
  }, [])

  const allowNavigation = useCallback(() => {
    skipBlockRef.current = true
  }, [])

  return {
    showPrompt,
    setShowPrompt,
    confirmNavigation,
    cancelNavigation,
    allowNavigation,
    pendingNavigation,
  }
}
