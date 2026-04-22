import { Link as IntlLink } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  const t = useTranslations('home.cta')
  const locale = useLocale()

  return (
    <section className="relative py-28 md:py-36 text-center" id="demo">
      {/* Double horizontal rules */}
      <div className="absolute left-0 right-0 top-14 md:top-16 h-px bg-rule" aria-hidden />
      <div className="absolute left-0 right-0 bottom-14 md:bottom-16 h-px bg-rule" aria-hidden />

      <div className="container">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-ember mb-7">
          {'◉'} {t('preLabel')}
        </div>
        <h2
          className="font-serif font-normal text-3xl md:text-5xl lg:text-7xl xl:text-[80px] leading-[1.06] tracking-tight mx-auto max-w-[1000px] text-balance mb-10"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
            lineHeight: locale === 'zh' ? 1.18 : 1.0,
          }}
        >
          {t('title')}
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <IntlLink
            href="/contact"
            className="btn-editorial btn-editorial-primary btn-editorial-lg inline-flex items-center gap-2.5"
          >
            {t('primary')}
            <ArrowRight className="h-3.5 w-3.5" />
          </IntlLink>
          <IntlLink
            href="/contact#wechat"
            className="btn-editorial btn-editorial-ghost btn-editorial-lg"
          >
            {t('secondary')}
          </IntlLink>
        </div>
      </div>
    </section>
  )
}
