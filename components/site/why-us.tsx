import { useTranslations } from 'next-intl'

const ITEMS = [
  { key: 'openSource', roman: 'I.', accent: 'var(--ember)' },
  { key: 'enterprise', roman: 'II.', accent: 'var(--ochre)' },
  { key: 'matrix', roman: 'III.', accent: 'var(--teal)' },
  { key: 'devFriendly', roman: 'IV.', accent: 'var(--plum)' },
] as const

export function WhyUs() {
  const t = useTranslations('home.whyUs')
  const tItem = useTranslations('home.whyUs.items')

  return (
    <section className="relative py-24 md:py-32" id="about">
      <div className="container">
        {/* Section rule */}
        <div className="border-t border-rule pt-7 mb-16 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div className="section-label">{t('sectionId')}</div>
          <div className="font-mono text-[11px] tracking-widest text-mute">{t('sectionMeta')}</div>
        </div>

        <h2
          className="font-serif font-normal text-3xl md:text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-7 max-w-[1100px] text-balance"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          {t('title')}
        </h2>
        <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-[680px] mb-14">
          {t('subtitle')}
        </p>

        {/* 2-column ticket grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {ITEMS.map(({ key, roman, accent }, i) => (
            <div
              key={key}
              className="relative border border-rule p-8 md:p-9 grid grid-cols-[48px_1fr] gap-6"
              style={{ background: 'linear-gradient(180deg, rgba(243,238,228,0.015), transparent)' }}
            >
              {/* Left accent bar */}
              <div
                className="absolute top-0 left-0 w-1.5 h-full"
                style={{ background: accent }}
                aria-hidden
              />

              {/* Roman numeral */}
              <div
                className="font-serif text-4xl italic font-normal leading-none"
                style={{ color: accent, fontVariationSettings: '"opsz" 144' }}
              >
                {roman}
              </div>

              {/* Content */}
              <div>
                <h4
                  className="font-serif font-medium text-xl md:text-2xl mb-2.5 tracking-tight"
                  style={{ fontVariationSettings: '"opsz" 72' }}
                >
                  {tItem(`${key}.title` as `${typeof key}.title`)}
                </h4>
                <p className="text-sm md:text-[14.5px] leading-relaxed text-foreground/78">
                  {tItem(`${key}.desc` as `${typeof key}.desc`)}
                </p>
              </div>

              {/* Top-right counter */}
              <div className="absolute top-8 right-8 font-mono text-[10px] tracking-[0.15em] text-mute">
                № 0{i + 1} / 04
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
