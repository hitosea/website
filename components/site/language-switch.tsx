'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Button } from '@/components/ui/button'

export function LanguageSwitch() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    const next = locale === 'zh' ? 'en' : 'zh'
    router.replace(pathname, { locale: next })
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Switch language">
      {locale === 'zh' ? 'EN' : '中'}
    </Button>
  )
}
