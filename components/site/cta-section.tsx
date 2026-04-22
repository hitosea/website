import { Link as IntlLink } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/constants'

export function CTASection() {
  const t = useTranslations('home.cta')

  return (
    <section className="relative overflow-hidden border-t border-border/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[128px]" />
      </div>
      <div className="container relative py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          {t('title')}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <IntlLink href="/contact">
              {t('primary')} <ArrowRight className="ml-2 h-4 w-4" />
            </IntlLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <IntlLink href="/contact#wechat">{t('secondary')}</IntlLink>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {t('emailHint')}{' '}
          <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
            {SITE.email}
          </a>
        </p>
      </div>
    </section>
  )
}
