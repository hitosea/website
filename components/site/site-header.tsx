import Image from 'next/image'
import { Link as IntlLink } from '@/i18n/routing'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { LanguageSwitch } from './language-switch'
import { ThemeToggle } from './theme-toggle'
import { WeChatPopover } from './wechat-popover'

export async function SiteHeader() {
  const t = await getTranslations('nav')
  const tc = await getTranslations('common')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rule backdrop-blur-[10px] bg-[rgba(12,12,14,0.75)] dark:bg-[rgba(12,12,14,0.75)]" style={{ background: 'rgba(var(--bg-rgb, 12,12,14), 0.75)' }}>
      <div className="container flex h-[72px] items-center justify-between gap-6">
        {/* Brand */}
        <IntlLink href="/" className="flex items-center gap-3 no-underline">
          <Image
            src="/brand/logo-white.png"
            alt="Hitosea"
            width={120}
            height={32}
            className="hidden h-8 w-auto dark:block"
            priority
          />
          <Image
            src="/brand/logo-black.png"
            alt="Hitosea"
            width={120}
            height={32}
            className="block h-8 w-auto dark:hidden"
            priority
          />
        </IntlLink>

        {/* Nav links — editorial style */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {(['products', 'openSource', 'about'] as const).map((key) => {
            const href = key === 'products' ? '/#products' : key === 'openSource' ? '/open-source' : '/about'
            return (
              <IntlLink
                key={key}
                href={href}
                className="relative px-4 py-2.5 text-sm font-medium text-foreground/75 transition-opacity hover:text-foreground group"
              >
                {t(key)}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-[var(--ember)] origin-left scale-x-0 transition-transform group-hover:scale-x-100" />
              </IntlLink>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <LanguageSwitch />
          <WeChatPopover />
          <ThemeToggle />

          {/* Book a Demo — editorial primary button */}
          <IntlLink
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2.5 px-5 py-3 text-sm font-semibold bg-[var(--ember)] text-[#1a0b05] border border-[var(--ember)] shadow-[4px_4px_0_var(--ember-deep)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--ember-deep)] transition-all"
          >
            {tc('bookDemo')}
            <ArrowRight className="h-3.5 w-3.5" />
          </IntlLink>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden w-9 h-9 grid place-items-center border border-rule bg-transparent text-foreground"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
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
