import { Link as IntlLink } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { LanguageSwitch } from './language-switch'
import { ThemeToggle } from './theme-toggle'
import { WeChatPopover } from './wechat-popover'
import { SITE } from '@/lib/constants'

export async function SiteHeader() {
  const t = await getTranslations('nav')
  const tc = await getTranslations('common')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <IntlLink href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">{SITE.nameZh}</span>
          <span className="hidden text-sm text-muted-foreground md:inline">
            {SITE.name}
          </span>
        </IntlLink>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <IntlLink href="/#products" className="text-muted-foreground hover:text-foreground">
            {t('products')}
          </IntlLink>
          <IntlLink href="/open-source" className="text-muted-foreground hover:text-foreground">
            {t('openSource')}
          </IntlLink>
          <IntlLink href="/about" className="text-muted-foreground hover:text-foreground">
            {t('about')}
          </IntlLink>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <WeChatPopover />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <IntlLink href="/contact">{tc('bookDemo')}</IntlLink>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-4 text-lg">
                <IntlLink href="/#products">{t('products')}</IntlLink>
                <IntlLink href="/open-source">{t('openSource')}</IntlLink>
                <IntlLink href="/about">{t('about')}</IntlLink>
                <IntlLink href="/contact">{tc('bookDemo')}</IntlLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
