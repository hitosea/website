import { Suspense } from 'react'
import { Link as IntlLink } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatsStrip } from './stats-strip'

export function Hero() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[160px]" />
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="container relative py-28 md:py-40 lg:py-48">
        <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {t('eyebrow')}
        </p>

        <h1 className="max-w-5xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
          <span className="text-muted-foreground/80">{t('titleLine1')}</span>
          <br />
          <span className="text-gradient">{t('titleLine2')}</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t('lede')}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="glow-primary px-8 text-base">
            <IntlLink href="/contact">
              {t('primaryCta')} <ArrowRight className="ml-2 h-4 w-4" />
            </IntlLink>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8 text-base border-border/60 hover:border-primary/40">
            <IntlLink href="/#products">{t('secondaryCta')}</IntlLink>
          </Button>
        </div>

        <Suspense fallback={<div className="mt-14 h-16" />}>
          <StatsStrip />
        </Suspense>
      </div>

      {/* Bottom fade to next section */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
