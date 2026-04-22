import { Link as IntlLink } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/constants'

export function CTASection() {
  const t = useTranslations('home.cta')

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-purple-500/15 blur-[130px]" />
      </div>
      <div className="container relative py-24 text-center md:py-36">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          {t('title')}
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="glow-primary-lg px-10 text-base">
            <IntlLink href="/contact">
              {t('primary')} <ArrowRight className="ml-2 h-4 w-4" />
            </IntlLink>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-10 text-base border-border/60 hover:border-primary/40">
            <IntlLink href="/contact#wechat">{t('secondary')}</IntlLink>
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          {t('emailHint')}{' '}
          <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
            {SITE.email}
          </a>
        </p>
      </div>
    </section>
  )
}
