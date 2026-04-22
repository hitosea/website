import { Suspense } from 'react'
import { Link as IntlLink } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { HeroStats } from './hero-stats'
import { HeroIndexCard } from './hero-index-card'

export function Hero() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative py-16 md:py-20">
      <div className="container">
        {/* Top bar: Issue line + dateline */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-rule pb-4 mb-10 md:mb-12 font-mono text-xs tracking-widest uppercase text-mute">
          <div className="text-ember">{t('issueLine')}</div>
          <div className="mt-1 sm:mt-0">
            {t('dateline')} · <span className="text-foreground">{t('datelineCity')}</span>
          </div>
        </div>

        {/* Hero title — large Fraunces display */}
        <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[112px] leading-[1.0] tracking-[-0.04em] mb-8 md:mb-10 text-balance" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}>
          {t('titleLine1')}
          <em className="not-italic text-ember" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}>
            {t('titleAccent1')}
          </em>
          <br className="hidden md:block" />
          {t('titleLine2')}
          <span className="italic text-ochre" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
            {t('titleAmp')}
          </span>
          {t('titleLine3')}
          <em className="not-italic text-ember" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}>
            {t('titleAccent2')}
          </em>
          {t('titleEnd')}
        </h1>

        {/* Two-column: left = dropcap + CTAs, right = index card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 lg:gap-20 items-end">
          <div>
            <p className="dropcap text-base md:text-lg leading-relaxed text-foreground/85 max-w-[640px]">
              {t('lede')}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <IntlLink
                href="/contact"
                className="btn-editorial btn-editorial-primary btn-editorial-lg inline-flex items-center gap-2.5"
              >
                {t('primaryCta')}
                <ArrowRight className="h-3.5 w-3.5" />
              </IntlLink>
              <IntlLink
                href="/#products"
                className="btn-editorial btn-editorial-ghost btn-editorial-lg"
              >
                {t('secondaryCta')}
              </IntlLink>
            </div>
          </div>

          {/* Index card — hidden on small screens */}
          <aside className="hidden md:block">
            <Suspense fallback={<IndexCardSkeleton />}>
              <HeroIndexCard />
            </Suspense>
          </aside>
        </div>

        {/* Big stats bar */}
        <Suspense fallback={<div className="mt-20 h-32 border-t border-b border-rule" />}>
          <HeroStats />
        </Suspense>
      </div>
    </section>
  )
}

function IndexCardSkeleton() {
  return (
    <div className="border border-rule animate-pulse">
      <div className="h-10 bg-[rgba(229,106,63,0.08)] border-b border-rule" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 border-b border-dashed border-rule" />
      ))}
    </div>
  )
}
