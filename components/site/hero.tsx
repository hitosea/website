import { Suspense } from 'react'
import { Link as IntlLink } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatsStrip } from './stats-strip'

export function Hero() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary blur-[128px]" />
      </div>
      <div className="container relative py-20 md:py-32">
        <p className="mb-6 inline-block rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          {t('eyebrow')}
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          <span className="text-muted-foreground">{t('titleLine1')}</span>
          <br />
          <span>{t('titleLine2')}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{t('lede')}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <IntlLink href="/contact">
              {t('primaryCta')} <ArrowRight className="ml-2 h-4 w-4" />
            </IntlLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <IntlLink href="/#products">{t('secondaryCta')}</IntlLink>
          </Button>
        </div>
        <Suspense fallback={<div className="mt-10 h-16" />}>
          <StatsStrip />
        </Suspense>
      </div>
    </section>
  )
}
